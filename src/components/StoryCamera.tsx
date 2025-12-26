import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Video, Image as ImageIcon, Type, Download, Send, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryCameraProps {
  onClose: () => void;
  onSuccess: () => void;
}

type CaptureMode = 'photo' | 'video';
type Filter = 'none' | 'grayscale' | 'sepia' | 'brightness' | 'contrast' | 'saturate';

export default function StoryCamera({ onClose, onSuccess }: StoryCameraProps) {
  const [mode, setMode] = useState<CaptureMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [textOverlay, setTextOverlay] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<Filter>('none');
  const [uploading, setUploading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1080, height: 1920 },
        audio: mode === 'video'
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedMedia(imageUrl);
    setMediaType('image');
    stopCamera();
  };

  const startRecording = async () => {
    if (!stream) return;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setCapturedMedia(videoUrl);
      setMediaType('video');
      stopCamera();
    };

    mediaRecorder.start(100);
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 15) {
          stopRecording();
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';

    setCapturedMedia(url);
    setMediaType(type);
    stopCamera();
  };

  const retake = () => {
    setCapturedMedia(null);
    setTextOverlay('');
    setSelectedFilter('none');
    startCamera();
  };

  const getFilterStyle = (filter: Filter): React.CSSProperties => {
    switch (filter) {
      case 'grayscale': return { filter: 'grayscale(100%)' };
      case 'sepia': return { filter: 'sepia(100%)' };
      case 'brightness': return { filter: 'brightness(130%)' };
      case 'contrast': return { filter: 'contrast(130%)' };
      case 'saturate': return { filter: 'saturate(200%)' };
      default: return {};
    }
  };

  const uploadStory = async () => {
    if (!capturedMedia || !user) return;

    setUploading(true);
    try {
      let mediaUrl = '';

      if (capturedMedia.startsWith('data:')) {
        const response = await fetch(capturedMedia);
        const blob = await response.blob();
        const fileName = `story_${user.id}_${Date.now()}.${mediaType === 'image' ? 'jpg' : 'webm'}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('stories')
          .upload(fileName, blob, {
            contentType: mediaType === 'image' ? 'image/jpeg' : 'video/webm',
            cacheControl: '3600'
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('stories')
          .getPublicUrl(fileName);

        mediaUrl = urlData.publicUrl;
      } else {
        mediaUrl = capturedMedia;
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: mediaUrl,
          media_type: mediaType,
          duration: mediaType === 'image' ? 5 : 15,
          expires_at: expiresAt.toISOString(),
          text_overlay: textOverlay || null,
          filter: selectedFilter !== 'none' ? selectedFilter : null
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading story:', error);
      alert('Failed to upload story. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filters: { name: Filter; label: string; icon: React.ReactNode }[] = [
    { name: 'none', label: 'Original', icon: <Camera className="w-4 h-4" /> },
    { name: 'grayscale', label: 'B&W', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'sepia', label: 'Vintage', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'brightness', label: 'Bright', icon: <Zap className="w-4 h-4" /> },
    { name: 'contrast', label: 'Contrast', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'saturate', label: 'Vivid', icon: <Sparkles className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-[99999] bg-black">
      <div className="relative w-full h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!capturedMedia ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={getFilterStyle(selectedFilter)}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('photo')}
                    className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                      mode === 'photo'
                        ? 'bg-white text-black'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    Photo
                  </button>
                  <button
                    onClick={() => setMode('video')}
                    className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                      mode === 'video'
                        ? 'bg-white text-black'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    Video
                  </button>
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-center gap-8 mb-6">
                {mode === 'photo' ? (
                  <button
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:scale-110 transition-transform"
                  />
                ) : (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                      isRecording ? 'bg-red-500' : 'bg-transparent'
                    }`}
                  >
                    {isRecording && (
                      <div className="w-8 h-8 bg-white rounded-sm" />
                    )}
                  </button>
                )}
              </div>

              {isRecording && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    {recordingTime}s / 15s
                  </div>
                </div>
              )}

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => setSelectedFilter(filter.name)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                      selectedFilter === filter.name
                        ? 'bg-brand-gold text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {filter.icon}
                    <span className="text-sm font-medium">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {mediaType === 'image' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img
                  src={capturedMedia}
                  alt="Captured"
                  className="max-w-full max-h-full object-contain"
                  style={getFilterStyle(selectedFilter)}
                />
                {textOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h2 className="text-4xl font-bold text-white text-center px-8 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {textOverlay}
                    </h2>
                  </div>
                )}
              </div>
            ) : (
              <video
                src={capturedMedia}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
                style={getFilterStyle(selectedFilter)}
              />
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <AnimatePresence>
                {showTextInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mb-4"
                  >
                    <input
                      type="text"
                      value={textOverlay}
                      onChange={(e) => setTextOverlay(e.target.value)}
                      placeholder="Add text to your story..."
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-lg border-2 border-white/30 focus:border-white outline-none"
                      maxLength={100}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={retake}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake
                </button>

                <button
                  onClick={() => setShowTextInput(!showTextInput)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    showTextInput ? 'bg-brand-gold text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Type className="w-5 h-5" />
                  Text
                </button>

                <button
                  onClick={uploadStory}
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-gold rounded-full text-white font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Share Story
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => setSelectedFilter(filter.name)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                      selectedFilter === filter.name
                        ? 'bg-brand-gold text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {filter.icon}
                    <span className="text-sm font-medium">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
