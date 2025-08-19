'use client'

import PostForm from '@/app/components/Forms/PostForm';
import PostCard from '@/app/components/PostCard/PostCard';
import type { Post } from '@/types/form';
import styles from './Page.module.scss';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Community() {
  const [posts, setPosts] = useLocalStorage<Post[]>('posts', []);

  const handleCreate = (post: Post) => {
    setPosts(prev => [...prev, post]);
  };

  const handleDelete = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <>
      <PostForm handleCreate={handleCreate} />
      <div className={styles.list}>
        {!posts.length ? (
          <p>No posts</p>
        ) : (
          sortedPosts.map(post => (
            <PostCard key={post.id} post={post} handleDelete={handleDelete} />
          ))
        )}
      </div>
    </>
  );
}
