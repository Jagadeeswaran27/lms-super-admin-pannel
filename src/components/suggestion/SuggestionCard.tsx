import { Delete } from "@mui/icons-material";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { ThemeColors } from "../../resources/colors";

interface SuggestionCardProps {
  suggestion: SuggestionModel;
  index: number;
  deleteSuggestion: (id: string) => void;
}

function SuggestionCard({
  suggestion,
  index,
  deleteSuggestion,
}: SuggestionCardProps) {
  return (
    <section
      className={` ${
        index % 2 == 0 ? "bg-white" : "bg-cardColor"
      }  lg:mx-7 md:mx-5 mx-2 rounded-md flex relative gap-2 shadow-custom px-2 h-[45px] my-4 lg:pl-5 max-lg:px-7 max-sm:px-2`}
    >
      <div className="flex flex-col justify-start">
        <p className="text-sm pt-1">{suggestion.name}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Delete
          onClick={() => deleteSuggestion(suggestion.id)}
          className="cursor-pointer"
          sx={{
            color: ThemeColors.brown,
          }}
        />
      </div>
      <p className="absolute bg-authPrimary text-[10px] rounded-r-full px-1 py-[1px] text-white left-0 bottom-1">
        {suggestion.tag}
      </p>
    </section>
  );
}

export default SuggestionCard;
