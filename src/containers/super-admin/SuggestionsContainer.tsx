import { useContext, useEffect, useState } from "react";
import SuggestionPageComponent from "../../components/suggestion/SuggestionPageComponent";
import { logout } from "../../core/services/AuthService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import {
  approveSuggestion,
  getSuggestions,
  rejectSuggestion,
} from "../../core/services/SuggestionService";

function SuggestionsContainer() {
  const [_, dispatch] = useContext(SnackBarContext);
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  async function handleApproveSuggestion(id: string) {
    const response = await approveSuggestion(id);

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
        message: "Suggestion approved successfully",
      });
    }
  }
  async function handleRejectSuggestion(id: string) {
    const response = await rejectSuggestion(id);

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
        message: "Suggestion rejected successfully",
      });
    }
  }

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

  return (
    <SuggestionPageComponent
      rejectSuggestion={handleRejectSuggestion}
      approveSuggestion={handleApproveSuggestion}
      suggestions={suggestions}
      logout={handleLogout}
    />
  );
}

export default SuggestionsContainer;
