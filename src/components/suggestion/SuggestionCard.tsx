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
    <div
      className={` ${
        index % 2 == 0 ? "bg-white" : "bg-cardColor"
      }   rounded-md w-[80%] mx-auto my-3 flex relative gap-2 items-center shadow-custom px-2 py-5 lg:pl-5 max-lg:px-7 max-sm:px-2`}
    >
      <div className="flex gap-3 max-w-[40%] min-w-[40%] items-center">
        <div className="w-[30px] h-[30px] rounded-full">
          <img className="w-full h-full rounded-full" src={suggestion.image} />
        </div>
        <p className="text-lg pt-1">{suggestion.name}</p>
      </div>
      <div className="flex justify-between w-[60%] items-start gap-5">
        <ul className="flex items-start flex-wrap gap-3">
          {suggestion.tag.map((cat, _) => (
            <li
              key={_}
              className=" bg-authPrimary text-sm rounded-full px-2 py-[1px] text-white left-0 bottom-1"
            >
              {cat}
            </li>
          ))}
        </ul>
        <Delete
          onClick={() => deleteSuggestion(suggestion.id)}
          className="cursor-pointer"
          sx={{
            color: ThemeColors.brown,
          }}
        />
      </div>
    </div>
  );
}

export default SuggestionCard;
