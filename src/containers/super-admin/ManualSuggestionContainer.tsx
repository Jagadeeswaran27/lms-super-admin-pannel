import { useContext, useEffect, useState } from "react";
import ManualSuggestion from "../../components/all-suggestions/ManualSuggestion";
import { logout } from "../../core/services/AuthService";
import {
  addAdminSuggestion,
  addNewSubSubject,
  addSuggestionCategory,
  addSuperCategory,
  getSuggestionCategories,
  getSuggestions,
} from "../../core/services/SuggestionService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";

function ManualSuggestionContainer() {
  const [_, dispatch] = useContext(SnackBarContext);
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);

  const [suggestionCategories, setSuggestionCategories] = useState<
    SuggestionCategoriesModel[] | []
  >([]);

  async function handleGetSuggestions() {
    const suggestions = await getSuggestions();

    setSuggestions(suggestions);
  }

  useEffect(() => {
    handleGetSuggestionCategories();
    handleGetSuggestions();
  }, []);

  async function handleGetSuggestionCategories() {
    const response = await getSuggestionCategories();
    setSuggestionCategories(response);
  }
  async function handleAddNewSubSubject(
    suggestion: SuggestionModel,
    subSubject: string,
    file: File
  ): Promise<boolean> {
    const newSubSubject = await addNewSubSubject(
      suggestion.id,
      subSubject,
      file
    );
    if (newSubSubject) return true;
    return false;
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
                { name: category, isVerified: false },
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
  async function handleAddSuggestion(
    suggestionText: string,
    tag: string[],
    image: File | null
  ): Promise<boolean> {
    const response = await addAdminSuggestion(suggestionText ?? "", tag, image);
    if (response) {
      //   setSuggestions((pre) => [response, ...pre]);

      return true;
    }
    return false;
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
  async function handleLogout() {
    await logout();
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.success,
      message: "Logout successfull",
    });
  }
  return (
    <ManualSuggestion
      addNewSubSubject={handleAddNewSubSubject}
      suggestions={suggestions}
      addNewCategory={handleAddNewCategory}
      addNewSuperCategory={handleAddNewSuperCategory}
      suggestionCategories={suggestionCategories}
      logout={handleLogout}
      addSuggestion={handleAddSuggestion}
    />
  );
}

export default ManualSuggestionContainer;
