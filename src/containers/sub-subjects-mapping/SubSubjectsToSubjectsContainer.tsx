import { useContext, useEffect, useState } from "react";
import SubSubjectsToSubjectsComponent from "../../components/sub-subjects-mapping/SubSubjectsToSubjectsComponent";
import { logout } from "../../core/services/AuthService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";
import {
  SuggestionModel,
  WithSubSubjectModel,
} from "../../models/suggestion/SuggestionModel";
import {
  addNewSubSubject,
  deleteSubSubject,
  getSuggestionCategories,
  getSuggestions,
  modifySubSubject,
  toggleIsVerifiedForSubjects,
} from "../../core/services/SuggestionService";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../core/config/firebase";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";

function SubSubjectsToSubjectsContainer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [suggestionCategories, setSuggestionCategories] = useState<
    SuggestionCategoriesModel[] | []
  >([]);

  useEffect(() => {
    handleGetSuggestions();
    handleGetSuggestionCategories();
  }, []);

  async function handleGetSuggestions() {
    const suggestions = await getSuggestions();
    setSuggestions(suggestions);
  }

  async function handleGetSuggestionCategories() {
    const response = await getSuggestionCategories();
    setSuggestionCategories(response);
    setIsLoading(false);
  }

  const handleDownloadSelectedImage = async (
    name: string,
    url: string
  ): Promise<File | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const fileName = `${name}.jpg`;
      const fileData = new File([blob], fileName, { type: blob.type });
      return fileData;
    } catch (e) {
      console.error("Error downloading image:", e);
      return null;
    }
  };

  const handleGetImageSuggestion = async (
    value: string
  ): Promise<File | null> => {
    const generateImages = httpsCallable(functions, "generateImages");
    try {
      const response = await generateImages({
        // prompt: `Design an engaging and visually appealing online course thumbnail. The image should feature abstract and minimalist symbols representing education, learning, and growth. Include elements like stylized books, lightbulbs, graduation caps, gears, or trees of knowledge, arranged into a cohesive, modern design. Use smooth gradients or contrasting color palettes to create a vibrant and welcoming tone. The overall style should communicate progress and intellectual development.Do not embed any text or course title in the image itself. Instead, place the word ${value} as separate text positioned directly below the image, ensuring clear separation between the graphic and the text content. The image should remain clean and focused on visuals without any embedded typography.`,
        prompt: `Help me to create an high quality image for an online course thumbnail.The image should feature abstract symbols or simplified icons representing education, learning, and growth, such as stylized books, lightbulbs, graduation caps, or gears I want you create course thumbnail for subject:${value}, Do not include subject name  in the image.`,
      });
      const data = response.data as {
        prompt: string;
        image: string;
        summary: string;
      };
      const downloadResponse = await handleDownloadSelectedImage(
        value,
        `data:image/png;base64,${data.image}`
      );
      return downloadResponse;
    } catch (error) {
      console.error("Error fetching name suggestions:", error);
      return null;
    }
  };

  async function handleToggleIsVerfiied(
    subSubject: WithSubSubjectModel,
    newChecked: boolean
  ) {
    const response = await toggleIsVerifiedForSubjects(
      subSubject.subjectId,
      subSubject.id,
      newChecked
    );
    if (response) {
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map((suggestion) => {
          if (suggestion.name === subSubject.subjectName) {
            return {
              ...suggestion,
              subSubjects: suggestion.subSubjects?.map((sub) =>
                sub.id === subSubject.id
                  ? { ...sub, isVerified: newChecked }
                  : sub
              ),
            };
          }
          return suggestion;
        })
      );
    }
  }

  async function handleAddNewSubSubject(
    suggestion: SuggestionModel,
    subSubject: string
  ): Promise<boolean> {
    const file = await handleGetImageSuggestion(subSubject);

    const newSubSubject = await addNewSubSubject(
      suggestion.id,
      subSubject,
      file
    );

    if (newSubSubject) {
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map((sugg) =>
          sugg.id === suggestion.id
            ? {
                ...sugg,
                subSubjects: sugg.subSubjects
                  ? [...sugg.subSubjects, newSubSubject]
                  : [newSubSubject],
              }
            : sugg
        )
      );
    }

    return true;
  }

  const deleteSubSubjectHandler = async (id: string, docId: string) => {
    const response = await deleteSubSubject(docId, id);
    if (response) {
      setSuggestions((prevSuggestions) => {
        const updatedSuggestions = prevSuggestions.map((suggestion) => {
          if (suggestion.id === id) {
            return {
              ...suggestion,
              subSubjects: (suggestion.subSubjects || []).filter(
                (subSubject) => subSubject.id !== docId
              ),
            };
          }
          return suggestion;
        });
        return updatedSuggestions;
      });
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Sub-subject deleted successfully",
      });
    } else {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Error deleting sub-subject",
      });
    }
  };

  async function handleLogout() {
    await logout();
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.success,
      message: "Logout successful",
    });
  }

  async function handleModifySubject(
    subSubject: WithSubSubjectModel,
    name: string
  ): Promise<boolean> {
    const response = await modifySubSubject(subSubject, name);
    if (response) {
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map((sugg) =>
          sugg.id === subSubject.subjectId
            ? {
                ...sugg,
                subSubjects: sugg.subSubjects?.map((sub) =>
                  sub.id === subSubject.id ? { ...sub, name: name } : sub
                ),
              }
            : sugg
        )
      );
    }
    return response;
  }

  return (
    <SubSubjectsToSubjectsComponent
      toggleIsVerified={handleToggleIsVerfiied}
      suggestions={suggestions}
      isLoading={isLoading}
      suggestionCategories={suggestionCategories}
      addNewSubSubject={handleAddNewSubSubject}
      logout={handleLogout}
      deleteSubSubject={deleteSubSubjectHandler}
      handleModifySubject={handleModifySubject}
    />
  );
}

export default SubSubjectsToSubjectsContainer;
