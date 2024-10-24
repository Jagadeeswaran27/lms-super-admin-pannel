import { Close } from "@mui/icons-material";
import AIButton from "./AIButton";
import { icons } from "../../resources/icons";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../core/config/firebase";
import { useContext, useState } from "react";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";

interface SuggestionNamePromptProps {
  closePrompt: () => void;
  addNewPromptItem: (name: string) => void;
}

interface SuggestionResponse {
  names: string[];
  summary: string;
}

const defaultPrompt =
  "Suggest some course name for complete web development knowledge with the maximum letters of 20";

function SuggestionNamePrompt({
  closePrompt,
  addNewPromptItem,
}: SuggestionNamePromptProps) {
  function handleAddNewPromptItem(name: string) {
    addNewPromptItem(name);
    closePrompt();
  }

  const [prompt, setPrompt] = useState<string>(defaultPrompt);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<SuggestionResponse | null>(null);
  const [_, dispatch] = useContext(SnackBarContext);

  const getSuggestions = async (prompt: string) => {
    if (prompt.trim().length === 0) {
      showSnackBar({
        color: ThemeColors.error,
        dispatch: dispatch,
        message: "Type Something!",
      });
      return;
    }
    setIsLoading(true);
    const nameSuggestion = httpsCallable(functions, "nameSuggestion");
    try {
      const response = await nameSuggestion({ prompt });
      const data: SuggestionResponse = (response.data as any).result;
      setResponse({
        summary: data.summary,
        names: data.names.map((name) => name.replace(/^\d+\.\s/, "")),
      });
    } catch (error) {
      console.error("Error fetching name suggestions:", error);
    }
    setIsLoading(false);
  };

  return (
    <div
      onClick={closePrompt}
      className="fixed z-10  w-screen fade-in h-screen top-0 left-0 bg-[rgba(255,255,255,0.7)] flex justify-center items-center"
    >
      <div className="flex w-full h-full justify-center items-center">
        <section
          className="w-[60%] h-[70%] mx-auto rounded-2xl shadow-primary overflow-hidden bg-white "
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "fadeInUp 0.3s ease-in" }}
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
            <h1 className="text-secondary my-3 text-lg font-semibold">
              Prompt{" "}
              <span className="text-textBrown font-thin text-xs">(Add)</span>
            </h1>

            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className="border-primary border flex items-center justify-center py-3 my-3 px-7 rounded-full outline-none w-[85%] mx-auto min-h-[90px] max-h-[90px]  overflow-y-auto scrollbar-hide resize-none"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "transparent transparent",
              }}
            />
            <div className="flex justify-end">
              <button
                disabled={isLoading}
                onClick={() => getSuggestions(prompt)}
                className="relative text-center my-3 w-[140px] bg-primary px-5 py-2 text-white text-sm rounded-full"
              >
                {isLoading ? "Loading..." : "Suggest"}
                <img className="absolute right-1 top-1" src={icons.send} />
              </button>
            </div>
            {response && (
              <section
                className=" min-h-[250px] max-h-[250px] overflow-y-scroll my-3 w-[90%] mx-auto text-lg "
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                <h1>{response.summary}</h1>
                {response.names.map((name, index) => (
                  <div
                    className="flex gap-10 items-center my-5 w-[80%] mx-auto"
                    key={index}
                  >
                    <p className="min-w-[350px] text-base max-w-[350px]">
                      {index + 1}. {name}
                    </p>

                    <button
                      onClick={() => handleAddNewPromptItem(name)}
                      className="bg-primary text-xs cursor-pointer xl:text-base text-white mx-[0.9px] px-7 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </section>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SuggestionNamePrompt;
