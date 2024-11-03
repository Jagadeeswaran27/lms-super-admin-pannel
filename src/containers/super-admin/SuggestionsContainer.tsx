import { useContext, useEffect, useState } from "react";
import SuggestionPageComponent from "../../components/suggestion/SuggestionPageComponent";
import { logout } from "../../core/services/AuthService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import {
  addAdminSuggestion,
  addSuggestionCategory,
  addSuperCategory,
  deleteAdminSuggestion,
  getSuggestionCategories,
  getSuggestions,
  modifySuggestion,
} from "../../core/services/SuggestionService";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";

function SuggestionsContainer() {
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);
  const [suggestionCategories, setSuggestionCategories] = useState<
    SuggestionCategoriesModel[] | []
  >([]);
  const [_, dispatch] = useContext(SnackBarContext);

  useEffect(() => {
    handleGetSuggestions();
    handleGetSuggestionCategories();
  }, []);

  async function handleGetSuggestions() {
    const suggestions = await getSuggestions();

    setSuggestions(suggestions);
  }

  async function handleModifySuggestion(
    suggestion: SuggestionModel
  ): Promise<boolean> {
    const response = await modifySuggestion(suggestion);
    if (response) {
      setSuggestions((prev) => {
        const updatedSuggestions = prev.map((suggestionItem) => {
          if (suggestionItem.id === suggestion.id) {
            return suggestion;
          }
          return suggestionItem;
        });
        return updatedSuggestions;
      });
    }
    return response;
  }

  async function handleLogout() {
    await logout();
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.success,
      message: "Logout successfull",
    });
  }

  async function handleGetSuggestionCategories() {
    const response = await getSuggestionCategories();
    setSuggestionCategories(response);
  }

  async function handleAddNewCategory(
    superCategory: string,
    category: string
  ): Promise<boolean> {
    const response = await addSuggestionCategory(superCategory, category);
    setSuggestionCategories((prev) => {
      const updatedCategories = prev.map((categoryItem) => {
        if (categoryItem.superCategory.name === superCategory) {
          return {
            ...categoryItem,
            superCategory: {
              ...categoryItem.superCategory,
              secondLevelCategories: [
                ...categoryItem.superCategory.secondLevelCategories,
                category,
              ],
            },
          };
        }
        return categoryItem;
      });
      return updatedCategories;
    });
    return response;
  }
  async function handleAddNewSuperCategory(
    superCategory: string
  ): Promise<boolean> {
    const response = await addSuperCategory(superCategory);
    setSuggestionCategories((prev) => [
      ...prev,
      { superCategory: { name: superCategory, secondLevelCategories: [] } },
    ]);
    return response;
  }

  async function deleteSuggestion(id: string) {
    const response = await deleteAdminSuggestion(id);
    if (response) {
      setSuggestions((prev) => {
        const updatedSuggestions = prev.filter(
          (suggestion) => suggestion.id !== id
        );
        return updatedSuggestions;
      });
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Suggestion deleted successfully",
      });
    }
  }

  async function handleAddSuggestion(
    suggestionText: string,
    tag: string[],
    image: File | null
  ): Promise<boolean> {
    const response = await addAdminSuggestion(suggestionText ?? "", tag, image);
    if (response) {
      setSuggestions((pre) => [response, ...pre]);

      return true;
    }
    return false;
  }

  return (
    <SuggestionPageComponent
      addNewSuperCategory={handleAddNewSuperCategory}
      modifySuggestion={handleModifySuggestion}
      suggestionCategories={suggestionCategories}
      deleteSuggestion={deleteSuggestion}
      addSuggestion={handleAddSuggestion}
      suggestions={suggestions}
      logout={handleLogout}
      addNewCategory={handleAddNewCategory}
    />
  );
}

export default SuggestionsContainer;
