import { useContext, useState } from "react";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";

interface ModifiedSuggestionsProps {
  suggestion: SuggestionModel;
  isAddingLoading: boolean;
  modifySuggestion: (suggestion: SuggestionModel) => void;
}

function ModifiedSuggestions({
  modifySuggestion,
  isAddingLoading,
  suggestion,
}: ModifiedSuggestionsProps) {
  const [selectedNewTags, setSelectedNewTags] = useState<string[]>([]);
  const [_, dispatch] = useContext(SnackBarContext);

  function handleModifySuggestion() {
    if (selectedNewTags.length === 0) {
      showSnackBar({
        dispatch,
        message: "Please select a category to modify",
        color: ThemeColors.error,
      });
      return;
    }
    const updatedSuggestion = {
      ...suggestion,
      tag: [...suggestion.tag, ...selectedNewTags],
    };
    modifySuggestion(updatedSuggestion);
  }

  function handleCheckboxChange(tag: string) {
    setSelectedNewTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  }

  return (
    <div
      key={suggestion.name}
      className="flex gap-5 items-center my-5 w-[90%] mx-auto"
    >
      <p className="w-[40%] text-base text-textBrown">{suggestion.name}</p>
      <div className="flex w-[60%] justify-between items-center gap-5">
        <div className="flex gap-2 flex-wrap">
          {suggestion.tag.map((tag) => (
            <p
              className="bg-authPrimary text-xs rounded-full px-2 py-[1px] text-white"
              key={tag}
            >
              {tag}
            </p>
          ))}
          {suggestion.newTags!.map((tag) => (
            <label key={tag} className="relative flex items-center">
              <input
                type="checkbox"
                value={tag}
                checked={selectedNewTags.includes(tag)}
                onChange={() => handleCheckboxChange(tag)}
                className="appearance-none h-3 w-3 cursor-pointer rounded-full border-white border-2 absolute left-3 top-[3px] checked:bg-white"
              />
              <p className="bg-green-600 text-xs rounded-full px-2 pl-5 py-[1px] text-white ml-2">
                {tag}
              </p>
            </label>
          ))}
        </div>
        <button
          disabled={isAddingLoading}
          onClick={handleModifySuggestion}
          className="bg-primary text-sm text-white mx-[0.9px] px-2 py-1 rounded-md"
        >
          Modify
        </button>
      </div>
    </div>
  );
}

export default ModifiedSuggestions;
