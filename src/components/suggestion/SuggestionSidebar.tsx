import { Close, Logout } from "@mui/icons-material";
import CustomIconButton from "../common/CustomIconButton";
import SuperAdminContactInfoCard from "./SuperAdminContactInfoCard";
import SuperAdminDetailCard from "./SuperAdminDetailCard";
import { ThemeColors } from "../../resources/colors";

interface SuggestionSidebarProps {
  logout: () => void;
  closeDrawer: () => void;
}

function SuggestionSidebar({ logout, closeDrawer }: SuggestionSidebarProps) {
  return (
    <div className="lg:w-[350px] md:w-[300px] sm:h-full h-[100vh]  bg-displayGradient">
      <div className="sm:hidden text-right px-3 pt-3">
        <div className="inline-block" onClick={closeDrawer}>
          <Close
            sx={{
              color: ThemeColors.brown,
            }}
          />
        </div>
      </div>
      <div className=" w-[83%] h-full flex flex-col justify-between mx-auto sm:py-6 max-sm:pt-3 max-sm:pb-14">
        <section>
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
