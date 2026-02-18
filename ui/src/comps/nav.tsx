export const Nav = ({ current_location, set_location }: Nav_Props) => {
  const buttonStyle = (isActive: boolean) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    backgroundColor: isActive ? '#ffffff30' : 'transparent',
    color: 'inherit',
    border: 'none',
    borderRadius: '0.75rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  return (
    <div className='bot-nav-cont'>
      <button
        style={buttonStyle(current_location === 'austin')}
        onClick={() => set_location('austin')}
      >
        A
      </button>
      <button
        style={buttonStyle(current_location === 'mariana')}
        onClick={() => set_location('mariana')}
      >
        M
      </button>
      <button
        style={buttonStyle(current_location === 'history')}
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
