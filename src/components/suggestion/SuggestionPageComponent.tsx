import Header from "../common/Header";
import { useState } from "react";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import Drawer from "./Drawer";
import AddedSuggestions from "./AddedSuggestions";
import NewSuggestions from "./NewSuggestions";
// import InputField from "../common/InputField";
// import AuthButton from "../common/AuthButton";
// import { addAdminSuggestion } from "../../core/services/SuggestionService";
// import UploadField from "../common/UploadField";
// import { showSnackBar } from "../../utils/Snackbar";
// import { ThemeColors } from "../../resources/colors";
// import { SnackBarContext } from "../../store/SnackBarContext";

interface SuggestionPageComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  addSuggestion: (
    suggestion: string,
    tag: string,
    image: File | null
  ) => Promise<boolean>;
  deleteSuggestion: (id: string) => void;
}

function SuggestionPageComponent({
  logout,
  suggestions,
  addSuggestion,
  deleteSuggestion,
}: SuggestionPageComponentProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  function openDrawer() {
    setShowDrawer(true);
  }

  function closeDrawer() {
    setShowDrawer(false);
  }

  return (
    <div>
      <Drawer
        closeDrawer={closeDrawer}
        logout={logout}
        showDrawer={showDrawer}
      />

      <Header openDrawer={openDrawer} logout={logout} />

      <section>
        <div className=" mx-auto">
          {suggestions.length > 0 ? (
            <AddedSuggestions
              deleteSuggestion={deleteSuggestion}
              suggestions={suggestions}
            />
          ) : (
            <p className="flex flex-1 text-brown font-semibold md:text-xl text-base h-full items-center justify-center">
              No Suggestions Found
            </p>
          )}
        </div>

        <NewSuggestions addSuggestion={addSuggestion} />
      </section>
    </div>
  );
}

export default SuggestionPageComponent;
