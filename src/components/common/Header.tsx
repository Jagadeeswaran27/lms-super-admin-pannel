import { Logout, Menu } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../utils/Routes";

interface HeaderProps {
  logout: () => void;
  openDrawer: () => void;
}

function Header({ logout, openDrawer }: HeaderProps) {
  const location = useLocation();
  const isManual = location.pathname === routes.suggestionManual;
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
        Subjects
      </h1>
      <div className="flex-1 sm:hidden"></div>
      <div className="text-center max-sm:hidden flex-1 flex gap-4 justify-end">
        <p className="mt-3">
          <Link
            to={isManual ? routes.suggestions : routes.suggestionManual}
            className="text-white bg-primary  px-2 py-1 font-semibold rounded-lg text-lg block w-full text-center"
          >
            {isManual ? "Home" : "Custom"}
          </Link>
        </p>
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
