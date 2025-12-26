import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Save, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VoiceNoteRecorderProps {
  setupId?: string;
  onSaved?: (noteId: string) => void;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  setupId,
  onSaved,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    audioChunksRef.current = [];
  };

  const saveRecording = async () => {
    if (!audioBlob) return;

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileName = `voice_notes/${user.id}/${Date.now()}.webm`;

      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('audio')
        .getPublicUrl(fileName);

      const { data: voiceNote, error: dbError } = await supabase
        .from('voice_notes')
        .insert({
          user_id: user.id,
          setup_id: setupId || null,
          audio_url: publicUrlData.publicUrl,
          duration: recordingTime,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      if (onSaved && voiceNote) {
        onSaved(voiceNote.id);
      }

      deleteRecording();
    } catch (error) {
      console.error('Error saving voice note:', error);
      alert('Failed to save voice note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Mic className="w-5 h-5" />
        Voice Note
      </h3>

      <div className="space-y-4">
        {!audioUrl && (
          <div className="flex flex-col items-center gap-4">
            {isRecording && (
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-red-600 mb-2">
                  {formatTime(recordingTime)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-600 animate-pulse'}`} />
                  <span className="text-sm text-gray-600">
                    {isPaused ? 'Paused' : 'Recording...'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Mic className="w-5 h-5" />
                  Start Recording
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseRecording}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transition-colors font-medium"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Square className="w-5 h-5" />
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {audioUrl && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Recording</span>
                <span className="text-sm text-gray-600">{formatTime(recordingTime)}</span>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="flex gap-2">
                <button
                  onClick={playRecording}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Play className="w-4 h-4" />
                  {isPlaying ? 'Stop' : 'Play'}
                </button>
                <button
                  onClick={deleteRecording}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            <button
              onClick={saveRecording}
              disabled={isSaving}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Voice Note
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Record quick notes about your setup. Perfect when your hands are dirty!
      </p>
    </div>
  );
};
