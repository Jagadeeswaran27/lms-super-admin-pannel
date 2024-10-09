import Header from "../common/Header";
import { useState } from "react";
import SuggestionSidebar from "./SuggestionSidebar";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import SuggestionLargeList from "../common/LazyLoadingList";

interface SuggestionPageComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
}

function SuggestionPageComponent({
  logout,
  suggestions,
  approveSuggestion,
  rejectSuggestion,
}: SuggestionPageComponentProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  function openDrawer() {
    setShowDrawer(true);
  }

  function closeDrawer() {
    setShowDrawer(false);
  }

  return (
    <div className="flex flex-col h-screen">
      <div
        onClick={closeDrawer}
        className={`sm:hidden fixed z-20 w-full h-full bg-[rgba(255,255,255,0.7)] transform transition-transform duration-300 ease-in-out ${
          showDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-[80%]" onClick={(e) => e.stopPropagation()}>
          <SuggestionSidebar closeDrawer={closeDrawer} logout={logout} />
        </div>
      </div>
      <Header openDrawer={openDrawer} logout={logout} />
      <section className="flex flex-1 overflow-hidden">
        <div className="max-sm:hidden h-full">
          <SuggestionSidebar closeDrawer={closeDrawer} logout={logout} />
        </div>
        <div className="flex-1 flex justify-center overflow-y-auto">
          <div className="w-[90%] ">
            {suggestions.length > 0 ? (
              <div className="h-full">
                <SuggestionLargeList
                  approveSuggestion={approveSuggestion}
                  rejectSuggestion={rejectSuggestion}
                  items={suggestions}
                />
              </div>
            ) : (
              <p className="flex flex-1 text-brown font-semibold md:text-xl text-base h-full items-center justify-center">
                No Suggestions Found
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SuggestionPageComponent;
