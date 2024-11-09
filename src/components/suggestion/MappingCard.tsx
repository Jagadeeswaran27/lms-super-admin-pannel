import { Add, Check, Close, Delete, Edit } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";
import { MouseEvent, useContext, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { modifySuggestionCategory } from "../../core/services/SuggestionService";

interface MappingCardProps {
  category: string;
  superCategory: string[];
  superCategories: string[];
  deleteCategory: () => void;
}

function MappingCard({
  category,
  superCategory,
  superCategories,
  deleteCategory,
}: MappingCardProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [superCat, setSuperCat] = useState<string[]>(superCategory);
  const [categoryName, setCategoryName] = useState<string>(category);
  const nameRef = useRef<HTMLInputElement>(null);
  const [_, dispatch] = useContext(SnackBarContext);

  const sortedSuperCategories = superCategories.sort((a, b) =>
    a.localeCompare(b)
  );

  const handleOpenMenu = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleModifyCategory = async () => {
    const isNameModified = nameRef.current?.value.trim() !== categoryName;
    const modifiedSuperCategories = [
      ...superCat.filter((cat) => !superCategory.includes(cat)),
      ...superCategory.filter((cat) => !superCat.includes(cat)),
    ];
    const oldSuperCategories = [
      ...superCategory.filter((cat) => !superCat.includes(cat)),
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
        showSnackBar({
          dispatch,
          color: ThemeColors.success,
          message: "Category modified successfully",
        });
        setIsEdit(false);
      }
    }
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
      <div className="flex justify-between w-[60%] items-start gap-5">
        <ul className="flex items-start flex-wrap gap-3">
          {superCat.map((cat, _) => (
            <li
              key={_}
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
        <div className="flex gap-2 items-center">
          {isEdit ? (
            <Check
              onClick={handleModifyCategory}
              className="cursor-pointer mx-2 transition-all transform hover:scale-110"
              sx={{
                color: ThemeColors.brown,
              }}
            />
          ) : (
            <Edit
              onClick={() => setIsEdit(true)}
              className="cursor-pointer mx-2 transition-all transform hover:scale-110"
              sx={{
                color: ThemeColors.brown,
              }}
            />
          )}
          <Delete
            onClick={deleteCategory}
            className="cursor-pointer transition-all transform hover:scale-110"
            sx={{
              color: ThemeColors.brown,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MappingCard;
