import type { User } from '../App';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User_View_Props {
  user_id: number;
}

export const User_View = ({ user_id }: User_View_Props) => {
  const queryClient = useQueryClient();

  const { data: me, isLoading: loading } = useQuery<User>({
    queryKey: ['user', user_id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/users/${user_id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });

  const { mutate: updateCount } = useMutation({
    mutationFn: async (count: number) => {
      const res = await fetch(`http://localhost:3001/users/${user_id}/count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      if (!res.ok) throw new Error('Failed to update count');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user_id] });
    },
  });

  return (
    <div className='user-view-container'>
      <h2>{me?.name ?? 'Loading...'}</h2>
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
