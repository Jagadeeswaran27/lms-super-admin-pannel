import { useRef, useState } from "react";
import InputField from "../common/InputField";
import { SelectChangeEvent } from "@mui/material";
import Success from "./Success";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";
import { icons } from "../../resources/icons";
import MultipleCustomDropDown from "../common/MultipleCustomDropDown";

interface NewSuggestionFormProps {
  addSuggestion: (
    suggestion: string,
    tag: string[],
    image: File | null
  ) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
}

function NewSuggestionForm({
  addSuggestion,
  suggestionCategories,
}: NewSuggestionFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState<string[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  const disabled = inputValue.length === 0 || file === null || tag.length === 0;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleTagChange = (e: SelectChangeEvent<string[]>) => {
    setTag(e.target.value as string[]);
  };

  async function handleAddNewSuggestion() {
    setIsLoading(true);
    const response = await addSuggestion(inputValue, tag, file);
    if (response) {
      setShowSuccess(true);
    }
    setIsLoading(false);
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  function handleCloseSuccessModal() {
    setShowSuccess(false);
    setTag([]);
    setInputValue("");
    setFile(null);
  }

  return (
    <div>
      {showSuccess && (
        <Success
          message="Suggestion Added"
          closeModal={handleCloseSuccessModal}
        />
      )}

      <div className="flex items-end justify-evenly p-5">
        <form
          onSubmit={handleAddNewSuggestion}
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
          <section className="flex flex-col flex-1 justify-around mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Upload Icon{" "}
              <span className="text-primary text-[10px]">(required)</span>{" "}
            </h2>
            <div className="text-textBrown flex justify-center  items-center gap-2">
              <h1 className="font-medium text-sm xl:text-base">File</h1>
              <div className="border-primary border-2 rounded-lg">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <p
                  onClick={() => fileRef.current?.click()}
                  className="bg-primary cursor-pointer text-sm xl:text-base text-white my-[1px] mx-[0.9px] px-1 rounded-md"
                >
                  Choose Files
                </p>
              </div>
              <h1 className="text-primary text-sm xl:text-base">
                {file ? "1 File Chosen" : "0 File"}
              </h1>
            </div>
          </section>
          <section className="flex-1 max-w-[40%] mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Tag <span className="text-primary text-[10px]">(categories)</span>{" "}
            </h2>
            <MultipleCustomDropDown
              value={tag}
              onChange={handleTagChange}
              items={suggestionCategories
                .map((category) => category.superCategory.secondLevelCategories)
                .flat()}
            />
          </section>
        </form>
        <div className="w-[10%] h-full my-5">
          <button
            onClick={handleAddNewSuggestion}
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

export default NewSuggestionForm;
