import { useContext, useEffect, useState } from "react";
import SuggestionPageComponent from "../../components/suggestion/SuggestionPageComponent";
import { logout } from "../../core/services/AuthService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import {
  addAdminSuggestion,
  // approveSuggestion,
  deleteAdminSuggestion,
  getSuggestions,
  // rejectSuggestion,
} from "../../core/services/SuggestionService";

function SuggestionsContainer() {
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);
  const [_, dispatch] = useContext(SnackBarContext);

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  // async function handleApproveSuggestion(id: string) {
  //   const response = await approveSuggestion(id);

  //   if (response) {
  //     setSuggestions((prev) => {
  //       const updatedSuggestions = prev.filter(
  //         (suggestion) => suggestion.id !== id
  //       );
  //       return updatedSuggestions;
  //     });
  //     showSnackBar({
  //       dispatch: dispatch,
  //       color: ThemeColors.success,
  //       message: "Suggestion approved successfully",
  //     });
  //   }
  // }
  // async function handleRejectSuggestion(id: string) {
  //   const response = await rejectSuggestion(id);

  //   if (response) {
  //     setSuggestions((prev) => {
  //       const updatedSuggestions = prev.filter(
  //         (suggestion) => suggestion.id !== id
  //       );
  //       return updatedSuggestions;
  //     });
  //     showSnackBar({
  //       dispatch: dispatch,
  //       color: ThemeColors.success,
  //       message: "Suggestion rejected successfully",
  //     });
  //   }
  // }

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

  async function addSuggestion(
    suggestionText: string,
    tag: string,
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
      deleteSuggestion={deleteSuggestion}
      addSuggestion={addSuggestion}
      suggestions={suggestions}
      logout={handleLogout}
    />
  );
}

export default SuggestionsContainer;
