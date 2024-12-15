import Header from '../common/Header';
import { useState } from 'react';
import { SuggestionModel } from '../../models/suggestion/SuggestionModel';
import { SuggestionCategoriesModel } from '../../models/suggestion/SuggestionCategoriesModel';
import AddedSuperCategorySuggestions from './AddedSuperCategoryMapping';
import Drawer from '../suggestion/Drawer';
import { ThemeColors } from '../../resources/colors';
import { CircularProgress } from '@mui/material';

interface SuperCategoryMappingComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  deleteSuggestion: (id: string) => void;
  isLoading: boolean;
  deleteCategory: (category: string, parentSuperCategory: string[]) => void;
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
  addNewSuperCategory: (superCategory: string) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
  toggleIsVerified: (
    newChecked: boolean,
    superCat: string[],
    categoryName: string
  ) => void;
  handleModifySuperCategory: (
    isNameModified: boolean,
    newName: string,
    addedSuperCategories: string[],
    removedSuperCategories: string[]
  ) => Promise<boolean>;
  handleAddNewSuperCategoryByAI: (
    superCategory: string,
    category: string
  ) => Promise<boolean>;
}

function CategoriesToSuperCategoriesComponent({
  logout,
  suggestions,
  addNewCategory,
  deleteSuggestion,
  deleteCategory,
  addSuggestion,
  addNewSuperCategory,
  modifySuggestion,
  suggestionCategories,
  toggleIsVerified,
  isLoading,
  handleModifySuperCategory,
  handleAddNewSuperCategoryByAI,
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
          {isLoading && (
            <div className="flex items-center justify-center h-screen">
              <CircularProgress
                sx={{
                  color: ThemeColors.authPrimary,
                  size: 50,
                  animationDuration: '1s',
                  animationTimingFunction: 'ease-in-out',
                }}
              />
            </div>
          )}
          {!isLoading && suggestions.length > 0 ? (
            <AddedSuperCategorySuggestions
              toggleIsVerified={toggleIsVerified}
              addNewCategory={addNewCategory}
              addNewSuperCategory={addNewSuperCategory}
              addSuggestion={addSuggestion}
              modifySuggestion={modifySuggestion}
              suggestionCategories={suggestionCategories}
              deleteSuggestion={deleteSuggestion}
              deleteCategory={deleteCategory}
              suggestions={suggestions.sort((a, b) =>
                a.name.localeCompare(b.name)
              )}
              handleModifySuperCategory={handleModifySuperCategory}
              handleAddNewSuperCategoryByAI={handleAddNewSuperCategoryByAI}
            />
          ) : (
            <p className="flex flex-1 text-brown font-semibold md:text-xl text-base h-full items-center justify-center">
              No categories found
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default CategoriesToSuperCategoriesComponent;
