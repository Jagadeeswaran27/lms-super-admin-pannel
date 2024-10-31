import { Menu, MenuItem } from "@mui/material";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { icons } from "../../resources/icons";
import SuggestionCard from "./SuggestionCard";
import { MouseEvent, useEffect, useState } from "react";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { Check } from "@mui/icons-material";

interface AddedSuggestionsProps {
  suggestions: SuggestionModel[];
  deleteSuggestion: (id: string) => void;
  suggestionCategories: SuggestionCategoriesModel[];
  modifySuggestion: (suggestion: SuggestionModel) => Promise<boolean>;
}

function AddedSuggestions({
  suggestions,
  deleteSuggestion,
  suggestionCategories,
  modifySuggestion,
}: AddedSuggestionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTag, setSelectedTag] = useState<string[]>(["All"]);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<SuggestionModel[]>(suggestions);

  useEffect(() => {
    if (selectedTag.includes("All")) {
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions(
        suggestions.filter((suggestion) =>
          selectedTag.every((tag) => suggestion.tag.includes(tag))
        )
      );
    }
  }, [suggestions, selectedTag]);

  const sortedSuggestions = suggestionCategories.sort((a, b) =>
    a.name.replace(/\s+/g, "").localeCompare(b.name.replace(/\s+/g, ""))
  );

  const handleMouseEnter = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleSetSelectedTag = (tag: string) => {
    if (tag === "All") {
      setSelectedTag(["All"]);
    } else {
      setSelectedTag((prevTags) => {
        const newTags = prevTags.includes("All")
          ? [tag]
          : prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : [...prevTags, tag];
        return newTags.length ? newTags : ["All"];
      });
    }
  };

  return (
    <div className="shadow-custom py-3">
      <section className="flex items-center justify-between px-10 my-4">
        <h1 className="text-textBrown md:text-3xl text-2xl max-sm:text-center font-medium">
          Already Added{" "}
          <span className="text-primary md:text-base text-sm">
            (Suggestions)
          </span>{" "}
          :
        </h1>
        <p className="md:text-xl flex gap-2 text-lg">
          Sort by:{" "}
          <span className="font-medium gap-2 flex">
            {selectedTag.includes("All") ? "All" : "Multiple"}
            <img
              onClick={handleMouseEnter}
              className="cursor-pointer"
              src={icons.dropdown}
            />
          </span>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMouseLeave}
            className="max-h-[600px]"
          >
            <MenuItem onClick={() => handleSetSelectedTag("All")}>All</MenuItem>
            {sortedSuggestions.map((category) => (
              <MenuItem
                key={category.name}
                className="flex justify-between"
                onClick={() => handleSetSelectedTag(category.name)}
              >
                <p>{category.name}</p>
                {selectedTag.includes(category.name) && <Check />}
              </MenuItem>
            ))}
          </Menu>
        </p>
      </section>
      <div className="max-md:hidden mx-1">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion, index) => (
            <div key={suggestion.id}>
              <SuggestionCard
                modifySuggestion={modifySuggestion}
                suggestionCategories={suggestionCategories}
                deleteSuggestion={deleteSuggestion}
                index={index}
                suggestion={suggestion}
              />
            </div>
          ))
        ) : (
          <p className="text-brown text-center font-semibold text-lg">
            No {selectedTag.join(", ")} Suggestions Found
          </p>
        )}
      </div>
    </div>
  );
}

export default AddedSuggestions;
