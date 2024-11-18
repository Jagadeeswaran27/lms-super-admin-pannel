import { useState } from "react";
import Success from "./Success";
import InputField from "../common/InputField";
import CustomDropDown from "../common/CustomDropDown";
import { SelectChangeEvent } from "@mui/material";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { icons } from "../../resources/icons";

interface NewCategoryProps {
  suggestionCategories: SuggestionCategoriesModel[];
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
}

function NewCategory({
  suggestionCategories,
  addNewCategory,
}: NewCategoryProps) {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const disabled = inputValue.length === 0 || tag.length === 0;

  function handleCloseSuccessModal() {
    setShowSuccess(false);
    setTag("");
    setInputValue("");
  }

  async function handleAddNewCategory() {
    setIsLoading(true);
    const response = await addNewCategory(tag, inputValue);
    if (response) {
      setShowSuccess(true);
    }
    setIsLoading(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTagChange = (e: SelectChangeEvent<string>) => {
    setTag(e.target.value as string);
  };

  return (
    <div>
      {showSuccess && (
        <Success
          message="Category Added"
          closeModal={handleCloseSuccessModal}
        />
      )}

      <div className="flex items-end justify-evenly p-5">
        <form
          onSubmit={handleAddNewCategory}
          className="flex flex-grow xl:mx-10 lg:mx-4 mx-2 pb-5 p-1 shadow-custom rounded-xl bg-white"
        >
          <section className="flex-1 mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Name <span className="text-primary text-[10px]">(required)</span>{" "}
            </h2>
            <div>
              <InputField
                value={inputValue}
                onChange={handleInputChange}
                name="name"
                placeholder="Name"
                type="text"
              />
            </div>
          </section>

          <section className="flex-1 max-w-[40%] mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Tag <span className="text-primary text-[10px]">(categories)</span>{" "}
            </h2>
            <CustomDropDown
              value={tag}
              onChange={handleTagChange}
              items={suggestionCategories.map(
                (category) => category.superCategory.name
              )}
            />
          </section>
        </form>
        <div className="w-[10%] h-full my-5">
          <button
            onClick={handleAddNewCategory}
            disabled={disabled || isLoading}
            className={`${
              disabled && "opacity-80"
            } bg-primary flex items-center justify-center lg:gap-3 gap-1 rounded-md text-white font-semibold p-3`}
          >
            {isLoading ? "Adding..." : "Add"}
            <img src={icons.book} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewCategory;
