import { useContext, useRef, useState } from "react";
import Success from "./Success";
import InputField from "../common/InputField";
import CustomDropDown from "../common/CustomDropDown";
import { SelectChangeEvent } from "@mui/material";
import { icons } from "../../resources/icons";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import AIButton from "./AIButton";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";
import { SnackBarContext } from "../../store/SnackBarContext";
import ImageSuggestions from "./ImageSuggestions";

interface NewSubSubjectFormProps {
  suggestions: SuggestionModel[];
  addNewCategory: (superCategory: string, category: string) => Promise<boolean>;
  addNewSubSubject: (
    suggestion: SuggestionModel,
    subSubject: string,
    file: File
  ) => Promise<boolean>;
}

function NewSubSubjectForm({
  suggestions,
  addNewSubSubject,
}: NewSubSubjectFormProps) {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showImageSuggestions, setShowImageSuggestions] =
    useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);
  const [isImageDownloading, setIsImageDownloading] = useState<boolean>(false);

  const disabled =
    inputValue.trim().length === 0 && file === null && tag.length === 0;

  function handleCloseSuccessModal() {
    setShowSuccess(false);
    setTag("");
    setInputValue("");
    setFile(null);
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  async function handleAddNewCategory() {
    let text: string = "";
    if (disabled) {
      text = "Please fill in all details";
    } else if (inputValue.trim().length != 0  && tag.length === 0 && !file) {
      text = "Please select a subject and upload an image";
    } else if (!file && tag.length == 0 && inputValue.trim().length === 0) {
      text = "Please select a subject and enter a name";
    } else if (tag.length != 0 && inputValue.trim().length === 0 && !file) {
      text = "Please select a image and enter a name";
    } else if (inputValue.trim().length === 0) {
      text = "Please fill in the name";
    } else if (file===null) {
      text = "Please upload an image";
    } else if (tag.length === 0) {
      text = "Please select a subject";
    } else {
      const suggestion = suggestions.find((sugg) => sugg.name === tag);
      if (!suggestion || !file) {
        return;
      }
      setIsLoading(true);
      const response = await addNewSubSubject(suggestion, inputValue, file);
      if (response) {
        setShowSuccess(true);
      }
      setIsLoading(false);
    }
    if (text.length != 0) {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: text,
      });
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTagChange = (e: SelectChangeEvent<string>) => {
    setTag(e.target.value as string);
  };

  function handleSetShowImageSuggestions() {
    if (inputValue.trim().length === 0) {
      showSnackBar({
        color: ThemeColors.error,
        dispatch: dispatch,
        message: "Type your course name!",
      });
      return;
    }
    setShowImageSuggestions(true);
  }

  const handleDownloadSelectedImage = async (url: string) => {
    setIsImageDownloading(true);
    setShowImageSuggestions(false);
    // const fetchImage = httpsCallable(functions, "fetchImage");

    try {
      // const result = await fetchImage({ imageUrl: url });

      // const base64String = (result.data as { image: string }).image;
      const response = await fetch(url);
      const blob = await response.blob();

      const fileName = `${inputValue}.jpg`;
      const fileData = new File([blob], fileName, { type: blob.type });

      setFile(fileData);
    } catch (e) {
      console.error("Error downloading image:", e);
    }
    setIsImageDownloading(false);
  };

  return (
    <div>
      {showSuccess && (
        <Success
          message="Category Added"
          closeModal={handleCloseSuccessModal}
        />
      )}
      {showImageSuggestions && (
        <ImageSuggestions
          value={inputValue}
          downloadSelectedImage={handleDownloadSelectedImage}
          closePrompt={() => setShowImageSuggestions(false)}
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
          <section className="flex flex-col flex-1 justify-around mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Upload Icon{" "}
              <span className="text-primary text-[10px]">(required)</span>{" "}
            </h2>
            <div className="text-textBrown items-center flex flex-col gap-2">
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
              <p>Or</p>
              <div className="w-[60%] mx-auto">
                <AIButton
                  showButton={true}
                  isLoading={isImageDownloading}
                  text={"AI"}
                  onClick={handleSetShowImageSuggestions}
                />
              </div>
            </div>
          </section>

          <section className="flex-1 max-w-[40%] mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Subjects{" "}
              <span className="text-primary text-[10px]"></span>{" "}
            </h2>
            <CustomDropDown
              text="Select An Subject"
              value={tag}
              onChange={handleTagChange}
              items={suggestions
                .map((sugg) => sugg.name)
                .sort((a, b) => a.localeCompare(b))}
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
            <img src={icons.book} alt="book" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewSubSubjectForm;
