import Header from "../common/Header";
import { useContext, useRef, useState } from "react";
import SuggestionSidebar from "./SuggestionSidebar";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import SuggestionLargeList from "../common/LazyLoadingList";
import InputField from "../common/InputField";
import AuthButton from "../common/AuthButton";
import { addAdminSuggestion } from "../../core/services/SuggestionService";
import UploadField from "../common/UploadField";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";
import { SnackBarContext } from "../../store/SnackBarContext";

interface SuggestionPageComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
}

function SuggestionPageComponent({
  logout,
  suggestions,
  approveSuggestion,
  rejectSuggestion,
}: SuggestionPageComponentProps) {
  const [_, dispatch] = useContext(SnackBarContext);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const suggestionRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);

  function openDrawer() {
    setShowDrawer(true);
  }

  function closeDrawer() {
    setShowDrawer(false);
  }

  async function addSuggestion() {
    setIsLoading(true);
    const suggestionText = suggestionRef.current?.value.toUpperCase();
    const response = await addAdminSuggestion(suggestionText ?? "", image);
    if (response) {
      suggestionRef.current!.value = "";
      setImage(null);
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Suggestion added successfully",
      });
    } else {
      suggestionRef.current!.value = "";
      setImage(null);
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Failed to add suggestion",
      });
    }
    setIsLoading(false);
  }

  function handleImageChange(file: File | null) {
    setImage(file);
  }

  return (
    <div className="flex flex-col h-screen">
      <div
        onClick={closeDrawer}
        className={`sm:hidden fixed z-20 w-full h-full bg-[rgba(255,255,255,0.7)] transform transition-transform duration-300 ease-in-out ${
          showDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-[80%]" onClick={(e) => e.stopPropagation()}>
          <SuggestionSidebar closeDrawer={closeDrawer} logout={logout} />
        </div>
      </div>
      <Header openDrawer={openDrawer} logout={logout} />
      <section className="flex flex-1 overflow-hidden">
        <div className="max-sm:hidden h-full">
          <SuggestionSidebar closeDrawer={closeDrawer} logout={logout} />
        </div>
        <div className="flex-1 flex justify-center overflow-y-auto">
          <div className="w-[90%] ">
            <div className="flex-1 flex justify-between items-center pt-10">
              <InputField
                placeholder="Enter suggestions"
                type="text"
                name="text"
                inputRef={suggestionRef}
              />
              <div className="w-[5%]"></div>
              <UploadField
                placeholder="Choose image"
                name="image"
                value={image ? image.name : ""}
                onChange={handleImageChange}
              />
              <div className="w-[5%]"></div>
              <div className="w-[40%]">
                <AuthButton
                  text="Add Suggestion"
                  isLoading={isLoading}
                  onClick={addSuggestion}
                />
              </div>
            </div>
            {suggestions.length > 0 ? (
              <div className="h-full">
                <SuggestionLargeList
                  approveSuggestion={approveSuggestion}
                  rejectSuggestion={rejectSuggestion}
                  items={suggestions}
                />
              </div>
            ) : (
              <p className="flex flex-1 text-brown font-semibold md:text-xl text-base h-full items-center justify-center">
                No Suggestions Found
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SuggestionPageComponent;
