import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, User, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import CreateStoryModal from './CreateStoryModal';

interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  duration: number;
  view_count: number;
  expires_at: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  has_viewed?: boolean;
}

interface StoryGroup {
  user_id: string;
  username: string;
  avatar_url: string | null;
  stories: Story[];
  has_unviewed: boolean;
}

export default function StoriesBar() {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StoryGroup | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    loadStories();
  }, [user]);

  useEffect(() => {
    if (selectedGroup && selectedGroup.stories[currentStoryIndex]) {
      const story = selectedGroup.stories[currentStoryIndex];
      markStoryAsViewed(story.id);
      startProgress(story.duration);

      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
    }
  }, [selectedGroup, currentStoryIndex]);

  const loadStories = async () => {
    try {
      const { data: stories, error } = await supabase
        .from('stories')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userIds = [...new Set(stories?.map(s => s.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const storiesWithProfiles = stories?.map(story => ({
        ...story,
        profiles: profileMap.get(story.user_id)
      })) || [];

      if (user) {
        const storyIds = storiesWithProfiles.map(s => s.id);
        const { data: views } = await supabase
          .from('story_views')
          .select('story_id')
          .eq('user_id', user.id)
          .in('story_id', storyIds);

        const viewedIds = new Set(views?.map(v => v.story_id) || []);

        const storiesWithViews = storiesWithProfiles.map(story => ({
          ...story,
          has_viewed: viewedIds.has(story.id)
        }));

        const groups: { [key: string]: StoryGroup } = {};

        storiesWithViews.forEach(story => {
          if (!groups[story.user_id]) {
            groups[story.user_id] = {
              user_id: story.user_id,
              username: story.profiles?.username || 'Unknown',
              avatar_url: story.profiles?.avatar_url || null,
              stories: [],
              has_unviewed: false
            };
          }

          groups[story.user_id].stories.push(story);
          if (!story.has_viewed) {
            groups[story.user_id].has_unviewed = true;
          }
        });

        setStoryGroups(Object.values(groups));
      } else {
        const groups: { [key: string]: StoryGroup } = {};

        storiesWithProfiles.forEach(story => {
          if (!groups[story.user_id]) {
            groups[story.user_id] = {
              user_id: story.user_id,
              username: story.profiles?.username || 'Unknown',
              avatar_url: story.profiles?.avatar_url || null,
              stories: [],
              has_unviewed: false
            };
          }
          groups[story.user_id].stories.push(story);
        });

        setStoryGroups(Object.values(groups));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const startProgress = (duration: number) => {
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const increment = 100 / (duration * 10);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + increment;
      });
    }, 100);
  };

  const markStoryAsViewed = async (storyId: string) => {
    if (!user) return;

    try {
      const { error: insertError } = await supabase
        .from('story_views')
        .insert({ story_id: storyId, user_id: user.id });

      if (!insertError) {
        const { data: story } = await supabase
          .from('stories')
          .select('view_count')
          .eq('id', storyId)
          .single();

        if (story) {
          await supabase
            .from('stories')
            .update({ view_count: story.view_count + 1 })
            .eq('id', storyId);
        }
      }
    } catch (error) {
      }
  };

  const nextStory = () => {
    if (!selectedGroup) return;

    if (currentStoryIndex < selectedGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      const currentGroupIndex = storyGroups.findIndex(g => g.user_id === selectedGroup.user_id);
      if (currentGroupIndex < storyGroups.length - 1) {
        setSelectedGroup(storyGroups[currentGroupIndex + 1]);
        setCurrentStoryIndex(0);
      } else {
        closeStoryViewer();
      }
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      const currentGroupIndex = storyGroups.findIndex(g => g.user_id === selectedGroup?.user_id);
      if (currentGroupIndex > 0) {
        const prevGroup = storyGroups[currentGroupIndex - 1];
        setSelectedGroup(prevGroup);
        setCurrentStoryIndex(prevGroup.stories.length - 1);
      }
    }
  };

  const closeStoryViewer = () => {
    setSelectedGroup(null);
    setCurrentStoryIndex(0);
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const handleDeleteStory = async () => {
    if (!selectedGroup || !user) {
      alert('Error: Not logged in or no story selected');
      return;
    }

    const currentStory = selectedGroup.stories[currentStoryIndex];

    if (currentStory.user_id !== user.id) {
      alert('You can only delete your own stories');
      return;
    }

    if (!confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      console.log('Attempting to delete story:', currentStory.id);

      const { data, error } = await supabase
        .from('stories')
        .delete()
        .eq('id', currentStory.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert(`Failed to delete story: ${error.message}`);
        return;
      }

      console.log('Story deleted successfully:', data);

      const updatedStories = selectedGroup.stories.filter(s => s.id !== currentStory.id);

      if (updatedStories.length === 0) {
        closeStoryViewer();
        loadStories();
      } else {
        setSelectedGroup({
          ...selectedGroup,
          stories: updatedStories
        });

        if (currentStoryIndex >= updatedStories.length) {
          setCurrentStoryIndex(updatedStories.length - 1);
        }

        loadStories();
      }
    } catch (error: any) {
      console.error('Error deleting story:', error);
      alert(`Failed to delete story: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleAddStory = () => {
    setShowCreateModal(true);
  };

  if (storyGroups.length === 0 && user) {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={handleAddStory}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white dark:border-gray-800">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Add Story</span>
            </button>
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No stories yet. Be the first to share!
              </p>
            </div>
          </div>
        </div>

        <CreateStoryModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadStories();
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {user && (
            <button
              type="button"
              onClick={handleAddStory}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white dark:border-gray-800">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Add Story</span>
            </button>
          )}

          {storyGroups.map((group) => (
            <button
              key={group.user_id}
              onClick={() => {
                setSelectedGroup(group);
                setCurrentStoryIndex(0);
              }}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer"
            >
              <div className={`p-1 rounded-full ${group.has_unviewed ? 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                {group.avatar_url ? (
                  <img
                    src={group.avatar_url}
                    alt={group.username}
                    className="w-14 h-14 rounded-full object-cover border-4 border-white dark:border-gray-800"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                {group.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 right-0 z-20 p-4">
                <div className="flex gap-1 mb-4">
                  {selectedGroup.stories.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      {index === currentStoryIndex && (
                        <div
                          className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                      {index < currentStoryIndex && (
                        <div className="h-full bg-white rounded-full w-full" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedGroup.avatar_url ? (
                      <img
                        src={selectedGroup.avatar_url}
                        alt={selectedGroup.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">{selectedGroup.username}</p>
                      <p className="text-white/80 text-xs">
                        {formatDistanceToNow(new Date(selectedGroup.stories[currentStoryIndex].created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user && selectedGroup.stories[currentStoryIndex].user_id === user.id && (
                      <button
                        onClick={handleDeleteStory}
                        className="text-white p-2 hover:bg-red-500/50 rounded-full transition-colors"
                        title="Delete story"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={closeStoryViewer}
                      className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={previousStory}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {selectedGroup.stories[currentStoryIndex].media_type === 'image' ? (
                <img
                  src={selectedGroup.stories[currentStoryIndex].media_url}
                  alt="Story"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={selectedGroup.stories[currentStoryIndex].media_url}
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  playsInline
                />
              )}

              <div
                className="absolute inset-0 flex"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  if (x < rect.width / 2) {
                    previousStory();
                  } else {
                    nextStory();
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          loadStories();
        }}
      />
    </>
  );
}
