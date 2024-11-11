import { CircularProgress } from "@mui/material";
import { icons } from "../../resources/icons";

interface AIButtonProps {
  text: string;
  onClick?: () => void;
  isLoading: boolean;
  showButton?: boolean;
}
function AIButton({ isLoading, text, onClick }: AIButtonProps) {
  return (
    <button
      className="w-full relative flex cursor-pointer items-center justify-center my-2 py-2 rounded-[37.4px] sm:text-lg text-sm text-white font-semibold bg-authGradient"
      type="button"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <CircularProgress size={28} color="inherit" />
        </div>
      ) : (
        <p className=" text-sm">
          {text} <span className="text-[10px] font-thin">(Sugg)</span>
        </p>
      )}
      <div className="flex-1 absolute  -right-[7px] -bottom-[4px] w-[70px] h-[70px] ">
        <img src={icons.bot} className="w-full h-full" />
      </div>
    </button>
  );
}

export default AIButton;
