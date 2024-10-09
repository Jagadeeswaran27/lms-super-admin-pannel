import { Check, Close } from "@mui/icons-material";
import { images } from "../../resources/images";
import { ThemeColors } from "../../resources/colors";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";

interface SuggestionCardProps {
  suggestion: SuggestionModel;
  index: number;
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
}

function SuggestionCard({
  suggestion,
  index,
  approveSuggestion,
  rejectSuggestion,
}: SuggestionCardProps) {
  function handleApproveSuggestion() {
    approveSuggestion(suggestion.id);
  }
  function handleRejectSuggestion() {
    rejectSuggestion(suggestion.id);
  }
  return (
    <section
      className={`flex justify-between shadow-custom ${
        index % 2 == 0 ? "bg-white" : "bg-cardColor"
      } h-[120px] mx-2 rounded-xl py-5 my-5 lg:px-10 max-lg:px-7 max-sm:px-2`}
    >
      <div className="flex items-center lg:gap-12 gap-5">
        <div className="w-[80px] h-[80px] mx-auto">
          <img
            src={
              suggestion.image.length > 0
                ? suggestion.image
                : images.backupPerson
            }
            className="w-full object-cover rounded-full  h-full"
            alt="User"
          />
        </div>
        <p className="text-textBrown font-medium text-sm sm:text-base lg:text-lg">
          Name :{" "}
          <span className="text-primary font-medium text-sm sm:text-base lg:text-lg">
            {suggestion.name}
          </span>
        </p>
      </div>
      <div className="md:flex-row flex-col max-sm:justify-evenly flex items-center lg:gap-12 gap-5">
        <div
          onClick={handleApproveSuggestion}
          className="flex items-center max-sm:w-[90px] px-2 cursor-pointer rounded-full border-primary border-[0.4px]"
        >
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
        <div
          onClick={handleRejectSuggestion}
          className="flex items-center max-sm:w-[90px] px-2 cursor-pointer rounded-full border-primary border-[0.4px]"
        >
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
