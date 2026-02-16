import { Activity, useState } from 'react';
import './index.css';
import { Nav } from './ui/nav';
import { User_View } from './ui/user_view';
import { History_View } from './ui/history_view';

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
    <div className='max-w-7xl mx-auto p-0 text-center relative z-10'>
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
  );
}

export default App;
