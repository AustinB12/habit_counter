import type { Habit_History } from '../App';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const IS_PROD = import.meta.env.PROD;
const API_BASE_URL = IS_PROD
  ? import.meta.env.API_URL || 'https://habit-counter-api.onrender.com'
  : 'http://localhost:3001';

interface HistoryCardProps {
  record: Habit_History;
  hide_desc?: boolean;
}

const HistoryCard = ({ record, hide_desc = true }: HistoryCardProps) => {
  return (
    <div
      style={{
        borderRadius: '1rem',
        padding: '0.3rem 1.75rem',
        marginBottom: '0.5rem',
        backgroundColor: '#ffffff10',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        {record.user_id === 1 ? (
          <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>Austin</span>
        ) : (
          <span style={{ fontWeight: 'bold', color: '#d73bf6' }}>Mariana</span>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
            {record.running_total - record.count_added}
          </span>

          <span
            style={{
              color: record.count_added > 0 ? '#10b981' : '#ef4444',
              fontWeight: 'bold',
              margin: '0 0.5rem',
            }}
          >
            {record.count_added > 0 ? '+' : ''}
          </span>
          <span
            style={{
              color: record.count_added > 0 ? '#10b981' : '#ef4444',
              fontWeight: 'bold',
            }}
          >
            {record.count_added}
          </span>
          <span style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>{'='}</span>
          <span style={{ fontWeight: 'bold' }}>{record.running_total}</span>
        </div>
      </div>
      {!hide_desc && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>Description:</span>
          <span>{record.description}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{new Date(record.created_at).toLocaleString()}</span>
      </div>
    </div>
  );
};

export const History_View = () => {
  const queryClient = useQueryClient();
  const {
    data: history = [],
    isLoading: loading,
    error,
  } = useQuery<Habit_History[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    },
  });

  const { mutate: clearHistory, isPending: isClearing } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/history`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear history');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  const [hide_desc, setHideDesc] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div
      className='history-view-container'
      style={{
        padding: '1rem',
        width: 'clamp(320px, 100vw, 1600px)',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: 'white',
        }}
      >
        Habit History
      </h1>
      <History_Header
        hide_desc={hide_desc}
        set_hide_desc={setHideDesc}
        on_clear={clearHistory}
        is_clearing={isClearing}
      />
      {error && <p style={{ color: '#ef4444' }}>Error: {error.message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : isMobile ? (
        <div>
          {history.map((record) => (
            <HistoryCard
              key={record.id}
              record={record}
              hide_desc={hide_desc}
            />
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #e5e7eb',
                }}
              >
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                  User ID
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                  Count Added
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                  Running Total
                </th>
                {!hide_desc && (
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                    Description
                  </th>
                )}
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr
                  key={record.id}
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    {record.user_id === 1 ? (
                      <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                        Austin
                      </span>
                    ) : (
                      <span style={{ fontWeight: 'bold', color: '#d73bf6' }}>
                        Mariana
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      color: record.count_added > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold',
                    }}
                  >
                    {record.count_added > 0 ? '+' : ''}
                    {record.count_added}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                    {record.running_total}
                  </td>
                  {!hide_desc && (
                    <td style={{ padding: '0.75rem' }}>{record.description}</td>
                  )}
                  <td
                    style={{
                      padding: '0.75rem',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                    }}
                  >
                    {new Date(record.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const History_Header = ({
  hide_desc,
  set_hide_desc,
  on_clear,
  is_clearing,
}: {
  hide_desc: boolean;
  set_hide_desc: React.Dispatch<React.SetStateAction<boolean>>;
  on_clear: () => void;
  is_clearing: boolean;
}) => {
  const handleClear = () => {
    if (
      window.confirm(
        'Are you sure you want to delete all history records? This action cannot be undone.',
      )
    ) {
      on_clear();
    }
  };

  return (
    <div className='history-header'>
      <input type='checkbox' id='checkbox' />
      <label htmlFor='checkbox' className='toggle'>
        <div className='bars' id='bar1'></div>
        <div className='bars' id='bar2'></div>
        <div className='bars' id='bar3'></div>
        <button
          className='menu-button'
          onClick={() => set_hide_desc(!hide_desc)}
        >
          {hide_desc ? 'Show' : 'Hide'} Description
        </button>
        <button
          className='menu-button'
          onClick={handleClear}
          disabled={is_clearing}
        >
          {is_clearing ? 'Clearing...' : 'Clear'}
        </button>
      </label>
    </div>
  );
};
