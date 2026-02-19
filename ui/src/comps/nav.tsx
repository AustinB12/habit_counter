export const Nav = ({ current_location, set_location }: Nav_Props) => {
  return (
    <div className='bot-nav-cont'>
      <button
        className={current_location === 'austin' ? 'active' : ''}
        onClick={() => set_location('austin')}
      >
        A
      </button>
      <button
        className={current_location === 'mariana' ? 'active' : ''}
        onClick={() => set_location('mariana')}
      >
        M
      </button>
      <button
        className={current_location === 'history' ? 'active' : ''}
        onClick={() => set_location('history')}
      >
        H
      </button>
    </div>
  );
};

interface Nav_Props {
  current_location: 'austin' | 'mariana' | 'history';
  set_location: (loc: 'austin' | 'mariana' | 'history') => void;
}
