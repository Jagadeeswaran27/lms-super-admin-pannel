import SuggestionSidebar from './SuggestionSidebar';

interface DrawerProps {
  showDrawer: boolean;
  closeDrawer: () => void;
  logout: () => void;
}

function Drawer({ closeDrawer, logout, showDrawer }: DrawerProps) {
  return (
    <div
      onClick={closeDrawer}
      className={`fixed z-20 w-full h-full bg-[rgba(255,255,255,0.7)] transform transition-transform duration-300 ease-in-out ${
        showDrawer
          ? 'opacity-100 pointer-events-auto translate-x-0'
          : 'opacity-0 pointer-events-none -translate-x-[50px]'
      }`}
    >
      <div
        className={`sm:w-[30%] lg:w-[23%] w-[70%]`}
        onClick={(e) => e.stopPropagation()}
      >
        <SuggestionSidebar closeDrawer={closeDrawer} logout={logout} />
      </div>
    </div>
  );
}

export default Drawer;
