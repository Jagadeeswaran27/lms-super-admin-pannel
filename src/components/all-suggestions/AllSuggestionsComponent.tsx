import { useState } from "react";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import Drawer from "../suggestion/Drawer";
import Header from "../common/Header";
import AddedSuggestions from "../suggestion/AddedSuggestions";

interface AllSuggestionsComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  deleteSuggestion: (id: string) => void;
}

function AllSuggestionsComponent({
  deleteSuggestion,
  logout,
  suggestions,
}: AllSuggestionsComponentProps) {
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

      <section>
        <div className=" mx-auto">
          {suggestions.length > 0 ? (
            <AddedSuggestions
              all={true}
              deleteSuggestion={deleteSuggestion}
              suggestions={suggestions}
            />
          ) : (
            <p className="flex flex-1 text-brown font-semibold md:text-xl text-base h-full items-center justify-center">
              No Suggestions Found
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AllSuggestionsComponent;
