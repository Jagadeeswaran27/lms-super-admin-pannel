import { useState } from "react";
import NewSuggestions from "../suggestion/NewSuggestions";
import Header from "../common/Header";
import Drawer from "../suggestion/Drawer";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { routes } from "../../utils/Routes";
import { Link } from "react-router-dom";

interface ManualSuggestionProps {
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  logout: () => void;
  suggestionCategories: SuggestionCategoriesModel[];
}

function ManualSuggestion({
  addSuggestion,
  suggestionCategories,
  logout,
}: ManualSuggestionProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  function openDrawer() {
    setShowDrawer(true);
  }

  function closeDrawer() {
    setShowDrawer(false);
  }
  return (
    <div>
      <Drawer
        closeDrawer={closeDrawer}
        logout={logout}
        showDrawer={showDrawer}
      />

      <Header openDrawer={openDrawer} logout={logout} />
      <h1 className="text-right my-2 mt-4 text-textBrown text-lg font-semibold px-3 lg:px-10">
        <Link to={routes.suggestions} className="hover:underline">
          View Suggestions
        </Link>
      </h1>
      <NewSuggestions
        suggestionCategories={suggestionCategories}
        addSuggestion={addSuggestion}
      />
    </div>
  );
}

export default ManualSuggestion;
