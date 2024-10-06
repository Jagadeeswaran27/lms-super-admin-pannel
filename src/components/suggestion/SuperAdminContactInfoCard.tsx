import { Mail, Phone } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";

interface SuperAdminContactInfoCardProps {}

function SuperAdminContactInfoCard({}: SuperAdminContactInfoCardProps) {
  const { authUser } = useContext(AuthContext);
  return (
    <div className="bg-cardColor flex flex-col p-3 justify-evenly h-[150px] shadow-custom rounded-xl">
      <h1 className="text-textBrown font-semibold text-xl ">Contact Info :</h1>
      <div className="flex items-center gap-2">
        <Phone sx={{ color: ThemeColors.authPrimary }} />
        <p className="text-textBrown font-normal text-sm">{authUser?.phone}</p>
      </div>
      <div className="flex items-center gap-2">
        <Mail sx={{ color: ThemeColors.authPrimary }} />
        <p className="text-textBrown font-normal text-sm break-all">
          {authUser?.email}
        </p>
      </div>
    </div>
  );
}

export default SuperAdminContactInfoCard;
