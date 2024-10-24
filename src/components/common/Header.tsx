import { Logout, Menu } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";

interface HeaderProps {
  logout: () => void;
  openDrawer: () => void;
}

function Header({ logout, openDrawer }: HeaderProps) {
  return (
    <header className="border-b-[0.2px] lg:px-10 md:px-5 px-3 sticky top-0 left-0 z-10 shadow-custom bg-white  h-[90px] flex items-center ">
      <div className="flex-1">
        <div className="inline-block cursor-pointer" onClick={openDrawer}>
          <Menu
            sx={{
              color: ThemeColors.authPrimary,
              fontSize: "2rem",
            }}
          />
        </div>
      </div>
      <h1 className="text-authPrimary sm:text-[2.2rem] text-lg font-semibold text-center flex-1">
        Suggestion
      </h1>
      <div className="flex-1 sm:hidden"></div>
      <div className="text-center max-sm:hidden flex-1 flex justify-end">
        <div onClick={logout} className="cursor-pointer">
          <Logout
            sx={{
              color: ThemeColors.authPrimary,
            }}
          />
          <p className="text-textBrown font-semibold">Logout</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
