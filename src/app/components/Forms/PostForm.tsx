'use client'

import { FormEvent, useRef, useState } from 'react';
import type { Post } from '@/types/form';
import styles from './Forms.module.scss';

interface Props {
  handleCreate: (post: Post) => void;
}

export default function PostForm({ handleCreate }: Props) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      titleRef.current?.focus();
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required');
      subjectRef.current?.focus();
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      contentRef.current?.focus();
      return;
    }

    handleCreate({
      id: crypto.randomUUID(),
      title,
      subject,
      content,
      timestamp: new Date().toISOString(),
    });

    setTitle('');
    setSubject('');
    setContent('');
    setError(null);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        ref={titleRef}
        name="title"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        aria-invalid={!!error && !title}
      />
      <input
        ref={subjectRef}
        name="subject"
        placeholder="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        aria-invalid={!!error && !subject}
      />
      <textarea
        ref={contentRef}
        rows={3}
        name="content"
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        aria-invalid={!!error && !content}
      />
      <button type="submit" className={styles.submit}>Submit</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
