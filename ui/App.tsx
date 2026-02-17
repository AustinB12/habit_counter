import { Activity, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Nav } from './comps/nav';

import './index.css';
import { User_View } from './comps/user_view';
import { History_View } from './comps/hist_view';

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
          <Activity mode={location === 'austin' ? 'visible' : 'hidden'}>
            <User_View user_id={1} />
          </Activity>
          <Activity mode={location === 'mariana' ? 'visible' : 'hidden'}>
            <User_View user_id={2} />
          </Activity>
          <Activity mode={location === 'history' ? 'visible' : 'hidden'}>
            <History_View />
          </Activity>
        </div>
      </div>
    </QueryClientProvider>
  );
}
