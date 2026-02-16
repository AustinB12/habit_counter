import type { User } from '@/App';
import { useState, useEffect } from 'react';

interface User_View_Props {
  user_id: number;
}

export const User_View = ({ user_id }: User_View_Props) => {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/users/' + user_id)
      .then((res) => res.json())
      .then((data) => {
        setMe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        setLoading(false);
      });
  }, [user_id]);

  const updateCount = async (countAdded: number) => {
    try {
      const response = await fetch(`/api/users/${user_id}/count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count_added: countAdded,
          description: `${countAdded > 0 ? 'Added' : 'Subtracted'} ${Math.abs(countAdded)}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update count');
      }

      const data = await response.json();
      setMe((prev) => (prev ? { ...prev, count: data.new_count } : null));
    } catch (err) {
      console.error('Error updating count:', err);
    }
  };

  return (
    <div className='user-view-container'>
      <h2>User ID: {user_id}</h2>
      <h3>Count: {me?.count ?? 'Loading...'}</h3>
      <div className='button-container'>
        <button className='modify-count-button' onClick={() => updateCount(1)}>
          +1
        </button>
        <button className='modify-count-button' onClick={() => updateCount(-1)}>
          -1
        </button>
        <button className='modify-count-button' onClick={() => updateCount(5)}>
          +5
        </button>
        <button className='modify-count-button' onClick={() => updateCount(-5)}>
          -5
        </button>
      </div>
    </div>
  );
};
