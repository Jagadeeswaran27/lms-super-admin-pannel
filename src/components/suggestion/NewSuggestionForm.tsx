import { useContext, useEffect, useRef, useState } from "react";
import InputField from "../common/InputField";
import { SelectChangeEvent } from "@mui/material";
import AIButton from "./AIButton";
import { images } from "../../resources/images";
import CustomDropDown from "../common/CustomDropDown";
import { options } from "../../utils/options";
import { icons } from "../../resources/icons";
import SuggestionNamePrompt from "./SuggestionNamePrompt";
import SuggestionImages from "./SuggestionImages";
import Success from "./Success";
// import { httpsCallable } from "firebase/functions";
// import { functions } from "../../core/config/firebase";
import { SnackBarContext } from "../../store/SnackBarContext";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";
import { Delete } from "@mui/icons-material";

interface NewSuggestionFormProps {
  name?: string;
  index?: number;
  addNewPromptItem?: (name: string) => void;
  addSuggestion: (
    suggestion: string,
    tag: string,
    image: File | null
  ) => Promise<boolean>;
  closeSuccessModal: (name: string) => void;
  deleteForm: () => void;
  showDeleteButton: boolean;
}

function NewSuggestionForm({
  name,
  index,
  addNewPromptItem,
  addSuggestion,
  closeSuccessModal,
  deleteForm,
  showDeleteButton,
}: NewSuggestionFormProps) {
  const [showNamePrompt, setShowNamePrompt] = useState<boolean>(false);
  const [showImageSuggestions, setShowImageSuggestions] =
    useState<boolean>(false);
  const [isImageDownloading, setIsImageDownloading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [showNameSuggestionButton, setShowNameSuggestionButton] =
    useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [_, dispatch] = useContext(SnackBarContext);
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (name) {
      setInputValue(name);
    }
  }, [name]);

  const disabled = inputValue.length === 0 || file === null || tag.length === 0;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length > 2) {
      setShowNameSuggestionButton(true);
    } else {
      setShowNameSuggestionButton(false);
    }
  };
  const handleTagChange = (e: SelectChangeEvent<string>) => {
    setTag(e.target.value);
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
    closeSuccessModal(inputValue);
    setTag("");
    setInputValue("");
    setFile(null);
    setShowNameSuggestionButton(false);
  }

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
      {showNamePrompt && (
        <SuggestionNamePrompt
          addNewPromptItem={addNewPromptItem ? addNewPromptItem : () => {}}
          closePrompt={() => setShowNamePrompt(false)}
        />
      )}
      {showImageSuggestions && (
        <SuggestionImages
          value={inputValue}
          downloadSelectedImage={handleDownloadSelectedImage}
          closePrompt={() => setShowImageSuggestions(false)}
        />
      )}
      {showSuccess && <Success closeModal={handleCloseSuccessModal} />}
      <h1 className="inline-block bg-primary mt-5 mb-2 py-2 px-4 text-white rounded-r-full">
        {index ? `${index.toString()}.` : "1."}
      </h1>
      <div className="flex items-end justify-evenly p-3">
        <form
          onSubmit={handleAddNewSuggestion}
          className="flex flex-grow xl:mx-10 lg:mx-4 mx-2 lg:p-3 p-1 shadow-custom rounded-xl bg-white"
        >
          <section className="flex-1 mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Name <span className="text-primary text-[10px]">(required)</span>{" "}
            </h2>
            <div className=" xl:w-[80%] w-[70%] ">
              <InputField
                value={inputValue}
                onChange={handleInputChange}
                name="name"
                placeholder="Name"
                type="text"
              />
            </div>
            <div
              className={`flex justify-end mt-2 ${
                showNameSuggestionButton
                  ? "opacity-100 transition-opacity duration-[1000ms]"
                  : "opacity-0"
              }`}
            >
              <div className={` w-[220px]`}>
                <div className="relative">
                  <AIButton
                    showButton={showNameSuggestionButton}
                    onClick={
                      showNameSuggestionButton
                        ? () => setShowNamePrompt(true)
                        : undefined
                    }
                    isLoading={false}
                    text="AI"
                  />
                  <img
                    className="absolute xl:-top-[50px] xl:-right-3 -top-[55px] -right-2"
                    src={images.quote}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="flex flex-col flex-1 justify-between mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Upload Icon{" "}
              <span className="text-primary text-[10px]">(required)</span>{" "}
            </h2>
            <div className="text-textBrown flex  items-center gap-2">
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
            <div className={`flex justify-end mt-2 `}>
              <div className="w-[220px]">
                <div className="relative">
                  <AIButton
                    showButton={true}
                    isLoading={isImageDownloading}
                    text={"AI"}
                    onClick={handleSetShowImageSuggestions}
                  />
                  <img
                    className="absolute xl:-top-[50px] xl:-right-3 -top-[55px] -right-2"
                    src={images.quote}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="flex-1 mx-4">
            <h2 className="text-textBrown md:text-xl text-lg max-sm:text-center pt-5 pb-3 font-medium">
              Tag <span className="text-primary text-[10px]">(categories)</span>{" "}
            </h2>
            <CustomDropDown
              value={tag}
              onChange={handleTagChange}
              items={options}
            />
          </section>
        </form>
        <div className="w-[10%] h-full my-5 flex flex-col gap-12">
          {showDeleteButton && (
            <button
              disabled={isLoading}
              onClick={deleteForm}
              className="bg-primary flex items-center justify-center gap-3 rounded-md text-white font-semibold p-3"
            >
              Delete
              <div className="bg-cardColor p-2 rounded-full">
                <Delete
                  sx={{
                    color: ThemeColors.primary,
                  }}
                />
              </div>
            </button>
          )}
          <button
            onClick={handleAddNewSuggestion}
            disabled={disabled || isLoading}
            className={`${
              disabled && "opacity-80"
            } bg-primary flex items-center justify-center gap-3 rounded-md text-white font-semibold p-3`}
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
