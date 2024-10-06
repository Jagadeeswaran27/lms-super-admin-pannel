import { Check, Close } from "@mui/icons-material";
import { images } from "../../resources/images";
import { ThemeColors } from "../../resources/colors";

function SuggestionCard() {
  return (
    <section className="flex justify-between shadow-custom rounded-xl py-5 my-5 lg:px-10 max-lg:px-7 max-sm:px-2">
      <div className="flex items-center lg:gap-16 gap-5">
        <div className="w-[80px] mx-auto">
          <img src={images.backupPerson} className="w-full h-full" alt="User" />
        </div>
        <p className="text-textBrown font-medium text-sm sm:text-base lg:text-lg">
          Name:{" "}
          <span className="text-primary font-medium text-sm sm:text-base lg:text-lg">
            Jags
          </span>
        </p>
      </div>
      <div className="sm:flex-row flex-col max-sm:justify-evenly flex items-center lg:gap-16 gap-5">
        <div className="flex items-center max-sm:w-[90px] px-2 cursor-pointer rounded-full border-primary border-[0.4px]">
          <p className="text-textBrown font-medium text-xs sm:text-base lg:text-lg">
            Accept
          </p>
          <div className="w-[7px]"></div>
          <Check
            sx={{
              color: ThemeColors.primary,
            }}
          />
        </div>
        <div className="flex items-center max-sm:w-[90px] px-2 cursor-pointer rounded-full border-primary border-[0.4px]">
          <p className="text-textBrown font-medium text-xs sm:text-base lg:text-lg">
            Reject
          </p>
          <div className="w-[7px]"></div>
          <Close
            sx={{
              color: ThemeColors.brown,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default SuggestionCard;
