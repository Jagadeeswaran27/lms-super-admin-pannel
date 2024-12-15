import { Add, Check, Close, Delete, Edit } from '@mui/icons-material';
import { ThemeColors } from '../../resources/colors';
import { MouseEvent, useState, useRef } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { toggleCategoryIsVerified } from '../../core/services/SuggestionService';
import IOSSwitch from '../common/IOSSwitch';
import AIButton from './AIButton';
import NewSuperCategoriesPopUp from './NewSuperCategoriesPopUp';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/config/firebase';

interface MappingCardProps {
  category: string;
  superCategory: string[];
  superCategories: string[];
  deleteCategory: (category: string, parentSuperCategory: string[]) => void;
  isVerified: boolean;
  modifySuperCategory: (
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

function MappingCard({
  category,
  superCategory,
  superCategories,
  deleteCategory,
  isVerified,
  modifySuperCategory,
  handleAddNewSuperCategoryByAI,
}: MappingCardProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [checked, setChecked] = useState<boolean>(isVerified);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newSuperCategories, setNewSuperCategories] = useState<string[]>([]);
  const [referenceSuperCategory, setReferenceSuperCategory] =
    useState<string[]>(superCategory);
  const nameRef = useRef<HTMLInputElement>(null);

  const sortedSuperCategories = superCategories.sort((a, b) =>
    a.localeCompare(b)
  );

  const handleOpenMenu = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // const handleModifyCategory = async () => {
  //   const isNameModified = nameRef.current?.value.trim() !== categoryName;
  //   const modifiedSuperCategories = [
  //     ...superCat.filter((cat) => !backupSuperCat.includes(cat)),
  //     ...backupSuperCat.filter((cat) => !superCat.includes(cat)),
  //   ];
  //   const oldSuperCategories = [
  //     ...backupSuperCat.filter((cat) => !superCat.includes(cat)),
  //   ];
  //   if (!isNameModified && modifiedSuperCategories.length === 0) {
  //     showSnackBar({
  //       dispatch,
  //       color: ThemeColors.error,
  //       message: 'No changes made',
  //     });
  //     return;
  //   }
  //   if (isNameModified) {
  //     const response = await modifySuperCategory(
  //       true,
  //       superCat,
  //       oldSuperCategories,
  //       categoryName.trim(),
  //       nameRef.current!.value.trim()
  //     );
  //     if (response) {
  //       setCategoryName(nameRef.current!.value.trim());
  //       setIsEdit(false);
  //     }
  //   }
  //   if (!isNameModified && modifiedSuperCategories.length > 0) {
  //     const response = await modifySuperCategory(
  //       false,
  //       modifiedSuperCategories,
  //       oldSuperCategories,
  //       categoryName.trim(),
  //       categoryName.trim()
  //     );
  //     if (response) {
  //       setBackupSuperCat(superCat);
  //       setIsEdit(false);
  //     }
  //   }
  // };

  const handleToggleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    event.preventDefault();
    const response = await toggleCategoryIsVerified(
      newChecked,
      superCategory,
      category
    );
    if (response) {
      setChecked(newChecked);
    }
  };

  const handleGetModifiedSuperCategories = async () => {
    setIsLoading(true);
    const suggestSuperCategoryIndividual = httpsCallable(
      functions,
      'suggestSuperCategoryIndividual'
    );
    try {
      const response = await suggestSuperCategoryIndividual({
        category: category,
        superCategories: superCategories.filter(
          (cat) => !superCategory.includes(cat)
        ),
      });
      const data = response.data as { suggestedSuperCategories: string[] };
      if (data.suggestedSuperCategories.length > 0) {
        setNewSuperCategories(
          data.suggestedSuperCategories.map((cat) => cat.split('.')[1].trim())
        );
        setShowPopUp(true);
      }
    } catch (e) {
      console.error('Error getting modified super categories:', e);
    }
    setIsLoading(false);
  };

  const handleAddSuperCategory = (superCategory: string) => {
    setReferenceSuperCategory([...referenceSuperCategory, superCategory]);
  };

  const handleRemoveSuperCategory = (superCategory: string) => {
    setReferenceSuperCategory(
      referenceSuperCategory.filter((cat) => cat !== superCategory)
    );
  };

  const handleModifyCategory = async () => {
    const isNameModified = nameRef.current?.value.trim() !== category;
    const addedSuperCategories = referenceSuperCategory.filter(
      (cat) => !superCategory.includes(cat)
    );
    const removedSuperCategories = superCategory.filter(
      (cat) => !referenceSuperCategory.includes(cat)
    );
    modifySuperCategory(
      isNameModified,
      nameRef.current?.value ?? '',
      addedSuperCategories,
      removedSuperCategories
    );
  };

  return (
    <div
      className={`bg-white ${
        isEdit ? 'border border-primary' : ''
      } rounded-md w-[80%] mx-auto my-3 flex relative gap-2 items-center shadow-custom px-2 py-5 lg:pl-5 max-lg:px-7 max-sm:px-2 `}
    >
      <div className="flex gap-3 max-w-[40%] min-w-[40%] items-center">
        {isEdit ? (
          <div className="rounded-lg overflow-hidden">
            <input
              ref={nameRef}
              className={`focus:border-none text-textBrown px-2 focus:outline-none text-lg 
               bg-cardColor
             rounded-sm`}
              defaultValue={category}
            />
          </div>
        ) : (
          <div className="rounded-full overflow-hidden">
            <p>{category}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between w-[60%] items-center gap-5">
        <div>
          <ul className="flex items-start flex-wrap gap-3">
            {referenceSuperCategory.map((cat) => (
              <li
                key={cat}
                className="bg-authPrimary text-sm text-center rounded-full px-2 py-[1px] text-white"
              >
                {cat}
                {isEdit && (
                  <Close
                    fontSize="small"
                    onClick={() => {
                      handleRemoveSuperCategory(cat);
                    }}
                    className="cursor-pointer"
                  />
                )}
              </li>
            ))}
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
              {sortedSuperCategories
                .filter(
                  (category) => !referenceSuperCategory.includes(category)
                )
                .map((category) => (
                  <MenuItem
                    key={category}
                    className="flex justify-between"
                    onClick={() => {
                      handleCloseMenu();
                      handleAddSuperCategory(category);
                    }}
                  >
                    <p>{category}</p>
                  </MenuItem>
                ))}
            </Menu>
          </ul>
          {showPopUp && (
            <NewSuperCategoriesPopUp
              category={category}
              handleAddNewSuperCategoryByAI={handleAddNewSuperCategoryByAI}
              closePrompt={() => setShowPopUp(false)}
              newSuperCategories={newSuperCategories}
            />
          )}
          {!isEdit && (
            <div
              className={`${
                checked ? 'opacity-0 invisible' : ''
              } w-[180px] mt-7`}
            >
              <AIButton
                isLoading={isLoading}
                text="AI"
                onClick={handleGetModifiedSuperCategories}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <IOSSwitch checked={checked} onChange={handleToggleChange} />
          {isEdit ? (
            <Check
              onClick={handleModifyCategory}
              className=" mx-2 transition-all transform hover:scale-110"
              sx={{
                color: ThemeColors.brown,
                cursor: 'pointer',
              }}
            />
          ) : (
            <Edit
              onClick={checked ? () => {} : () => setIsEdit(true)}
              className={`${
                checked && 'opacity-0 invisible'
              } mx-2 transition-all transform hover:scale-110`}
              sx={{
                color: ThemeColors.brown,
                cursor: checked ? 'default' : 'pointer',
              }}
            />
          )}
          <Delete
            onClick={
              checked ? () => {} : () => deleteCategory(category, superCategory)
            }
            className={`${
              checked && 'opacity-0 invisible'
            } transition-all transform hover:scale-110`}
            sx={{
              color: ThemeColors.brown,
              cursor: checked ? 'default' : 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MappingCard;
