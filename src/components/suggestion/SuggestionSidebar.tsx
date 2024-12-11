import { Close, Logout } from "@mui/icons-material";
import CustomIconButton from "../common/CustomIconButton";
import SuperAdminContactInfoCard from "./SuperAdminContactInfoCard";
import SuperAdminDetailCard from "./SuperAdminDetailCard";
import { ThemeColors } from "../../resources/colors";
import NavigationCard from "./NavigationCard";

interface SuggestionSidebarProps {
  logout: () => void;
  closeDrawer: () => void;
}

function SuggestionSidebar({ logout, closeDrawer }: SuggestionSidebarProps) {
  return (
    <div className="w-full py-3 sm:py-5 h-[100vh]  bg-displayGradient">
      <div className="text-right pr-5 ">
        <div className="inline-block cursor-pointer" onClick={closeDrawer}>
          <Close
            sx={{
              color: ThemeColors.brown,
            }}
          />
        </div>
      </div>
      <div className=" sm:w-[83%] w-[87%] h-full flex flex-col justify-between mx-auto sm:py-6 max-sm:pt-3 max-sm:pb-10">
        <section>
          <NavigationCard />
          <SuperAdminDetailCard />
          <div className="h-6"></div>
          <SuperAdminContactInfoCard />
        </section>
        <CustomIconButton
          onClick={logout}
          text="Logout"
          icon={<Logout sx={{ color: "white" }} />}
        />
      </div>
    </div>
  );
}

export default SuggestionSidebar;
