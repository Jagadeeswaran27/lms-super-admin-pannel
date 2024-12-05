import { Checkbox, Menu, MenuItem } from "@mui/material";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { icons } from "../../resources/icons";
import SuggestionCard from "./SuggestionCard";
import { MouseEvent, useEffect, useState } from "react";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { Check } from "@mui/icons-material";
import AISuggestions from "./AISuggestions";
import { ThemeColors } from "../../resources/colors";
import { Link } from "react-router-dom";
import { routes } from "../../utils/Routes";

interface AddedSuggestionsProps {
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
}
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

let backupSuggestions: SuggestionModel[] = [];

function AddedSuggestions({
  suggestions,
  deleteSuggestion,
  suggestionCategories,
  modifySuggestion,
  addNewCategory,
  addNewSuperCategory,
  addSuggestion,
}: AddedSuggestionsProps) {
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [selectedTag1, setSelectedTag1] = useState<string>("All");
  const [selectedTag2, setSelectedTag2] = useState<string[]>(["All"]);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<SuggestionModel[]>(suggestions);
  const [suggestionCat, setSuggestionCat] =
    useState<SuggestionCategoriesModel[]>(suggestionCategories);

  const [showNormalSuggestions, setShowNormalSuggestions] =
    useState<boolean>(false);

  const [checked, setChecked] = useState<boolean>(false);

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
      setFilteredSuggestions((pre) => {
        backupSuggestions = pre;
        return pre.filter((sugg) => sugg.isVerified);
      });
      // setRefactoredSuggestionCategories((pre) => {
      //   backupRefactoredSuggestionCategories = pre;
      //   return pre.filter((cat) => cat.isVerified);
      // });
    } else {
      setFilteredSuggestions(backupSuggestions);
      // setRefactoredSuggestionCategories(backupRefactoredSuggestionCategories);
    }
  }, [checked]);

  useEffect(() => {
    // setRefactoredSuggestionCategories(
    //   refactorSuggestionCategories(suggestionCategories)
    // );
    if (selectedTag1 === "All") {
      setSuggestionCat(suggestionCategories);
    }
  }, [suggestionCategories]);

  useEffect(() => {
    if (selectedTag1 === "All" && selectedTag2.includes("All")) {
      setFilteredSuggestions(suggestions);
      setSuggestionCat(suggestionCategories);
    } else {
      setFilteredSuggestions(
        suggestions.filter(
          (suggestion) =>
            selectedTag2.includes("All") ||
            selectedTag2.every((tag) => suggestion.tag.includes(tag))
        )
      );
    }
  }, [suggestions, selectedTag1, selectedTag2]);

  const handleMouseEnter1 = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl1(event.currentTarget);
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

  const handleMouseEnter2 = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleMouseLeave2 = () => {
    setAnchorEl2(null);
  };

  const handleSetSelectedTag1 = (tag: string) => {
    setSelectedTag1(tag);
    if (tag === "All") {
      setSelectedTag2(["All"]);
      setSuggestionCat(suggestionCategories);
      // setRefactoredSuggestionCategories(
      //   refactorSuggestionCategories(suggestionCategories)
      // );
    } else {
      setSuggestionCat(
        suggestionCategories.filter(
          (cat) => cat.superCategory.name.trim() === tag.trim()
        )
      );
      // setRefactoredSuggestionCategories(
      //   refactorSuggestionCategories(suggestionCategories).filter((cat) =>
      //     cat.superCategories.includes(tag)
      //   )
      // );
    }
  };

  const handleSetSelectedTag2 = (tag: string) => {
    if (tag === "All") {
      setSelectedTag2(["All"]);
    } else {
      setSelectedTag2((prevTags) => {
        const newTags = prevTags.includes("All")
          ? [tag]
          : prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : [...prevTags, tag];
        return newTags.length ? newTags : ["All"];
      });
    }
  };

  // const handleDeleteCategory = async (
  //   category: string,
  //   superCategory: string[]
  // ) => {
  //   const response = await deleteCategory(category, superCategory);
  //   if (response) {
  //     showSnackBar({
  //       dispatch,
  //       color: ThemeColors.success,
  //       message: "Category Deleted Successfully!",
  //     });
  //     setRefactoredSuggestionCategories((prevCategories) =>
  //       prevCategories.filter((cat) => cat.category !== category)
  //     );
  //   } else {
  //     showSnackBar({
  //       dispatch,
  //       color: ThemeColors.error,
  //       message: "Failed to Delete Category",
  //     });
  //   }
  // };

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
      <section className="flex items-center justify-between px-10 my-4">
        <div className="flex items-center gap-4">
          <h1 className="text-textBrown md:text-3xl text-2xl max-sm:text-center font-medium">
            Already Added{" "}
            <span className="text-primary md:text-base text-sm">
              (Subjects)
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

          {/* Second Menu */}

          <p className="md:text-xl text-textBrown flex gap-2 text-lg">
            Category:
            <span className="font-medium gap-2 flex">
              {selectedTag2.includes("All") ? "All" : "Multiple"}
              <img
                onClick={handleMouseEnter2}
                className="cursor-pointer"
                src={icons.dropdown}
              />
            </span>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl2}
              open={Boolean(anchorEl2)}
              onClose={handleMouseLeave2}
              className="max-h-[600px]"
            >
              <MenuItem onClick={() => handleSetSelectedTag2("All")}>
                All
              </MenuItem>
              {suggestionCat.map((category) =>
                category.superCategory.secondLevelCategories.map((cat) => {
                  const catName = cat.name.trim();
                  return (
                    <MenuItem
                      key={catName}
                      className="flex justify-between"
                      onClick={() => handleSetSelectedTag2(catName)}
                    >
                      <p>{catName}</p>
                      {selectedTag2.includes(catName) && <Check />}
                    </MenuItem>
                  );
                })
              )}
            </Menu>
          </p>
        </div>
      </section>
      <div className="flex items-center justify-between">
        <p className="lg:text-xl text-primary my-5 ml-10 text-base font-medium hover:underline cursor-pointer">
          <Link to={routes.superCategoryMapping}>
            {" "}
            View Super Category Mapping
          </Link>
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
        {filteredSuggestions.length > 0 &&
          filteredSuggestions.map((suggestion, index) => (
            <div key={suggestion.id}>
              <SuggestionCard
                suggestions={suggestions}
                modifySuggestion={modifySuggestion}
                suggestionCategories={suggestionCategories}
                deleteSuggestion={deleteSuggestion}
                index={index}
                suggestion={suggestion}
              />
            </div>
          ))}
        {filteredSuggestions.length === 0 && (
          <p className="text-brown text-center font-semibold text-lg">
            No {selectedTag2.join(", ")} Suggestions Found
          </p>
        )}
        <div className="fixed right-0 bottom-0 p-5">
          <img
            onClick={() => setShowNormalSuggestions(true)}
            className="cursor-pointer w-[80px] h-[80px]"
            src={icons.bot}
          />
        </div>
      </div>
    </div>
  );
}

export default AddedSuggestions;
