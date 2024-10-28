import { Check, Close } from "@mui/icons-material";
import AIButton from "./AIButton";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../core/config/firebase";
import { useContext, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { ThemeColors } from "../../resources/colors";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { filterSuggestion } from "../../utils/helper";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";

interface AISuggestionsProps {
  closePrompt: () => void;
  addNewPromptItem: (name: string) => void;
  addNewCategory: (category: string) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
  suggestions: SuggestionModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
}

interface NewCategoriesResponse {
  suggestedCategories: string[];
}

interface NewSuggestionState {
  name: string;
  categories: string[];
}

interface NewCategoriesState {
  name: string;
  added: boolean;
}

function AISuggestions({
  closePrompt,
  addNewCategory,
  suggestions,
  suggestionCategories,
  modifySuggestion,
  addSuggestion,
}: AISuggestionsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingLoading, setIsAddingLoading] = useState<boolean>(false);
  const [newCategories, setNewCategories] = useState<NewCategoriesState[]>([]);
  const [modifiedSuggestions, setModifiedSuggestions] = useState<
    SuggestionModel[]
  >([]);
  const [nameSuggestions, setNameSuggestions] = useState<NewSuggestionState[]>(
    []
  );
  const [_, dispatch] = useContext(SnackBarContext);
  const [currentlyAdding, setCurrentlyAdding] = useState<string | null>(null);

  const handleModifySuggestion = async (suggestion: SuggestionModel) => {
    setIsAddingLoading(true);
    const response = await modifySuggestion(suggestion);
    if (response) {
      setModifiedSuggestions((prev) =>
        prev.filter((item) => item.id !== suggestion.id)
      );
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Modified Successfully",
      });
    }
    setIsAddingLoading(false);
  };

  const handleNameSuggestion = async () => {
    setIsLoading(true);
    const nameSuggestion = httpsCallable(functions, "nameSuggestion");
    try {
      const response = await nameSuggestion({
        existingCategories: suggestionCategories.map(
          (category) => category.name
        ),
        courseNames: suggestions.map((suggestion) => suggestion.name),
      });
      const data = response.data as { newSuggestions: NewSuggestionState[] };
      setNameSuggestions(data.newSuggestions);
      setNewCategories([]);
      setModifiedSuggestions([]);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const handleAskNewCategories = async () => {
    setIsLoading(true);
    const suggestCategories = httpsCallable(functions, "suggestCategories");
    try {
      const response = await suggestCategories({
        existingCategories: suggestionCategories,
      });
      const data = response.data as NewCategoriesResponse;
      const stateData: NewCategoriesState[] = data.suggestedCategories.map(
        (category) => {
          return {
            name: category,
            added: false,
          };
        }
      );
      setModifiedSuggestions([]);
      setNameSuggestions([]);
      setNewCategories(stateData);
    } catch (error) {
      console.error("Error fetching name suggestions:", error);
    }
    setIsLoading(false);
  };

  const handleGetModifiedSuggestion = async () => {
    setIsLoading(true);
    const modifyTags = httpsCallable(functions, "modifyTags");
    try {
      const response = await modifyTags({
        suggestions: suggestions,
        referenceTags: suggestionCategories.map((category) => category.name),
      });
      const data = response.data as {
        modifiedSuggestions: { name: string; tag: string[] }[];
      };
      const sortedSuggestions = suggestions.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setNameSuggestions([]);
      setNewCategories([]);
      setModifiedSuggestions(
        filterSuggestion(sortedSuggestions, data.modifiedSuggestions)
      );
    } catch (error) {
      console.error("Error fetching name suggestions:", error);
    }
    setIsLoading(false);
  };

  const handleDownloadSelectedImage = async (
    name: string,
    url: string
  ): Promise<File | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const fileName = `${name}.jpg`;
      const fileData = new File([blob], fileName, { type: blob.type });
      return fileData;
    } catch (e) {
      console.error("Error downloading image:", e);
      return null;
    }
  };

  const handleGetImageSuggestion = async (
    value: string
  ): Promise<File | null> => {
    const generateImages = httpsCallable(functions, "generateImages");
    try {
      const response = await generateImages({
        // prompt: `Design an engaging and visually appealing online course thumbnail. The image should feature abstract and minimalist symbols representing education, learning, and growth. Include elements like stylized books, lightbulbs, graduation caps, gears, or trees of knowledge, arranged into a cohesive, modern design. Use smooth gradients or contrasting color palettes to create a vibrant and welcoming tone. The overall style should communicate progress and intellectual development.Do not embed any text or course title in the image itself. Instead, place the word ${value} as separate text positioned directly below the image, ensuring clear separation between the graphic and the text content. The image should remain clean and focused on visuals without any embedded typography.`,
        prompt: `Help me to create an high quality image for an online course thumbnail.The image should feature abstract symbols or simplified icons representing education, learning, and growth, such as stylized books, lightbulbs, graduation caps, or gears I want you create course thumbnail for subject:${value}, Do not include subject name  in the image.`,
      });
      const data = response.data as {
        prompt: string;
        image: string;
        summary: string;
      };
      // console.log(`data:image/png;base64,${data.image}`);
      const downloadResponse = await handleDownloadSelectedImage(
        value,
        `data:image/png;base64,${data.image}`
      );
      return downloadResponse;
    } catch (error) {
      console.error("Error fetching name suggestions:", error);
      return null;
    }
  };

  const handleAddNewCategory = async (category: string) => {
    setIsAddingLoading(true);
    const sanitizedCategory = category.split(" ")[1];
    const response = await addNewCategory(sanitizedCategory);
    if (response) {
      setNewCategories((prev) =>
        prev.map((item) =>
          item.name === category ? { ...item, added: true } : item
        )
      );
    }
    setIsAddingLoading(false);
  };

  const handleAddNewSuggestions = async (suggestion: string, tag: string[]) => {
    setCurrentlyAdding(suggestion);
    const file = await handleGetImageSuggestion(suggestion);
    if (file) {
      const response = await addSuggestion(suggestion, tag, file);
      if (response) {
        showSnackBar({
          dispatch: dispatch,
          color: ThemeColors.success,
          message: "Suggestion added successfully",
        });
        setNameSuggestions((prev) =>
          prev.filter((item) => item.name !== suggestion)
        );
      }
    }
    setCurrentlyAdding(null);
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
              <p className="text-primary text-lg  my-3">
                <span
                  onClick={isLoading ? () => {} : handleAskNewCategories}
                  className="cursor-pointer"
                >
                  1. Ask AI to suggest New Categories
                </span>
              </p>
              <p className="text-primary text-lg  my-3">
                <span
                  onClick={isLoading ? () => {} : handleGetModifiedSuggestion}
                  className="cursor-pointer"
                >
                  2. Ask AI to suggest new or modify categories for the existing
                  subjects
                </span>
              </p>
              <p className="text-primary text-lg my-3">
                <span
                  onClick={isLoading ? () => {} : handleNameSuggestion}
                  className="cursor-pointer"
                >
                  3. Ask AI to suggest new subjects for existing categories
                </span>
              </p>
            </div>

            <section className="my-3 w-[90%] mx-auto text-lg ">
              {isLoading && (
                <div className=" text-center">
                  <ThreeDot
                    variant="pulsate"
                    color={ThemeColors.primary}
                    size="small"
                  />
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
              {!isLoading && modifiedSuggestions.length > 0 && (
                <div>
                  <h1 className="text-textBrown font-semibold mt-5">
                    Here are the Modifications!
                  </h1>
                  {modifiedSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.name}
                      className="flex gap-5 items-center my-5 w-[90%] mx-auto"
                    >
                      <p className="w-[40%] text-base text-textBrown">
                        {suggestion.name}
                      </p>
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
                        </div>
                        <button
                          disabled={isAddingLoading}
                          onClick={() => handleModifySuggestion(suggestion)}
                          className="bg-primary text-sm text-white mx-[0.9px] px-2 py-1 rounded-md"
                        >
                          Modify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!isLoading && nameSuggestions.length > 0 && (
                <div>
                  <h1 className="text-textBrown font-semibold mt-5">
                    Here are the New Suggestions!
                  </h1>
                  {nameSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.name}
                      className="flex gap-5 items-center my-5 w-[90%] mx-auto"
                    >
                      <p className="w-[40%] text-base text-textBrown">
                        {suggestion.name}
                      </p>
                      <div className="flex w-[60%] justify-between items-center gap-5">
                        <div className="flex gap-2 flex-wrap">
                          {suggestion.categories.map((cat) => (
                            <p
                              className="bg-authPrimary text-xs rounded-full px-2 py-[1px] text-white"
                              key={cat}
                            >
                              {cat}
                            </p>
                          ))}
                        </div>
                        <button
                          disabled={currentlyAdding !== null}
                          onClick={() =>
                            handleAddNewSuggestions(
                              suggestion.name,
                              suggestion.categories
                            )
                          }
                          className="bg-primary text-sm text-white mx-[0.9px] px-2 py-1 rounded-md"
                        >
                          {currentlyAdding === suggestion.name
                            ? "Adding..."
                            : "Add"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
export default AISuggestions;
