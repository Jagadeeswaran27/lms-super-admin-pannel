import { Close } from "@mui/icons-material";
import AIButton from "./AIButton";
import { useState } from "react";

interface NewSuperCategoriesPopUpProps {
  closePrompt: () => void;
  newSuperCategories: string[];
  modifySuperCategory: (
    category: string,
    superCategory: string
  ) => Promise<boolean>;
  category: string;
}

function NewSuperCategoriesPopUp({
  closePrompt,
  newSuperCategories,
  category,
  modifySuperCategory,
}: NewSuperCategoriesPopUpProps) {
  const [cat, setCat] = useState<string[]>(newSuperCategories);
  return (
    <div
      onClick={closePrompt}
      className="fixed  z-10 w-screen fade-in h-screen top-0 left-0 bg-[rgba(255,255,255,0.7)] flex justify-center items-center"
    >
      <div className="flex w-full h-full justify-center items-center">
        <section
          className="w-[60%] h-[50%] mx-auto rounded-2xl shadow-primary overflow-y-scroll bg-white "
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "fadeInUp 0.3s ease-in",
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
          }}
        >
          <div className="flex justify-between items-center shadow-custom py-3 px-5">
            <div className="w-[220px]">
              <AIButton isLoading={false} text="AI" />
            </div>
            <Close
              fontSize="large"
              className="cursor-pointer"
              onClick={closePrompt}
            />
          </div>
          <div className="p-3">
            <div className="w-[80%] mx-auto mt-10">
              {cat.length > 0 ? (
                cat.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between my-5 w-[80%] mx-auto"
                  >
                    <p className="text-lg min-w-[250px] max-w-[250px] font-semibold text-textBrown">
                      {cat}
                    </p>

                    <button
                      onClick={async () => {
                        const response = await modifySuperCategory(
                          category,
                          cat
                        );
                        if (response) {
                          setCat((prev) => prev.filter((c) => c !== cat));
                        }
                      }}
                      className="bg-primary text-lg xl:text-base text-white mx-[0.9px] px-7 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-lg font-semibold  text-textBrown">
                  No New Categories Found
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NewSuperCategoriesPopUp;
