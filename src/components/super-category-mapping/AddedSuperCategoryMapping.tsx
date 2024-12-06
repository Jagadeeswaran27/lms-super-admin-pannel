import { Checkbox, Menu, MenuItem } from "@mui/material";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { icons } from "../../resources/icons";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import MappingCard from "../suggestion/MappingCard";
import AISuggestions from "../suggestion/AISuggestions";
import AISuperCategorySuggestions from "../suggestion/AISuperCategorySuggestions";
import refactorSuggestionCategories from "../../utils/helper";
import {
  deleteCategory,
  modifySuggestionCategory,
  toggleCategoryIsVerified,
} from "../../core/services/SuggestionService";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";
import { SnackBarContext } from "../../store/SnackBarContext";
import { Link } from "react-router-dom";
import { routes } from "../../utils/Routes";

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
}
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

let backupRefactoredSuggestionCategories: {
  category: string;
  isVerified: boolean;
  superCategories: string[];
}[] = [];

function AddedSuperCategorySuggestions({
  suggestions,
  suggestionCategories,
  modifySuggestion,
  addNewCategory,
  addNewSuperCategory,
  addSuggestion,
  toggleIsVerified,
}: AddedSuperCategoryMapping) {
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [selectedTag1, setSelectedTag1] = useState<string>("All");

  const [showNormalSuggestions, setShowNormalSuggestions] =
    useState<boolean>(false);
  const [
    showSuperCategoryBasedSuggestions,
    setShowSuperCategoryBasedSuggestions,
  ] = useState<boolean>(false);
  const [refactoredSuggestionCategories, setRefactoredSuggestionCategories] =
    useState<
      { category: string; isVerified: boolean; superCategories: string[] }[]
    >([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [_, dispatch] = useContext(SnackBarContext);

  useEffect(() => {
    if (showNormalSuggestions) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [showNormalSuggestions]);

  useEffect(() => {
    if (checked) {
      setRefactoredSuggestionCategories((pre) => {
        backupRefactoredSuggestionCategories = pre;
        return pre.filter((cat) => cat.isVerified);
      });
    } else {
      setRefactoredSuggestionCategories(backupRefactoredSuggestionCategories);
    }
  }, [checked]);

  useEffect(() => {
    setRefactoredSuggestionCategories(
      refactorSuggestionCategories(suggestionCategories)
    );
    if (selectedTag1 === "All") {
    }
  }, [suggestionCategories]);

  const handleMouseEnter1 = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  async function handleToggleIsVerified(
    newChecked: boolean,
    superCat: string[],
    categoryName: string
  ) {
    const response = await toggleCategoryIsVerified(
      newChecked,
      superCat,
      categoryName
    );

    if (response) {
      setRefactoredSuggestionCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.category === categoryName
            ? { ...cat, isVerified: newChecked }
            : cat
        )
      );
    }
  }

  const handleModifySuperCategory = async (
    category: string,
    superCategory: string
  ) => {
    const response = await modifySuggestionCategory(
      true,
      [superCategory],
      [],
      category,
      category
    );
    if (response) {
      setRefactoredSuggestionCategories((pre) =>
        pre.map((cat) =>
          cat.category === category
            ? {
                ...cat,
                superCategories: [...cat.superCategories, ...[superCategory]],
              }
            : cat
        )
      );

      showSnackBar({
        dispatch,
        color: ThemeColors.success,
        message: "Category modified successfully",
      });
    }
    return response;
  };

  const handleToggleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    setChecked(newChecked);
  };

  const handleMouseLeave1 = () => {
    setAnchorEl1(null);
  };

  const handleSetSelectedTag1 = (tag: string) => {
    setSelectedTag1(tag);
    if (tag === "All") {
      setRefactoredSuggestionCategories(
        refactorSuggestionCategories(suggestionCategories)
      );
    } else {
      setRefactoredSuggestionCategories(
        refactorSuggestionCategories(suggestionCategories).filter((cat) =>
          cat.superCategories.includes(tag)
        )
      );
    }
  };

  const handleDeleteCategory = async (
    category: string,
    superCategory: string[]
  ) => {
    const response = await deleteCategory(category, superCategory);
    if (response) {
      showSnackBar({
        dispatch,
        color: ThemeColors.success,
        message: "Category Deleted Successfully!",
      });
      setRefactoredSuggestionCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.category !== category)
      );
    } else {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: "Failed to Delete Category",
      });
    }
  };

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
      <section className="flex items-center justify-between px-10 my-4">
        <div className="flex items-center gap-4">
          <Link to={routes.suggestions}>
            <img
              src={icons.back}
              alt=""
              width={30}
              height={30}
              className="cursor-pointer"
            />
          </Link>
          <h1 className="text-textBrown md:text-3xl text-2xl max-sm:text-center font-medium">
            Already Added{" "}
            <span className="text-primary md:text-base text-sm">
              (Super Category Mapping)
            </span>
            :
          </h1>
        </div>

        <div className="flex items-center gap-5">
          {/* First Menu */}
          <p className="md:text-xl flex text-textBrown gap-2 text-base lg:text-lg">
            <span className="font-semibold">Sort by</span>Super Category:{" "}
            <span className="font-medium gap-2 flex">
              {selectedTag1}
              <img
                onClick={handleMouseEnter1}
                className="cursor-pointer"
                src={icons.dropdown}
              />
            </span>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl1}
              open={Boolean(anchorEl1)}
              onClose={handleMouseLeave1}
              className="max-h-[600px]"
            >
              <MenuItem onClick={() => handleSetSelectedTag1("All")}>
                All
              </MenuItem>
              {suggestionCategories.map((category) => (
                <MenuItem
                  key={category.superCategory.name}
                  className="flex justify-between"
                  onClick={() => {
                    handleMouseLeave1();
                    handleSetSelectedTag1(category.superCategory.name);
                  }}
                >
                  <p>{category.superCategory.name}</p>
                </MenuItem>
              ))}
            </Menu>
          </p>
        </div>
      </section>
      <div className="flex items-center justify-between">
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
      </div>
      <div className="max-md:hidden mx-1">
        {refactoredSuggestionCategories.map((cat) => {
          return (
            <div key={cat.category}>
              <MappingCard
                modifySuperCategory={handleModifySuperCategory}
                isVerified={cat.isVerified}
                deleteCategory={() =>
                  handleDeleteCategory(cat.category, cat.superCategories)
                }
                superCategories={suggestionCategories.map(
                  (cat) => cat.superCategory.name
                )}
                category={cat.category}
                superCategory={cat.superCategories}
              />
            </div>
          );
        })}
        <div className="fixed right-0 bottom-0 p-5">
          <img
            onClick={() => setShowSuperCategoryBasedSuggestions(true)}
            className="cursor-pointer w-[80px] h-[80px]"
            src={icons.bot}
          />
        </div>
      </div>
    </div>
  );
}

export default AddedSuperCategorySuggestions;
