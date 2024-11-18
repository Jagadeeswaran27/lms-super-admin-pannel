import { Close } from "@mui/icons-material";
import AIButton from "./AIButton";
import { useContext, useEffect, useState } from "react";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";
import { SnackBarContext } from "../../store/SnackBarContext";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";

interface NewCategoriesPopUpProps {
  closePrompt: () => void;
  newCategories: string[];
  existingCategories: string[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
  suggestion: SuggestionModel;
}

function NewCategoriesPopUp({
  closePrompt,
  newCategories,
  existingCategories,
  suggestion,
  modifySuggestion,
}: NewCategoriesPopUpProps) {
  const [isAddingLoading, setIsAddingLoading] = useState<boolean>(false);
  const [filteredNewCategories, setFilteredNewCategories] = useState<string[]>(
    []
  );
  const [_, dispatch] = useContext(SnackBarContext);

  useEffect(() => {
    const filteredNewCategories: string[] = [];
    newCategories.map((cat) => {
      if (existingCategories.map((cat) => cat.trim()).includes(cat)) {
        filteredNewCategories.push(cat);
      }
    });
    setFilteredNewCategories(filteredNewCategories);
  }, []);

  const handleModifySuggestion = async (category: string) => {
    setIsAddingLoading(true);
    const sugg: SuggestionModel = {
      ...suggestion,
      tag: [...suggestion.tag, category],
    };
    const response = await modifySuggestion(sugg);
    if (response) {
      setFilteredNewCategories((pre) => pre.filter((cat) => cat !== category));
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Added Successfully",
      });
    }
    setIsAddingLoading(false);
  };
  return (
    <div
      onClick={closePrompt}
      className="fixed  z-10 w-screen fade-in h-screen top-0 left-0 bg-[rgba(255,255,255,0.7)] flex justify-center items-center"
    >
      <div className="flex w-full h-full justify-center items-center">
        <section
          className="w-[60%] h-[50%] mx-auto rounded-2xl shadow-primary overflow-y-scroll bg-white "
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "fadeInUp 0.3s ease-in",
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
          }}
        >
          <div className="flex justify-between items-center shadow-custom py-3 px-5">
            <div className="w-[220px]">
              <AIButton isLoading={false} text="AI" />
            </div>
            <Close
              fontSize="large"
              className="cursor-pointer"
              onClick={closePrompt}
            />
          </div>
          <div className="p-3">
            <div className="w-[80%] mx-auto mt-10">
              {filteredNewCategories.length > 0 ? (
                filteredNewCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between my-5 w-[80%] mx-auto"
                  >
                    <p className="text-lg min-w-[250px] max-w-[250px] font-semibold text-textBrown">
                      {cat}
                    </p>

                    <button
                      disabled={isAddingLoading}
                      onClick={() => handleModifySuggestion(cat)}
                      className="bg-primary text-lg xl:text-base text-white mx-[0.9px] px-7 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-lg font-semibold  text-textBrown">
                  No New Categories Found
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NewCategoriesPopUp;
