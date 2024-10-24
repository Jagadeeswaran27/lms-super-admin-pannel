import { useContext, useEffect, useState } from "react";
import AllSuggestionsComponent from "../../components/all-suggestions/AllSuggestionsComponent";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { SnackBarContext } from "../../store/SnackBarContext";
import {
  deleteAdminSuggestion,
  getSuggestions,
} from "../../core/services/SuggestionService";
import { logout } from "../../core/services/AuthService";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";

function AllSuggestionContainer() {
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);
  const [_, dispatch] = useContext(SnackBarContext);

  useEffect(() => {
    handleGetSuggestions();
  }, []);
  async function handleGetSuggestions() {
    const suggestions = await getSuggestions();
    setSuggestions(suggestions);
  }
  async function handleLogout() {
    await logout();
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.success,
      message: "Logout successfull",
    });
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
  return (
    <AllSuggestionsComponent
      deleteSuggestion={deleteSuggestion}
      logout={handleLogout}
      suggestions={suggestions}
    />
  );
}

export default AllSuggestionContainer;
