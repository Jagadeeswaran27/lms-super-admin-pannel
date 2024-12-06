import { useContext, useEffect, useState } from "react";
import SubSubjectsMappingComponent from "../../components/sub-subjects-mapping/SubSubjectsMappingComponent";
import { logout } from "../../core/services/AuthService";
import { showSnackBar } from "../../utils/Snackbar";
import { SnackBarContext } from "../../store/SnackBarContext";
import { ThemeColors } from "../../resources/colors";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import {
  addNewSubSubject,
  getSuggestions,
  toggleIsVerified,
} from "../../core/services/SuggestionService";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../core/config/firebase";

function SubSubjectsMappingContainer() {
  const [_, dispatch] = useContext(SnackBarContext);
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  async function handleGetSuggestions() {
    const suggestions = await getSuggestions();

    setSuggestions(suggestions);
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
    suggestion: SuggestionModel,
    newChecked: boolean
  ) {
    const response = await toggleIsVerified(suggestion.id, newChecked);

    if (response) {
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map((sugg) =>
          sugg.id === suggestion.id ? { ...sugg, isVerified: newChecked } : sugg
        )
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

  async function handleLogout() {
    await logout();
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.success,
      message: "Logout successfull",
    });
  }

  return (
    <SubSubjectsMappingComponent
      toggleIsVerified={handleToggleIsVerfiied}
      suggestions={suggestions}
      addNewSubSubject={handleAddNewSubSubject}
      logout={handleLogout}
    />
  );
}

export default SubSubjectsMappingContainer;
