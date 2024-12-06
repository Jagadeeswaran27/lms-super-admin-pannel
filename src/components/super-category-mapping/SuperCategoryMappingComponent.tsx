import Header from "../common/Header";
import { useState } from "react";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import AddedSuperCategorySuggestions from "./AddedSuperCategoryMapping";
import Drawer from "../suggestion/Drawer";

interface SuperCategoryMappingComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  deleteSuggestion: (id: string) => void;
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
  addNewSuperCategory: (superCategory: string) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
  toggleIsVerified: (
    newChecked: boolean,
    superCat: string[],
    categoryName: string
  ) => void;
}

function SuperCategoryMappingComponent({
  logout,
  suggestions,
  addNewCategory,
  deleteSuggestion,
  addSuggestion,
  addNewSuperCategory,
  modifySuggestion,
  suggestionCategories,
  toggleIsVerified,
}: SuperCategoryMappingComponentProps) {
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
            <AddedSuperCategorySuggestions
              toggleIsVerified={toggleIsVerified}
              addNewCategory={addNewCategory}
              addNewSuperCategory={addNewSuperCategory}
              addSuggestion={addSuggestion}
              modifySuggestion={modifySuggestion}
              suggestionCategories={suggestionCategories}
              deleteSuggestion={deleteSuggestion}
              suggestions={suggestions.sort((a, b) =>
                a.name.localeCompare(b.name)
              )}
            />
          ) : (
            <p className="flex flex-1 text-brown font-semibold md:text-xl text-base h-full items-center justify-center">
              No Suggestions Found
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default SuperCategoryMappingComponent;
