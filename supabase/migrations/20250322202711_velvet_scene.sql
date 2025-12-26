/*
  # Add indexes and optimize queries for Community page

  1. Changes
    - Add indexes for frequently queried columns
    - Add composite indexes for common query patterns
    - Add indexes for sorting
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add indexes for posts table
CREATE INDEX IF NOT EXISTS posts_user_id_created_at_idx ON posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);

-- Add indexes for post_likes table
CREATE INDEX IF NOT EXISTS post_likes_post_id_user_id_idx ON post_likes(post_id, user_id);
CREATE INDEX IF NOT EXISTS post_likes_user_id_idx ON post_likes(user_id);

-- Add indexes for post_comments table
CREATE INDEX IF NOT EXISTS post_comments_post_id_created_at_idx ON post_comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS post_comments_user_id_idx ON post_comments(user_id);

-- Add indexes for profiles table
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_full_name_idx ON profiles(full_name);

-- Add indexes for friend_requests table
CREATE INDEX IF NOT EXISTS friend_requests_sender_receiver_status_idx ON friend_requests(sender_id, receiver_id, status);
CREATE INDEX IF NOT EXISTS friend_requests_receiver_status_idx ON friend_requests(receiver_id, status);

-- Add indexes for friendships table
CREATE INDEX IF NOT EXISTS friendships_user_id1_idx ON friendships(user_id1);
CREATE INDEX IF NOT EXISTS friendships_user_id2_idx ON friendships(user_id2);