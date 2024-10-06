import { useContext } from "react";
import SuggestionPageComponent from "../../components/suggestion/SuggestionPageComponent";
import { logout } from "../../core/services/AuthService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";

function SuggestionsContainer() {
  const [_, dispatch] = useContext(SnackBarContext);
  async function handleLogout() {
    await logout();
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.success,
      message: "Logout successfull",
    });
  }
  return <SuggestionPageComponent logout={handleLogout} />;
}

export default SuggestionsContainer;
