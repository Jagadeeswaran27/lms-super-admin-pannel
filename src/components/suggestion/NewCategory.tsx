import { useState,useContext } from "react";
import Success from "./Success";
import InputField from "../common/InputField";
import CustomDropDown from "../common/CustomDropDown";
import { SelectChangeEvent } from "@mui/material";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { icons } from "../../resources/icons";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";

interface NewCategoryProps {
  suggestionCategories: SuggestionCategoriesModel[];
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
}

function NewCategory({
  suggestionCategories,
  addNewCategory,
}: NewCategoryProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const disabled = inputValue.length === 0 && tag.length === 0;

  function handleCloseSuccessModal() {
    setShowSuccess(false);
    setTag("");
    setInputValue("");
  }

  async function handleAddNewCategory() {
    let text: string = "";
    if (disabled) {
      text = "Please fill in all details";
    } else if (inputValue.trim().length != 0  && tag.length === 0) {
      text = "Please select a super category";
    }  else if (tag.length != 0 && inputValue.trim().length === 0 ) {
      text = "Please enter a name";
    } 
    else{
    setIsLoading(true);
    const response = await addNewCategory(tag, inputValue);
    if (response) {
      setShowSuccess(true);
    }
    setIsLoading(false);
  }
  if(text.length != 0){
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.error,
      message: text,
    })
  }
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
            Super Categories <span className="text-primary text-[10px]"></span>{" "}
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
            disabled={isLoading}
            className={`${
              isLoading && "opacity-80"
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
