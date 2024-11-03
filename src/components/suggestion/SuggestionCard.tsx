import { Add, Check, Close, Delete, Edit } from "@mui/icons-material";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { ThemeColors } from "../../resources/colors";
import { MouseEvent, useContext, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";

interface SuggestionCardProps {
  suggestion: SuggestionModel;
  index: number;
  deleteSuggestion: (id: string) => void;
  suggestionCategories: SuggestionCategoriesModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
}

function SuggestionCard({
  suggestion,
  index,
  deleteSuggestion,
  suggestionCategories,
  modifySuggestion,
}: // isViewMapping,
SuggestionCardProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newTags, setNewTags] = useState<string[]>(suggestion.tag);
  const isEven = index % 2 === 0;
  const sortedSuggestions = suggestionCategories
    .sort((a, b) => a.superCategory.name.localeCompare(b.superCategory.name))
    .filter((category) => !newTags.includes(category.superCategory.name));
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
        message: "Name cannot be empty",
      });
      return;
    }
    if (newTags.length === 0) {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: "Please select at least one tag",
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
        message: "Suggestion modified successfully",
      });
    } else {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: "Failed to modify suggestion",
      });
    }
  };

  return (
    <div
      className={`${
        isEven ? "bg-white" : "bg-cardColor"
      } rounded-md w-[80%] mx-auto my-3 flex relative gap-2 items-center shadow-custom px-2 py-5 lg:pl-5 max-lg:px-7 max-sm:px-2 ${
        isEdit ? "border border-primary" : ""
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
                isEven ? "bg-cardColor" : "bg-white"
              } px-1 rounded-sm`}
              defaultValue={suggestion.name}
            />
          </div>
        ) : (
          <p className="text-lg pt-1 text-textBrown">{suggestion.name}</p>
        )}
      </div>
      <div className="flex justify-between w-[60%] items-start gap-5">
        <ul className="flex items-start flex-wrap gap-3">
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
                  key={cat}
                  className="flex justify-between"
                  onClick={() => {
                    handleCloseMenu();
                    setNewTags((pre) => [...pre, cat]);
                  }}
                >
                  <p>{cat}</p>
                </MenuItem>
              ))
            )}
          </Menu>
        </ul>
        <div className="flex gap-2 items-center">
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
              onClick={() => setIsEdit(true)}
              className="cursor-pointer mx-2 transition-all transform hover:scale-110"
              sx={{
                color: ThemeColors.brown,
              }}
            />
          )}
          <Delete
            onClick={() => deleteSuggestion(suggestion.id)}
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

export default SuggestionCard;
