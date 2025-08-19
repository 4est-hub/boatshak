'use client'

import type { Post } from '@/types/form';
import styles from './PostCard.module.scss';

interface Props {
  post: Post;
  handleDelete: (id: string) => void;
}

export default function PostCard({ post, handleDelete }: Props) {
  return (
    <div className={styles.card}>
      <h3>{post.title}</h3>
      <h4>{post.subject}</h4>
      <p>{post.content}</p>
      <small>{new Date(post.timestamp).toLocaleString()}</small>
      <button onClick={() => handleDelete(post.id)} aria-label={`Delete post ${post.title}`}>
        Delete
      </button>
    </div>
  );
}
