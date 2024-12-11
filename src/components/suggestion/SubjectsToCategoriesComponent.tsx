import Header from '../common/Header';
import { useState } from 'react';
import { SuggestionModel } from '../../models/suggestion/SuggestionModel';
import Drawer from './Drawer';
import AddedSuggestions from './AddedSuggestions';
import { SuggestionCategoriesModel } from '../../models/suggestion/SuggestionCategoriesModel';
import { CircularProgress } from '@mui/material';
import { ThemeColors } from '../../resources/colors';

interface SuggestionPageComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  isLoading: boolean;
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
  toggleIsVerified: (suggestion: SuggestionModel, newChecked: boolean) => void;
}

function SubjectsToCategoriesComponent({
  logout,
  suggestions,
  addNewCategory,
  deleteSuggestion,
  addSuggestion,
  addNewSuperCategory,
  modifySuggestion,
  toggleIsVerified,
  isLoading,
  suggestionCategories,
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
            <AddedSuggestions
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
              No Subjects Found
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default SubjectsToCategoriesComponent;
