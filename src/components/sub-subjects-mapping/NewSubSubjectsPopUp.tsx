import { Close } from "@mui/icons-material";
import { useContext, useState } from "react";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";
import { SnackBarContext } from "../../store/SnackBarContext";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import AIButton from "../suggestion/AIButton";

interface NewSubSubjectsPopUpProps {
  closePrompt: () => void;
  newSubSubjects: string[];
  existingSubSubjects: string[];
  suggestion: SuggestionModel;
  addNewSubSubject: (
    suggestion: SuggestionModel,
    subSubject: string
  ) => Promise<boolean>;
}

function NewSubSubjectsPopUp({
  closePrompt,
  newSubSubjects,
  suggestion,
  addNewSubSubject,
}: NewSubSubjectsPopUpProps) {
  const [isAddingLoading, setIsAddingLoading] = useState<boolean>(false);
  const [_, dispatch] = useContext(SnackBarContext);
  const [subSubjects, setSubSubjects] = useState<string[]>(newSubSubjects);
  const [currentlyAdding, setIsCurrentlyAdding] = useState<string>("");

  const handleModifySuggestion = async (subSubject: string) => {
    const trimmedSubSubject = subSubject.split(".")[1].trim();
    setIsAddingLoading(true);
    setIsCurrentlyAdding(subSubject);
    const response = await addNewSubSubject(suggestion, trimmedSubSubject);
    if (response) {
      setSubSubjects((prev) => prev.filter((sub) => sub !== subSubject));
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Added Successfully",
      });
    }
    setIsAddingLoading(false);
  };
  return (
    <div
      onClick={closePrompt}
      className="fixed  z-10 w-screen fade-in h-screen top-0 left-0 bg-[rgba(255,255,255,0.7)] flex justify-center items-center"
    >
      <div className="flex w-full h-full justify-center items-center">
        <section
          className="w-[60%] h-[50%] mx-auto rounded-2xl shadow-primary overflow-y-scroll bg-white "
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
            <div className="w-[90%] mx-auto mt-10">
              {subSubjects.length > 0 ? (
                subSubjects.map((subSubject) => (
                  <div
                    key={subSubject}
                    className="flex items-center justify-between my-5 w-[80%] mx-auto"
                  >
                    <p className="text-lg min-w-[250px] max-w-[350px] font-semibold text-textBrown">
                      {subSubject}
                    </p>

                    <button
                      disabled={isAddingLoading}
                      onClick={() => handleModifySuggestion(subSubject)}
                      className="bg-primary text-lg xl:text-base text-white mx-[0.9px] px-7 rounded-md"
                    >
                      {isAddingLoading && currentlyAdding == subSubject
                        ? "Adding..."
                        : "Add"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-lg font-semibold  text-textBrown">
                  No New SubSubjects Found
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NewSubSubjectsPopUp;
