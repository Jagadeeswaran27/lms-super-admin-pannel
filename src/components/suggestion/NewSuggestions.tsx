import NewSuggestionForm from "./NewSuggestionForm";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";

interface NewSuggestionsProps {
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
}

function NewSuggestions({
  addSuggestion,
  suggestionCategories,
}: NewSuggestionsProps) {
  return (
    <div className="bg-cardColor my-5 w-[95%] mx-auto rounded-xl shadow-custom">
      <NewSuggestionForm
        suggestionCategories={suggestionCategories}
        addSuggestion={addSuggestion}
      />
    </div>
  );
}

export default NewSuggestions;
