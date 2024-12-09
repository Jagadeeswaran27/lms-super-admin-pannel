import { Add, Check, Close, Delete, Edit } from '@mui/icons-material';
import { SuggestionModel } from '../../models/suggestion/SuggestionModel';
import { ThemeColors } from '../../resources/colors';
import { MouseEvent, useContext, useRef, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { SuggestionCategoriesModel } from '../../models/suggestion/SuggestionCategoriesModel';
import { showSnackBar } from '../../utils/Snackbar';
import { SnackBarContext } from '../../store/SnackBarContext';
import IOSSwitch from '../common/IOSSwitch';
import AIButton from './AIButton';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/config/firebase';
import NewCategoriesPopUp from './NewCategoriesPopUp';

interface SuggestionCardProps {
  suggestion: SuggestionModel;
  index: number;
  deleteSuggestion: (id: string) => void;
  suggestionCategories: SuggestionCategoriesModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
  suggestions: SuggestionModel[];
  toggleIsVerified: (suggestion: SuggestionModel, newChecked: boolean) => void;
}

function SuggestionCard({
  suggestion,
  index,
  deleteSuggestion,
  suggestionCategories,
  modifySuggestion,
  toggleIsVerified,
}: // isViewMapping,
SuggestionCardProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newTags, setNewTags] = useState<string[]>(suggestion.tag);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const isEven = index % 2 === 0;
  const sortedSuggestions = suggestionCategories
    .sort((a, b) => a.superCategory.name.localeCompare(b.superCategory.name))
    .filter((category) => !newTags.includes(category.superCategory.name));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);

  const nameRef = useRef<HTMLInputElement>(null);

  const handleOpenMenu = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleModifySuggestion = async () => {
    const name = nameRef.current?.value.trim();
    if (name?.length === 0) {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: 'Name cannot be empty',
      });
      return;
    }
    if (newTags.length === 0) {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: 'Please select at least one tag',
      });
      return;
    }
    const response = await modifySuggestion({
      ...suggestion,
      name: name!,
      tag: newTags,
    });
    if (response) {
      setIsEdit(false);
      showSnackBar({
        dispatch,
        color: ThemeColors.success,
        message: 'Suggestion modified successfully',
      });
    } else {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: 'Failed to modify suggestion',
      });
    }
  };

  const handleToggleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    event.preventDefault();
    toggleIsVerified(suggestion, newChecked);
  };
  const handleGetModifiedSuggestion = async () => {
    setIsLoading(true);
    const categories: string[] = [];
    suggestionCategories.map((category) =>
      category.superCategory.secondLevelCategories.map((cat) =>
        categories.push(cat.name)
      )
    );
    const modifyTags = httpsCallable(functions, 'modifyTags');
    try {
      const response = await modifyTags({
        subjectData: {
          name: suggestion.name,
          tags: suggestion.tag,
        },
        referenceTags: categories,
      });
      const data = response.data as {
        newCategories: string[];
      };
      if (data.newCategories.length > 0) {
        setNewCategories(
          data.newCategories.map((cat) => cat.split('.')[1].trim())
        );
        setShowPopUp(true);
      }
    } catch (error) {
      console.error('Error fetching name suggestions:', error);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`${
        isEven ? 'bg-white' : 'bg-cardColor'
      } rounded-md w-[80%] mx-auto my-3 flex relative gap-2 items-center shadow-custom px-2 py-5 lg:pl-5 max-lg:px-7 max-sm:px-2 ${
        isEdit ? 'border border-primary' : ''
      }`}
    >
      <div className="flex gap-3 max-w-[40%] min-w-[40%] items-center">
        <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
          <img
            className="w-full h-full rounded-full object-cover"
            src={suggestion.image}
            alt={`${suggestion.name} avatar`}
          />
        </div>
        {isEdit ? (
          <div className="rounded-lg overflow-hidden">
            <input
              ref={nameRef}
              className={`focus:border-none text-textBrown px-2 focus:outline-none text-lg ${
                isEven ? 'bg-cardColor' : 'bg-white'
              } px-1 rounded-sm`}
              defaultValue={suggestion.name}
            />
          </div>
        ) : (
          <p className="text-lg pt-1 text-textBrown">{suggestion.name}</p>
        )}
      </div>
      <div className="flex justify-between w-[60%] items-center gap-5">
        <div>
          <ul className="flex items-center flex-wrap gap-3">
            {isEdit
              ? newTags.map((cat, _) => (
                  <li
                    key={_}
                    className="bg-authPrimary text-sm text-center rounded-full px-2 py-[1px] text-white"
                  >
                    {cat}
                    <Close
                      fontSize="small"
                      onClick={() =>
                        setNewTags((pre) => pre.filter((p) => p !== cat))
                      }
                      className="cursor-pointer"
                    />
                  </li>
                ))
              : suggestion.tag.map((cat, _) => {
                  // const catString = findSuperCategory(suggestionCategories, cat).split(':')
                  return (
                    <li
                      key={_}
                      className="bg-authPrimary text-sm rounded-full px-2 py-[1px] text-white"
                    >
                      {cat}
                    </li>
                  );
                })}
            {isEdit && (
              <Add onClick={handleOpenMenu} className="cursor-pointer" />
            )}
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              className="max-h-[600px]"
            >
              {sortedSuggestions.map((category) =>
                category.superCategory.secondLevelCategories.map((cat) => (
                  <MenuItem
                    key={cat.name}
                    className="flex justify-between"
                    onClick={() => {
                      handleCloseMenu();
                      setNewTags((pre) => [...pre, cat.name]);
                    }}
                  >
                    <p>{cat.name}</p>
                  </MenuItem>
                ))
              )}
            </Menu>
          </ul>
          {showPopUp && (
            <NewCategoriesPopUp
              modifySuggestion={modifySuggestion}
              suggestion={suggestion}
              existingCategories={suggestionCategories
                .map((cat) =>
                  cat.superCategory.secondLevelCategories.map((cat) => cat.name)
                )
                .flat()}
              newCategories={newCategories}
              closePrompt={() => setShowPopUp(false)}
            />
          )}
          {!isEdit && (
            <div
              className={`${
                suggestion.isVerified ? 'opacity-0 invisible' : ''
              } w-[180px] mt-7`}
            >
              <AIButton
                isLoading={isLoading}
                text="AI"
                onClick={handleGetModifiedSuggestion}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <IOSSwitch
            checked={suggestion.isVerified}
            onChange={handleToggleChange}
          />
          {isEdit ? (
            <Check
              onClick={handleModifySuggestion}
              className="cursor-pointer mx-2 transition-all transform hover:scale-110"
              sx={{
                color: ThemeColors.brown,
              }}
            />
          ) : (
            <Edit
              onClick={suggestion.isVerified ? () => {} : () => setIsEdit(true)}
              className={`${
                suggestion.isVerified && 'opacity-0 invisible'
              } cursor-pointer mx-2 transition-all transform hover:scale-110`}
              sx={{
                color: ThemeColors.brown,
              }}
            />
          )}
          <Delete
            onClick={
              suggestion.isVerified || suggestion.registeredBy.length > 0
                ? () => {
                    showSnackBar({
                      dispatch,
                      color: ThemeColors.error,
                      message: 'Cannot delete suggestion',
                    });
                  }
                : () => deleteSuggestion(suggestion.id)
            }
            className={`${
              suggestion.isVerified && 'opacity-0 cursor-default'
            } cursor-pointer transition-all transform hover:scale-110`}
            sx={{
              color: ThemeColors.brown,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SuggestionCard;
