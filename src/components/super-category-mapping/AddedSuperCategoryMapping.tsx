import { Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import { SuggestionModel } from '../../models/suggestion/SuggestionModel';
import { icons } from '../../resources/icons';
import { MouseEvent, useEffect, useState } from 'react';
import { SuggestionCategoriesModel } from '../../models/suggestion/SuggestionCategoriesModel';
import MappingCard from '../suggestion/MappingCard';
import AISuggestions from '../suggestion/AISuggestions';
import AISuperCategorySuggestions from '../suggestion/AISuperCategorySuggestions';
import refactorSuggestionCategories from '../../utils/helper';
import { ThemeColors } from '../../resources/colors';
import { Link } from 'react-router-dom';
import { routes } from '../../utils/Routes';
import { Check } from '@mui/icons-material';

interface AddedSuperCategoryMapping {
  suggestions: SuggestionModel[];
  deleteSuggestion: (id: string) => void;
  suggestionCategories: SuggestionCategoriesModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
  addNewSuperCategory: (superCategory: string) => Promise<boolean>;
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  toggleIsVerified: (
    newChecked: boolean,
    superCat: string[],
    categoryName: string
  ) => void;
  deleteCategory: (category: string, parentSuperCategory: string[]) => void;
  handleModifySuperCategory: (
    isNameModified: boolean,
    newName: string,
    oldName: string,
    addedSuperCategories: string[],
    removedSuperCategories: string[],
    oldSuperCategories: string[]
  ) => Promise<boolean>;
  handleAddNewSuperCategoryByAI: (
    superCategory: string,
    category: string
  ) => Promise<boolean>;
}
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

function AddedSuperCategorySuggestions({
  suggestions,
  suggestionCategories,
  modifySuggestion,
  addNewCategory,
  addNewSuperCategory,
  addSuggestion,
  handleModifySuperCategory,
  deleteCategory,
  toggleIsVerified,
  handleAddNewSuperCategoryByAI,
}: AddedSuperCategoryMapping) {
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [selectedTag1, setSelectedTag1] = useState<string[]>(['All']);

  const [showNormalSuggestions, setShowNormalSuggestions] =
    useState<boolean>(false);
  const [
    showSuperCategoryBasedSuggestions,
    setShowSuperCategoryBasedSuggestions,
  ] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [unverifiedChecked, setUnverifiedChecked] = useState<boolean>(false);
  const [setOperation, setSetOperation] = useState<string | null>(null);

  useEffect(() => {
    if (showNormalSuggestions) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, [showNormalSuggestions]);

  const handleMouseEnter1 = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleToggleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    setChecked(newChecked);
    setUnverifiedChecked(false);
  };

  const handleUnverifiedToggleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    setUnverifiedChecked(newChecked);
    setChecked(false);
  };

  const handleMouseLeave1 = () => {
    setAnchorEl1(null);
  };

  const handleSetSelectedTag1 = (tag: string) => {
    if (tag === 'All') {
      setSelectedTag1(['All']);
    } else {
      setSelectedTag1((prevTags) => {
        const newTags = prevTags.includes('All')
          ? [tag]
          : prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : [...prevTags, tag];
        return newTags.length ? newTags : ['All'];
      });
    }
  };

  const getFilteredSuggestions = () => {
    let filteredSuggCategories = refactorSuggestionCategories(
      JSON.parse(JSON.stringify(suggestionCategories))
    );

    if (!selectedTag1.includes('All')) {
      filteredSuggCategories = filteredSuggCategories.filter((sugg) =>
        sugg.superCategories.some((tag) => selectedTag1.includes(tag))
      );
    }

    if (checked) {
      filteredSuggCategories = filteredSuggCategories.filter(
        (sugg) => sugg.isVerified
      );
    }

    if (unverifiedChecked) {
      filteredSuggCategories = filteredSuggCategories.filter(
        (sugg) => !sugg.isVerified
      );
    }

    if (setOperation) {
      const allSuperCategories = new Set(
        suggestionCategories.flatMap((category) => category.superCategory.name)
      );
      filteredSuggCategories = filteredSuggCategories.filter((sugg) => {
        const suggestionTagSet = new Set(sugg.superCategories);
        const selectedTagSet = selectedTag1.includes('All')
          ? allSuperCategories
          : new Set(selectedTag1);

        // Perform the chosen set operation
        switch (setOperation) {
          case 'intersection':
            return [...selectedTagSet].every((tag) =>
              suggestionTagSet.has(tag)
            );

          case 'union':
            return [...selectedTagSet].some((tag) => suggestionTagSet.has(tag));

          case 'difference':
            return [...suggestionTagSet].some(
              (tag) => !selectedTagSet.has(tag)
            );

          default:
            return false;
        }
      });
    }

    return filteredSuggCategories;
  };

  const filteredSuggestionCategories = getFilteredSuggestions();

  return (
    <div className="shadow-custom py-3">
      {showNormalSuggestions && (
        <AISuggestions
          addNewSuperCategory={addNewSuperCategory}
          addSuggestion={addSuggestion}
          modifySuggestion={modifySuggestion}
          suggestions={suggestions}
          suggestionCategories={suggestionCategories}
          addNewCategory={addNewCategory}
          addNewPromptItem={() => {}}
          closePrompt={() => setShowNormalSuggestions(false)}
        />
      )}
      {showSuperCategoryBasedSuggestions && (
        <AISuperCategorySuggestions
          suggestions={suggestions}
          addNewSuperCategory={addNewSuperCategory}
          addNewCategory={addNewCategory}
          suggestionCategories={suggestionCategories}
          closePrompt={() => setShowSuperCategoryBasedSuggestions(false)}
        />
      )}
      <section className="flex items-center justify-end px-10 my-4">
        <div className="flex items-center gap-5">
          <div className="flex gap-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={setOperation === 'difference'}
                  onChange={(e) =>
                    setSetOperation(e.target.checked ? 'difference' : null)
                  }
                  style={{ color: ThemeColors.primary }}
                />
              }
              label="Difference"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={setOperation === 'intersection'}
                  onChange={(e) =>
                    setSetOperation(e.target.checked ? 'intersection' : null)
                  }
                  style={{ color: ThemeColors.primary }}
                />
              }
              label="Intersection"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={setOperation === 'union'}
                  onChange={(e) =>
                    setSetOperation(e.target.checked ? 'union' : null)
                  }
                  style={{ color: ThemeColors.primary }}
                />
              }
              label="Union"
            />
          </div>
        </div>
      </section>
      <section className="flex items-center justify-between px-10 my-4">
        <div className="flex items-center gap-4">
          <Link to={routes.subjectsToCategories}>
            <img
              src={icons.back}
              alt=""
              width={30}
              height={30}
              className="cursor-pointer"
            />
          </Link>
          <h1 className="text-textBrown md:text-3xl text-2xl max-sm:text-center font-medium">
            Already Added{' '}
            <span className="text-primary md:text-base text-sm">
              (Super Category Mapping)
            </span>
            :
          </h1>
        </div>

        <div className="flex items-center gap-5">
          {/* First Menu */}
          <p className="md:text-xl flex text-textBrown gap-2 text-base lg:text-lg">
            <span className="font-semibold">Sort by</span>Super Category:{' '}
            <span className="font-medium gap-2 flex">
              {selectedTag1.includes('All') ? 'All' : 'Multiple'}
              <img
                onClick={handleMouseEnter1}
                className="cursor-pointer"
                src={icons.dropdown}
                alt="dropdown"
              />
            </span>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl1}
              open={Boolean(anchorEl1)}
              onClose={handleMouseLeave1}
              className="max-h-[600px]"
            >
              <MenuItem onClick={() => handleSetSelectedTag1('All')}>
                All
              </MenuItem>
              {suggestionCategories.map((category) => (
                <MenuItem
                  key={category.superCategory.name}
                  className="flex justify-between"
                  onClick={() => {
                    handleSetSelectedTag1(category.superCategory.name);
                  }}
                >
                  <p>{category.superCategory.name}</p>
                  {selectedTag1.includes(category.superCategory.name) && (
                    <Check />
                  )}
                </MenuItem>
              ))}
            </Menu>
          </p>
        </div>
      </section>
      <div className="flex items-center justify-end">
        <p className="lg:text-xl opacity-0 text-primary my-5 ml-10 text-base font-medium cursor-default hover:underline">
          View Subjects Mapping
        </p>

        <div className="mr-20 flex items-center">
          <Checkbox
            checked={checked}
            onChange={handleToggleChange}
            style={{ color: ThemeColors.primary }}
          />
          <span className="text-textBrown text-lg font-semibold ml-2">
            Show Verified
          </span>
        </div>
        <div className="mr-20 flex items-center">
          <Checkbox
            checked={unverifiedChecked}
            onChange={handleUnverifiedToggleChange}
            style={{ color: ThemeColors.primary }}
          />
          <span className="text-textBrown text-lg font-semibold ml-2">
            Show Unverified
          </span>
        </div>
      </div>
      <div className="max-md:hidden mx-1">
        {filteredSuggestionCategories.map((cat) => {
          return (
            <div key={cat.category}>
              <MappingCard
                toggleIsVerified={toggleIsVerified}
                modifySuperCategory={handleModifySuperCategory}
                isVerified={cat.isVerified}
                deleteCategory={deleteCategory}
                superCategories={suggestionCategories.map(
                  (cat) => cat.superCategory.name
                )}
                category={cat.category}
                superCategory={cat.superCategories}
                handleAddNewSuperCategoryByAI={handleAddNewSuperCategoryByAI}
              />
            </div>
          );
        })}
        <div className="fixed right-0 bottom-0 p-5">
          <img
            onClick={() => setShowSuperCategoryBasedSuggestions(true)}
            className="cursor-pointer w-[80px] h-[80px]"
            src={icons.bot}
            alt="bot"
          />
        </div>
      </div>
    </div>
  );
}

export default AddedSuperCategorySuggestions;
