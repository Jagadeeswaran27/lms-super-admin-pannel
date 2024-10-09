import { useContext } from "react";
import { images } from "../../resources/images";
import { AuthContext } from "../../store/AuthContext";
interface SuperAdminDetailCardProps {}

function SuperAdminDetailCard({}: SuperAdminDetailCardProps) {
  const { authUser } = useContext(AuthContext);
  return (
    <div className="bg-cardColor flex flex-col p-3 justify-evenly h-[250px] shadow-custom  rounded-xl">
      <h1 className="text-textBrown font-semibold text-xl ">Super Admin :</h1>
      <div className="w-[40%] mx-auto">
        <img src={images.backupPerson} className="w-full h-full" />
      </div>
      <p className="border-textBrown text-authPrimary font-medium text-xl text-center py-2 border-[0.1px] rounded-full">
        {authUser?.userName}
      </p>
    </div>
  );
}

export default SuperAdminDetailCard;
