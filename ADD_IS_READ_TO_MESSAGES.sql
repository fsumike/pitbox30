-- Add read status tracking to messages table
-- This fixes the unread message count issue

-- Add is_read column with default false
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false NOT NULL;

-- Add read_at column for tracking when message was read
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- Create index for efficient unread message queries
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(receiver_id, is_read) WHERE is_read = false;

-- Create index for receiver_id and created_at for conversation queries
CREATE INDEX IF NOT EXISTS idx_messages_receiver_created ON messages(receiver_id, created_at DESC);

-- Create index for sender_id and created_at for conversation queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_created ON messages(sender_id, created_at DESC);

-- Mark all existing messages as read (cleanup for existing data)
-- This will clear your current unread count
UPDATE messages SET is_read = true, read_at = now() WHERE is_read = false;
