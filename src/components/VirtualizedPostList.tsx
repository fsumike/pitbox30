import React from 'react';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post } from '../types';

interface VirtualizedPostListProps {
  posts: Post[];
  renderPost: (post: Post, index: number) => React.ReactNode;
  loading?: boolean;
  hasMore?: boolean;
  error?: string | null;
}

function VirtualizedPostList({ posts, renderPost, loading, error }: VirtualizedPostListProps) {
  const rowRenderer = ({ index, key, style }: any) => {
    const post = posts[index];
    return (
      <div key={key} style={style}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {renderPost(post, index)}
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button className="btn-primary">Try Again</button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Be the first to share something with the community!
        </p>
      </div>
    );
  }

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={posts.length}
              rowHeight={({ index }) => {
                // Estimate row height based on content
                const post = posts[index];
                let baseHeight = 200; // Base height for post header and actions
                
                // Add height for text content
                if (post.content) {
                  const contentLines = Math.ceil(post.content.length / 50); // Rough estimate of chars per line
                  baseHeight += contentLines * 24; // ~24px per line
                }
                
                // Add height for media
                if (post.image_url) baseHeight += 300;
                if (post.video_url) baseHeight += 350;
                
                // Add height for comments if expanded
                // This is just an estimate since we don't know if comments are expanded
                if (post.post_comments && post.post_comments.length > 0) {
                  baseHeight += 100; // Add space for "Show comments" button
                }
                
                return baseHeight;
              }}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={width}
              overscanRowCount={5} // Render a few extra rows above and below the visible area
              className="mobile-scroll"
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}

export default VirtualizedPostList;