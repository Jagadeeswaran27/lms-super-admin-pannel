import { Add, Check, Close, Delete, Edit } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";
import { MouseEvent, useContext, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import {
  modifySuggestionCategory,
  toggleCategoryIsVerified,
} from "../../core/services/SuggestionService";
import IOSSwitch from "../common/IOSSwitch";
import AIButton from "./AIButton";
import NewSuperCategoriesPopUp from "./NewSuperCategoriesPopUp";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../core/config/firebase";

interface MappingCardProps {
  category: string;
  superCategory: string[];
  superCategories: string[];
  deleteCategory: (category: string, parentSuperCategory: string[]) => void;
  isVerified: boolean;
  modifySuperCategory: (
    category: string,
    superCategory: string
  ) => Promise<boolean>;
}

function MappingCard({
  category,
  superCategory,
  superCategories,
  deleteCategory,
  isVerified,
  modifySuperCategory,
}: MappingCardProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [superCat, setSuperCat] = useState<string[]>(superCategory);
  const [checked, setChecked] = useState<boolean>(isVerified);
  const [categoryName, setCategoryName] = useState<string>(category);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newSuperCategories, setNewSuperCategories] = useState<string[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);
  const [backupSuperCat, setBackupSuperCat] = useState<string[]>(superCategory);

  const sortedSuperCategories = superCategories.sort((a, b) =>
    a.localeCompare(b)
  );

  const handleOpenMenu = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };


  // useEffect(() => {
  //   setSuperCat(superCategory);
  // }, [superCategory.length]);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleModifyCategory = async () => {
    const isNameModified = nameRef.current?.value.trim() !== categoryName;
    const modifiedSuperCategories = [
      ...superCat.filter((cat) => !backupSuperCat.includes(cat)),
      ...backupSuperCat.filter((cat) => !superCat.includes(cat)),
    ];
    const oldSuperCategories = [
      ...backupSuperCat.filter((cat) => !superCat.includes(cat)),
    ];
    if (!isNameModified && modifiedSuperCategories.length === 0) {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: "No changes made",
      });
      return;
    }
    if (isNameModified) {
      const response = await modifySuggestionCategory(
        true,
        superCat,
        oldSuperCategories,
        categoryName.trim(),
        nameRef.current!.value.trim()
      );
      if (response) {
        showSnackBar({
          dispatch,
          color: ThemeColors.success,
          message: "Category modified successfully",
        });
        setCategoryName(nameRef.current!.value.trim());
        setIsEdit(false);
      }
    }
    if (!isNameModified && modifiedSuperCategories.length > 0) {
      const response = await modifySuggestionCategory(
        false,
        modifiedSuperCategories,
        oldSuperCategories,
        categoryName.trim(),
        categoryName.trim()
      );
      if (response) {
        setBackupSuperCat(superCat);
        showSnackBar({
          dispatch,
          color: ThemeColors.success,
          message: "Category modified successfully",
        });
        setIsEdit(false);
      }
    }
  };

  const handleToggleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    event.preventDefault();
    const response = await toggleCategoryIsVerified(
      newChecked,
      superCat,
      categoryName
    );
    if (response) {
      setChecked(newChecked);
    }
  };

  const handleGetModifiedSuperCategories = async () => {
    setIsLoading(true);
    const suggestSuperCategoryIndividual = httpsCallable(
      functions,
      "suggestSuperCategoryIndividual"
    );
    try {
      const response = await suggestSuperCategoryIndividual({
        category: categoryName,
        superCategories: superCategories.filter(
          (cat) => !superCat.includes(cat)
        ),
      });
      const data = response.data as { suggestedSuperCategories: string[] };
      if (data.suggestedSuperCategories.length > 0) {
        setNewSuperCategories(
          data.suggestedSuperCategories.map((cat) => cat.split(".")[1].trim())
        );
        setShowPopUp(true);
      }
    } catch (e) {
      console.error("Error getting modified super categories:", e);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`bg-white ${
        isEdit ? "border border-primary" : ""
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
              defaultValue={categoryName}
            />
          </div>
        ) : (
          <div className="rounded-full overflow-hidden">
            <p>{categoryName}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between w-[60%] items-center gap-5">
        <div>
          <ul className="flex items-start flex-wrap gap-3">
            {superCat.map((cat, _) => (
              <li
                key={cat}
                className="bg-authPrimary text-sm text-center rounded-full px-2 py-[1px] text-white"
              >
                {cat}
                {isEdit && (
                  <Close
                    fontSize="small"
                    onClick={() =>
                      setSuperCat((pre) => pre.filter((p) => p !== cat))
                    }
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
              {sortedSuperCategories.map((category) => (
                <MenuItem
                  key={category}
                  className="flex justify-between"
                  onClick={() => {
                    handleCloseMenu();
                    setSuperCat((pre) => {
                      if (pre.includes(category)) {
                        return pre;
                      }
                      return [...pre, category];
                    });
                  }}
                >
                  <p>{category}</p>
                </MenuItem>
              ))}
            </Menu>
          </ul>
          {showPopUp && (
            <NewSuperCategoriesPopUp
              category={categoryName}
              modifySuperCategory={modifySuperCategory}
              closePrompt={() => setShowPopUp(false)}
              newSuperCategories={newSuperCategories}
            />
          )}
          {!isEdit && (
            <div
              className={`${
                checked ? "opacity-0 invisible" : ""
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
                cursor: "pointer",
              }}
            />
          ) : (
            <Edit
              onClick={checked ? () => {} : () => setIsEdit(true)}
              className={`${
                checked && "opacity-0 invisible"
              } mx-2 transition-all transform hover:scale-110`}
              sx={{
                color: ThemeColors.brown,
                cursor: checked ? "default" : "pointer",
              }}
            />
          )}
          <Delete
            onClick={
              checked ? () => {} : () => deleteCategory(categoryName, superCat)
            }
            className={`${
              checked && "opacity-0 invisible"
            } transition-all transform hover:scale-110`}
            sx={{
              color: ThemeColors.brown,
              cursor: checked ? "default" : "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MappingCard;
