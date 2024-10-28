import { useContext, useEffect, useState } from "react";
import ManualSuggestion from "../../components/all-suggestions/ManualSuggestion";
import { logout } from "../../core/services/AuthService";
import {
  addAdminSuggestion,
  getSuggestionCategories,
} from "../../core/services/SuggestionService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";

function ManualSuggestionContainer() {
  const [_, dispatch] = useContext(SnackBarContext);
  const [suggestionCategories, setSuggestionCategories] = useState<
    SuggestionCategoriesModel[] | []
  >([]);

  useEffect(() => {
    handleGetSuggestionCategories();
  }, []);

  async function handleGetSuggestionCategories() {
    const response = await getSuggestionCategories();
    setSuggestionCategories(response);
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
      suggestionCategories={suggestionCategories}
      logout={handleLogout}
      addSuggestion={handleAddSuggestion}
    />
  );
}

export default ManualSuggestionContainer;
