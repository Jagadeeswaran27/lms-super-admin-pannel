import { Menu, MenuItem } from "@mui/material";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { icons } from "../../resources/icons";
import SuggestionCard from "./SuggestionCard";
import { MouseEvent, useEffect, useState } from "react";
import { options } from "../../utils/options";
import { Link } from "react-router-dom";
import { routes } from "../../utils/Routes";

interface AddedSuggestionsProps {
  suggestions: SuggestionModel[];
  deleteSuggestion: (id: string) => void;
  all?: boolean;
}

function AddedSuggestions({
  suggestions,
  deleteSuggestion,
  all,
}: AddedSuggestionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<SuggestionModel[]>(suggestions);

  useEffect(() => {
    if (selectedTag === "All") {
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions(() =>
        suggestions.filter(
          (suggestion) =>
            suggestion.tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }
  }, [suggestions]);
  const handleMouseEnter = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleSetSelectedTag = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "All") {
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions(() =>
        suggestions.filter(
          (suggestion) => suggestion.tag.toLowerCase() === tag.toLowerCase()
        )
      );
    }
    handleMouseLeave();
  };

  return (
    <div className="shadow-custom py-3">
      <section className="flex items-center justify-between px-10 my-4">
        <h1 className="text-textBrown md:text-3xl text-2xl  max-sm:text-center font-medium">
          Already Added{" "}
          <span className="text-primary md:text-base text-sm">
            (Suggestions)
          </span>{" "}
          :
        </h1>
        <p className="md:text-xl flex gap-2 text-lg">
          Sort by :{" "}
          <span className="font-medium gap-2 flex">
            {selectedTag.length > 0 ? selectedTag : "All"}{" "}
            <img onMouseEnter={handleMouseEnter} src={icons.dropdown} />
          </span>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMouseLeave}
            MenuListProps={{
              onMouseLeave: handleMouseLeave,
            }}
          >
            <MenuItem onClick={() => handleSetSelectedTag("All")}>All</MenuItem>
            {options.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleSetSelectedTag(option)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </p>
      </section>
      <div className="max-md:hidden flex flex-wrap justify-center">
        {all &&
          filteredSuggestions.length > 0 &&
          filteredSuggestions.map((suggestion, index) => (
            <div key={suggestion.id}>
              <SuggestionCard
                deleteSuggestion={deleteSuggestion}
                index={index}
                suggestion={suggestion}
              />
            </div>
          ))}{" "}
        {all && filteredSuggestions.length === 0 && (
          <p className="text-brown font-semibold text-lg">
            No {selectedTag} Suggestions Found
          </p>
        )}
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.slice(0, 20).map((suggestion, index) => (
            <div key={suggestion.id}>
              <SuggestionCard
                deleteSuggestion={deleteSuggestion}
                index={index}
                suggestion={suggestion}
              />
            </div>
          ))
        ) : (
          <p className="text-brown font-semibold text-lg">
            No {selectedTag} Suggestions Found
          </p>
        )}
      </div>
      {filteredSuggestions.length > 20 && !all && (
        <section className="text-end p-3 px-6">
          <button className="bg-primary text-white text font-semibold px-5 py-1 rounded-full">
            <Link to={routes.allSuggestions}>More</Link>
          </button>
        </section>
      )}
    </div>
  );
}

export default AddedSuggestions;
