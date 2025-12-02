import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Image as ImageIcon, Video, Play, Pause, RotateCcw, Zap, Sparkles, Sun, Moon, Droplet, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type FilterType = 'none' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'vibrant' | 'vintage' | 'dramatic';

const filters: { name: FilterType; icon: React.ReactNode; label: string; css: string }[] = [
  { name: 'none', icon: <Zap className="w-5 h-5" />, label: 'Normal', css: 'none' },
  { name: 'grayscale', icon: <Moon className="w-5 h-5" />, label: 'B&W', css: 'grayscale(100%)' },
  { name: 'sepia', icon: <Droplet className="w-5 h-5" />, label: 'Sepia', css: 'sepia(80%)' },
  { name: 'warm', icon: <Sun className="w-5 h-5" />, label: 'Warm', css: 'saturate(1.3) hue-rotate(-10deg)' },
  { name: 'cool', icon: <Droplet className="w-5 h-5" />, label: 'Cool', css: 'saturate(1.2) hue-rotate(10deg) brightness(1.1)' },
  { name: 'vibrant', icon: <Sparkles className="w-5 h-5" />, label: 'Vibrant', css: 'saturate(1.8) contrast(1.2)' },
  { name: 'vintage', icon: <Flame className="w-5 h-5" />, label: 'Vintage', css: 'sepia(40%) saturate(0.8) contrast(1.1)' },
  { name: 'dramatic', icon: <Flame className="w-5 h-5" />, label: 'Drama', css: 'contrast(1.5) saturate(0.8) brightness(0.9)' },
];

export default function CreateStoryModal({ isOpen, onClose, onSuccess }: CreateStoryModalProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'preview'>('select');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    }, [isOpen]);

  useEffect(() => {
    if (mode === 'camera' && !cameraStream) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: mediaType === 'video'
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(startCamera, 100);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.filter = filters.find(f => f.name === selectedFilter)?.css || 'none';
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        setMode('preview');
        stopCamera();
      }
    }, 'image/jpeg', 0.95);
  };

  const startRecording = async () => {
    if (!cameraStream) return;

    try {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(cameraStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        setMode('preview');
        stopCamera();
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 15) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Recording error:', error);
    }
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

  const handleGalleryUpload = async (type: 'image' | 'video') => {
    try {
      const photo = await CapCamera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        quality: 90
      });

      if (photo.webPath) {
        setMediaUrl(photo.webPath);
        setMediaType(type);
        setMode('preview');
      }
    } catch (error) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = type === 'image' ? 'image/*' : 'video/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setMediaUrl(url);
          setMediaType(type);
          setMode('preview');
        }
      };
      input.click();
    }
  };

  const uploadStory = async () => {
    if (!mediaUrl || !user) return;

    setUploading(true);
    try {
      const blob = await fetch(mediaUrl).then(r => r.blob());
      const fileExt = mediaType === 'image' ? 'jpg' : 'webm';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('stories')
        .getPublicUrl(fileName);

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: urlData.publicUrl,
          media_type: mediaType,
          duration: mediaType === 'image' ? 5 : 15,
          expires_at: expiresAt.toISOString()
        });

      if (insertError) throw insertError;

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload story. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setMode('select');
    setMediaUrl(null);
    setMediaType('image');
    setSelectedFilter('none');
    setIsRecording(false);
    setRecordingTime(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black"
        >
        <button
          onClick={handleClose}
          className="absolute left-4 z-50 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          style={{ top: 'max(env(safe-area-inset-top, 0px) + 1rem, 1rem)' }}
        >
          <X className="w-6 h-6" />
        </button>

        {mode === 'select' && (
          <div className="flex items-center justify-center h-full">
            <div className="grid grid-cols-2 gap-4 p-8 max-w-md w-full">
              <motion.button
                onClick={() => {
                  setMediaType('image');
                  setMode('camera');
                }}
                className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex flex-col items-center justify-center gap-4 text-white hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-12 h-12" />
                <span className="font-bold">Take Photo</span>
              </motion.button>

              <motion.button
                onClick={() => {
                  setMediaType('video');
                  setMode('camera');
                }}
                className="aspect-square bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex flex-col items-center justify-center gap-4 text-white hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Video className="w-12 h-12" />
                <span className="font-bold">Record Video</span>
              </motion.button>

              <motion.button
                onClick={() => handleGalleryUpload('image')}
                className="aspect-square bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex flex-col items-center justify-center gap-4 text-white hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ImageIcon className="w-12 h-12" />
                <span className="font-bold">Upload Photo</span>
              </motion.button>

              <motion.button
                onClick={() => handleGalleryUpload('video')}
                className="aspect-square bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex flex-col items-center justify-center gap-4 text-white hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-12 h-12" />
                <span className="font-bold">Upload Video</span>
              </motion.button>
            </div>
          </div>
        )}

        {mode === 'camera' && (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-full object-contain"
              style={{ filter: filters.find(f => f.name === selectedFilter)?.css }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {isRecording && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                {recordingTime}s / 15s
              </div>
            )}

            <div className="absolute top-20 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setSelectedFilter(filter.name)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    selectedFilter === filter.name
                      ? 'bg-white text-black'
                      : 'bg-black/50 text-white'
                  }`}
                >
                  {filter.icon}
                  <span className="text-xs font-semibold">{filter.label}</span>
                </button>
              ))}
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8">
              <button
                onClick={switchCamera}
                className="p-4 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>

              {mediaType === 'image' ? (
                <button
                  onClick={capturePhoto}
                  className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:scale-110 transition-transform"
                />
              ) : (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white hover:scale-110'
                  }`}
                >
                  {isRecording ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-red-500" />
                  )}
                </button>
              )}

              <div className="w-12" />
            </div>
          </div>
        )}

        {mode === 'preview' && mediaUrl && (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
            {mediaType === 'image' ? (
              <img
                src={mediaUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                style={{ filter: filters.find(f => f.name === selectedFilter)?.css }}
              />
            ) : (
              <video
                src={mediaUrl}
                controls
                autoPlay
                loop
                className="max-w-full max-h-full object-contain"
              />
            )}

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
              <button
                onClick={() => {
                  setMediaUrl(null);
                  setMode('select');
                }}
                className="px-6 py-3 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors font-semibold"
              >
                Retake
              </button>
              <button
                onClick={uploadStory}
                disabled={uploading}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Share Story'}
              </button>
            </div>
          </div>
        )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
