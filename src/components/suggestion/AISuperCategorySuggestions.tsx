import { Check, Close } from "@mui/icons-material";
import AIButton from "./AIButton";
import { ThreeDot } from "react-loading-indicators";
import { useState } from "react";
import { ThemeColors } from "../../resources/colors";
import CustomDropDown from "../common/CustomDropDown";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { SelectChangeEvent } from "@mui/material";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../core/config/firebase";
import { filterCategories } from "../../utils/helper";

interface AISuperCategorySuggestionsProps {
  closePrompt: () => void;
  suggestionCategories: SuggestionCategoriesModel[];
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
  addNewSuperCategory: (superCategory: string) => Promise<boolean>;
}

interface NewCategoriesResponse {
  suggestedCategories: string[];
}

interface NewCategoriesState {
  name: string;
  added: boolean;
}

function AISuperCategorySuggestions({
  closePrompt,
  suggestionCategories,
  addNewCategory,
  addNewSuperCategory,
}: AISuperCategorySuggestionsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedSuperCategory, setSelectedSuperCategory] =
    useState<string>("");
  const [newCategories, setNewCategories] = useState<NewCategoriesState[]>([]);
  const [isAddingLoading, setIsAddingLoading] = useState<boolean>(false);
  const [newSuperCategoriesSuggestions, setNewSuperCategoriesSuggestions] =
    useState<{ superCategory: string; added: boolean }[]>([]);

  const handleTagChange = (e: SelectChangeEvent<string>) => {
    setSelectedSuperCategory(e.target.value);
  };

  const handleAskNewCategories = async () => {
    setIsLoading(true);
    const suggestCategories = httpsCallable(functions, "suggestCategories");
    try {
      const response = await suggestCategories({
        superCategory: selectedSuperCategory,
        existingCategories: suggestionCategories
          .filter(
            (category) => category.superCategory.name === selectedSuperCategory
          )
          .map((category) =>
            category.superCategory.secondLevelCategories.map((cat) => cat)
          ),
      });
      let data = response.data as NewCategoriesResponse;
      if (data.suggestedCategories.length === 1) {
        data.suggestedCategories = data.suggestedCategories[0].split(",");
      }
      const stateData: NewCategoriesState[] = data.suggestedCategories.map(
        (category) => {
          return {
            name: category,
            added: false,
          };
        }
      );
      setNewCategories(stateData);
    } catch (error) {
      console.error("Error fetching name suggestions:", error);
    }
    setIsLoading(false);
  };

  const handleAddNewCategory = async (category: string) => {
    setIsAddingLoading(true);
    const sanitizedCategory = category.split(".")[1];
    const response = await addNewCategory(
      selectedSuperCategory,
      sanitizedCategory
    );
    if (response) {
      setNewCategories((prev) =>
        prev.map((item) =>
          item.name === category ? { ...item, added: true } : item
        )
      );
    }
    setIsAddingLoading(false);
  };
  const handleAskNewSuperCateory = async () => {
    setIsLoading(true);
    const superCategorySuggestion = httpsCallable(
      functions,
      "superCategorySuggestion"
    );
    try {
      const response = await superCategorySuggestion({
        data: suggestionCategories,
      });
      const data = response.data as {
        suggestions: { superCategory: string }[];
      };

      setNewCategories([]);
      const filteredSuggestions = filterCategories(
        suggestionCategories,
        data.suggestions
      ).map((cat) => ({ superCategory: cat.superCategory, added: false }));
      setNewSuperCategoriesSuggestions(filteredSuggestions);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleAddNewSuperCategory = async (category: string) => {
    setIsAddingLoading(true);
    const response = await addNewSuperCategory(category);
    if (response) {
      setNewSuperCategoriesSuggestions((prev) =>
        prev.map((item) =>
          item.superCategory === category ? { ...item, added: true } : item
        )
      );
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
          className="w-[60%] h-[70%] mx-auto rounded-2xl shadow-primary overflow-y-scroll bg-white "
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
            <h1 className="text-textBrown font-medium text-xl my-5">
              Select any one of the below
            </h1>
            <div className="w-[90%] mx-auto">
              <div className="text-primary text-lg  my-3">
                <span
                  onClick={
                    isLoading ? () => {} : () => setShowDropDown(!showDropDown)
                  }
                  className="cursor-pointer"
                >
                  1. Ask AI to suggest new categories for the Super Category
                </span>
                {showDropDown && (
                  <div className="flex items-center my-5 mb-7 justify-between">
                    <div className="h-[50px] w-[50%]">
                      <CustomDropDown
                        value={selectedSuperCategory}
                        onChange={handleTagChange}
                        items={suggestionCategories.map(
                          (category) => category.superCategory.name
                        )}
                      />
                    </div>
                    <button
                      onClick={handleAskNewCategories}
                      className="bg-primary text-xs xl:text-base text-white mx-[0.9px] px-3 py-1 rounded-md"
                    >
                      Get Suggestions
                    </button>
                  </div>
                )}
              </div>
              <div className="text-primary text-lg  my-3">
                <span
                  onClick={isLoading ? () => {} : handleAskNewSuperCateory}
                  className="cursor-pointer"
                >
                  2. Ask AI to suggest new Super Category
                </span>
              </div>
            </div>

            <section className="my-3 w-[90%] mx-auto text-lg ">
              {!isLoading && newSuperCategoriesSuggestions.length > 0 && (
                <div>
                  <h1 className="text-textBrown font-semibold mt-5">
                    Here are the Suggested New Categories
                  </h1>
                  {newSuperCategoriesSuggestions.map((category) => (
                    <div
                      key={category.superCategory}
                      className="flex gap-10 items-center my-5 w-[80%] mx-auto"
                    >
                      <p className="min-w-[350px] text-base max-w-[350px] text-textBrown">
                        {category.superCategory}
                      </p>

                      <button
                        disabled={isAddingLoading || category.added}
                        onClick={() =>
                          handleAddNewSuperCategory(category.superCategory)
                        }
                        className="bg-primary text-xs xl:text-base text-white mx-[0.9px] px-7 rounded-md"
                      >
                        {category.added ? <Check /> : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {!isLoading && newCategories.length > 0 && (
                <div>
                  <h1 className="text-textBrown font-semibold mt-5">
                    Here are the Suggested New Categories
                  </h1>
                  {newCategories.map((category) => (
                    <div
                      key={category.name}
                      className="flex gap-10 items-center my-5 w-[80%] mx-auto"
                    >
                      <p className="min-w-[350px] text-base max-w-[350px] text-textBrown">
                        {category.name}
                      </p>

                      <button
                        disabled={isAddingLoading || category.added}
                        onClick={() => handleAddNewCategory(category.name)}
                        className="bg-primary text-xs xl:text-base text-white mx-[0.9px] px-7 rounded-md"
                      >
                        {category.added ? <Check /> : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className=" text-center">
                  <ThreeDot
                    variant="pulsate"
                    color={ThemeColors.primary}
                    size="small"
                  />
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AISuperCategorySuggestions;
