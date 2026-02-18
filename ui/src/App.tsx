import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Nav } from './comps/nav';
import { User_View } from './comps/user_view';
import { History_View } from './comps/hist_view';

import './App.css';
import Bg from './comps/background';
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
function App() {
  const [location, setLocation] = useState<Location>('austin');
  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          marginLeft: 'auto',
          width: '100vw',
          marginRight: 'auto',
          padding: 0,
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Bg />
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
          <div
            style={{
              height: '100dvh',
              position: 'absolute',
              inset: 0,
              opacity: location === 'austin' ? 1 : 0,
              transform:
                location === 'austin' ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'opacity 300ms ease, transform 300ms ease',
              pointerEvents: location === 'austin' ? 'auto' : 'none',
            }}
          >
            <User_View user_id={1} />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: location === 'mariana' ? 1 : 0,
              transform:
                location === 'mariana' ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'opacity 300ms ease, transform 300ms ease',
              pointerEvents: location === 'mariana' ? 'auto' : 'none',
            }}
          >
            <User_View user_id={2} />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: location === 'history' ? 1 : 0,
              transform:
                location === 'history' ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'opacity 300ms ease, transform 300ms ease',
              pointerEvents: location === 'history' ? 'auto' : 'none',
            }}
          >
            <History_View />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
