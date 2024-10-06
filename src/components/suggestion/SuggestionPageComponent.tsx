import Header from "../common/Header";
import SuggestionCard from "./SuggestionCard";
import { useState } from "react";
import SuggestionSidebar from "./SuggestionSidebar";

interface SuggestionPageComponentProps {
  logout: () => void;
}

function SuggestionPageComponent({ logout }: SuggestionPageComponentProps) {
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
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SuggestionPageComponent;
