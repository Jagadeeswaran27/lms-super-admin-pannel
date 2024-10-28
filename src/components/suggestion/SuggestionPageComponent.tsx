import Header from "../common/Header";
import { useEffect, useState } from "react";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import Drawer from "./Drawer";
import AddedSuggestions from "./AddedSuggestions";
import { icons } from "../../resources/icons";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import AISuggestions from "./AISuggestions";

interface SuggestionPageComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  deleteSuggestion: (id: string) => void;
  addNewCategory: (category: string) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
}
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

function SuggestionPageComponent({
  logout,
  suggestions,
  addNewCategory,
  deleteSuggestion,
  addSuggestion,
  modifySuggestion,
  suggestionCategories,
}: SuggestionPageComponentProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showNamePrompt, setShowNamePrompt] = useState<boolean>(false);
  useEffect(() => {
    if (showNamePrompt) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [showNamePrompt]);

  function openDrawer() {
    setShowDrawer(true);
  }

  function closeDrawer() {
    setShowDrawer(false);
  }

  return (
    <div>
      {showNamePrompt && (
        <AISuggestions
          addSuggestion={addSuggestion}
          modifySuggestion={modifySuggestion}
          suggestions={suggestions}
          suggestionCategories={suggestionCategories}
          addNewCategory={addNewCategory}
          addNewPromptItem={() => {}}
          closePrompt={() => setShowNamePrompt(false)}
        />
      )}
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
              suggestionCategories={suggestionCategories}
              deleteSuggestion={deleteSuggestion}
              suggestions={suggestions}
            />
          ) : (
            <p className="flex flex-1 text-brown font-semibold md:text-xl text-base h-full items-center justify-center">
              No Suggestions Found
            </p>
          )}
        </div>
        <div className="fixed right-0 bottom-0 p-5">
          <img
            onClick={() => setShowNamePrompt(true)}
            className="cursor-pointer w-[80px] h-[80px]"
            src={icons.bot}
          />
        </div>
        {/* <NewSuggestions addSuggestion={addSuggestion} /> */}
      </section>
    </div>
  );
}

export default SuggestionPageComponent;
