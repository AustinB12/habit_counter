import { useEffect, useState } from 'react';
import type { User } from '../App';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const IS_PROD =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_BASE_URL = IS_PROD
  ? 'https://habit-counter-api.onrender.com'
  : 'http://localhost:3001';

interface User_View_Props {
  user_id: number;
}

export const User_View = ({ user_id }: User_View_Props) => {
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const {
    data: me,
    isLoading,
    error: queryError,
  } = useQuery<User>({
    queryKey: ['user', user_id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/users/${user_id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });

  const {
    mutate: updateCount,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: async (count: number) => {
      const res = await fetch(`${API_BASE_URL}/users/${user_id}/count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, description }),
      });
      if (!res.ok) throw new Error('Failed to update count');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user_id] });
    },
  });

  const isDisabled = isLoading || isPending;

  return (
    <div className='user-view-container'>
      {isLoading && (
        <div className='loadingspinner'>
          <div id='square1'></div>
          <div id='square2'></div>
          <div id='square3'></div>
          <div id='square4'></div>
          <div id='square5'></div>
        </div>
      )}
      {!isLoading && !queryError && me?.name && (
        <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}>
          {me?.name}
        </h2>
      )}
      <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
        Count: {me?.count ?? 'Loading...'}
      </h3>
      {queryError && (
        <p className='error'>Error loading user: {queryError.message}</p>
      )}
      {mutationError && (
        <p className='error'>Error updating count: {mutationError.message}</p>
      )}
      <div className='button-container'>
        <button
          className='modify-count-button'
          onClick={() => updateCount(1)}
          disabled={isDisabled}
        >
          +1
        </button>
        <button
          className='modify-count-button'
          onClick={() => updateCount(-1)}
          disabled={isDisabled}
        >
          -1
        </button>
        <button
          className='modify-count-button'
          onClick={() => updateCount(5)}
          disabled={isDisabled}
        >
          +5
        </button>
        <button
          className='modify-count-button'
          onClick={() => updateCount(-5)}
          disabled={isDisabled}
        >
          -5
        </button>
        <button
          className='modify-count-button'
          onClick={() => updateCount(10)}
          disabled={isDisabled}
        >
          +10
        </button>
        <button
          className='modify-count-button'
          onClick={() => updateCount(-10)}
          disabled={isDisabled}
        >
          -10
        </button>
      </div>
      <section className='description-container' style={{ margin: '1rem 0' }}>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder='Description...'
          id='story'
          name='story'
          rows={5}
          cols={isMobile ? 40 : 65}
        ></textarea>
      </section>
    </div>
  );
};
