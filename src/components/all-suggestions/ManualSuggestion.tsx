import { useState } from "react";
import NewSuggestions from "../suggestion/NewSuggestions";
import Header from "../common/Header";
import Drawer from "../suggestion/Drawer";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";

interface ManualSuggestionProps {
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  logout: () => void;
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
  addNewSuperCategory: (superCategory: string) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
  suggestions: SuggestionModel[];
  addNewSubSubject: (
    suggestion: SuggestionModel,
    subSubject: string,
    file: File
  ) => Promise<boolean>;
}

function ManualSuggestion({
  addSuggestion,
  suggestionCategories,
  addNewCategory,
  addNewSuperCategory,
  logout,
  addNewSubSubject,
  suggestions,
}: ManualSuggestionProps) {
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
      <NewSuggestions
        addNewSubSubject={addNewSubSubject}
        suggestions={suggestions}
        addNewCategory={addNewCategory}
        addNewSuperCategory={addNewSuperCategory}
        suggestionCategories={suggestionCategories}
        addSuggestion={addSuggestion}
      />
    </div>
  );
}

export default ManualSuggestion;
