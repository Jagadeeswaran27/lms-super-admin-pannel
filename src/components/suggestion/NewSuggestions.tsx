import NewSuggestionForm from "./NewSuggestionForm";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import NewSuperCateoryForm from "./NewSuperCateoryForm";
import NewCategory from "./NewCategory";
import { icons } from "../../resources/icons";
import { Link } from "react-router-dom";
import { routes } from "../../utils/Routes";

interface NewSuggestionsProps {
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
  addNewSuperCategory: (superCategory: string) => Promise<boolean>;
}

function NewSuggestions({
  addSuggestion,
  addNewCategory,
  addNewSuperCategory,
  suggestionCategories,
}: NewSuggestionsProps) {
  return (
    <div>
      <div className="my-3 mt-5 flex items-center pl-5 gap-2">
        <Link to={routes.suggestions} className="flex gap-1 items-center">
          <img
            src={icons.back}
            alt=""
            width={30}
            height={30}
            className="cursor-pointer"
          />
          <p className="text-brown font-medium text-2xl cursor-pointer">Back</p>
        </Link>
      </div>

      <div className="bg-cardColor my-5 w-[95%] mx-auto rounded-xl shadow-custom">
        <p className="pt-3">
          <span className="bg-primary text-white p-2 rounded-r-full">
            1. Add New Suggestion
          </span>
        </p>
        <NewSuggestionForm
          suggestionCategories={suggestionCategories}
          addSuggestion={addSuggestion}
        />
        <p className="pt-3">
          <span className="bg-primary text-white p-2 rounded-r-full">
            2. Add New Category
          </span>
          <NewCategory
            addNewCategory={addNewCategory}
            suggestionCategories={suggestionCategories}
          />
        </p>
        <p className="pt-3">
          <span className="bg-primary text-white p-2 rounded-r-full">
            3. Add New Super Category
          </span>
        </p>
        <NewSuperCateoryForm addNewSuperCategory={addNewSuperCategory} />
      </div>
    </div>
  );
}

export default NewSuggestions;
