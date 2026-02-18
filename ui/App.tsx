import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import { User_View } from './src/comps/user_view';
import { History_View } from './src/comps/hist_view';
import { Nav } from './src/comps/nav';

const queryClient = new QueryClient();

export interface User {
  id: number;
  name: string;
  count: number;
  created_at: string;
}

export interface Habit_History {
  id: number;
  user_id: number;
  count_added: number;
  running_total: number;
  description: string;
  created_at: string;
}

type Location = 'austin' | 'mariana' | 'history';

export function App() {
  const [location, setLocation] = useState<Location>('austin');
  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          maxWidth: '80rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 0,
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Nav current_location={location} set_location={setLocation} />
        <div
          id='main-content'
          style={{
            display: 'flex',
            width: '100%',
            height: '100dvh',
            flexDirection: 'row',
            overflowX: 'clip',
            position: 'relative',
          }}
        >
          {location === 'austin' && <User_View user_id={1} />}
          {location === 'mariana' && <User_View user_id={2} />}
          {location === 'history' && <History_View />}
        </div>
      </div>
    </QueryClientProvider>
  );
}
