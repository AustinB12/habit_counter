import '../index.css';

export const Nav = ({ current_location, set_location }: Nav_Props) => {
  return (
    <div className='bot-nav-cont'>
      <button
        style={{
          fontWeight: current_location === 'austin' ? 'bold' : 'normal',
        }}
        onClick={() => set_location('austin')}
      >
        A
      </button>
      <button
        style={{
          fontWeight: current_location === 'mariana' ? 'bold' : 'normal',
        }}
        onClick={() => set_location('mariana')}
      >
        M
      </button>
      <button
        style={{
          fontWeight: current_location === 'history' ? 'bold' : 'normal',
        }}
        onClick={() => set_location('history')}
      >
        X
      </button>
    </div>
  );
};

interface Nav_Props {
  current_location: 'austin' | 'mariana' | 'history';
  set_location: (loc: 'austin' | 'mariana' | 'history') => void;
}
