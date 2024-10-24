import { useContext, useState } from "react";
import NewSuggestionForm from "./NewSuggestionForm";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";

interface NewSuggestionsProps {
  addSuggestion: (
    suggestion: string,
    tag: string,
    image: File | null
  ) => Promise<boolean>;
}

function NewSuggestions({ addSuggestion }: NewSuggestionsProps) {
  const [promptItems, setPromptItems] = useState<string[]>([]);

  const [_, dispatch] = useContext(SnackBarContext);

  function handleAddNewPromptItem(name: string) {
    setPromptItems((pre) => {
      if (pre.includes(name)) {
        showSnackBar({
          color: ThemeColors.error,
          dispatch: dispatch,
          message: "Already Added",
        });
        return pre;
      }
      return [...pre, name];
    });
  }

  function handleDeleteForm(index: number) {
    setPromptItems((pre) => {
      return pre.filter((_, i) => i !== index);
    });
  }

  function handleCloseSuccessModal(name: string) {
    setPromptItems((pre) => {
      return pre.filter((item) => item !== name);
    });
  }

  return (
    <div className="bg-cardColor my-5 w-[95%] mx-auto rounded-xl shadow-custom">
      <NewSuggestionForm
        showDeleteButton={promptItems.length > 1 ? true : false}
        deleteForm={() => handleDeleteForm(0)}
        closeSuccessModal={handleCloseSuccessModal}
        addSuggestion={addSuggestion}
        name={promptItems.length > 0 ? promptItems[0] : ""}
        addNewPromptItem={handleAddNewPromptItem}
      />
      {promptItems.length > 1 &&
        promptItems.slice(1).map((item, index) => (
          <div key={index}>
            <NewSuggestionForm
              showDeleteButton={promptItems.length > 1 ? true : false}
              deleteForm={() => handleDeleteForm(index + 1)}
              closeSuccessModal={handleCloseSuccessModal}
              addNewPromptItem={handleAddNewPromptItem}
              addSuggestion={addSuggestion}
              index={index + 2}
              name={item}
            />
          </div>
        ))}
    </div>
  );
}

export default NewSuggestions;
