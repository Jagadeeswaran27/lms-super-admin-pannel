import NewSuggestionForm from "./NewSuggestionForm";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import NewSuperCateoryForm from "./NewSuperCateoryForm";
import NewCategory from "./NewCategory";

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
          2. Add New Super Category
        </span>
      </p>
      <NewSuperCateoryForm addNewSuperCategory={addNewSuperCategory} />
      <p className="pt-3">
        <span className="bg-primary text-white p-2 rounded-r-full">
          3. Add New Category
        </span>
      </p>
      <NewCategory
        addNewCategory={addNewCategory}
        suggestionCategories={suggestionCategories}
      />
    </div>
  );
}

export default NewSuggestions;
