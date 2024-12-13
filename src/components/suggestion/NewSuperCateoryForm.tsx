import { useState,useContext } from "react";
import { icons } from "../../resources/icons";
import InputField from "../common/InputField";
import Success from "./Success";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";

interface NewSuperCateoryFormProps {
  addNewSuperCategory: (superCategory: string) => Promise<boolean>;
}

function NewSuperCateoryForm({
  addNewSuperCategory,
}: NewSuperCateoryFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);
  const [inputValue, setInputValue] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const disabled = inputValue.trim().length === 0;
  function handleCloseSuccessModal() {
    setShowSuccess(false);
    setInputValue("");
  }

  async function handleAddNewSuperCategory() {
    if(disabled){
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Please fill in all details",
      })
    }
    else{    
    setIsLoading(true);
    const response = await addNewSuperCategory(inputValue);
    if (response) {
      setShowSuccess(true);
    }
    setIsLoading(false);
  }
  }
  return (
    <div>
      {showSuccess && (
        <Success
          message="Super Category Added"
          closeModal={handleCloseSuccessModal}
        />
      )}

      <div className="flex items-end justify-evenly p-5">
        <form
          onSubmit={handleAddNewSuperCategory}
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
        </form>
        <div className="w-[10%] h-full my-5">
          <button
            onClick={handleAddNewSuperCategory}
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

export default NewSuperCateoryForm;
