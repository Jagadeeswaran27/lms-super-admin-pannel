import { Close } from "@mui/icons-material";
import AIButton from "./AIButton";
import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../core/config/firebase";
import { icons } from "../../resources/icons";

interface SuggestionImagesProps {
  closePrompt: () => void;
  downloadSelectedImage: (url: string) => void;
  value: string;
}
interface ImageGenerationResponse {
  prompt: string;
  imageUrls: string[];
  summary: string;
}
function SuggestionImages({
  closePrompt,
  downloadSelectedImage,
  value,
}: SuggestionImagesProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    handleGetImageSuggestions();
  }, []);
  function handleDonwnloadSelectedImage(url: string) {
    downloadSelectedImage(url);
  }
  const handleGetImageSuggestions = async () => {
    setIsLoading(true);
    const imageSuggestion = httpsCallable(functions, "generateImages");
    try {
      const response = await imageSuggestion({
        prompt: `Create a vibrant and engaging thumbnail for a ${value} online course. Include elements like a laptop displaying code, HTML/CSS symbols, and bright colors to attract learners. The design should be modern and appealing, with a clean layout. The background should be subtle to enhance the main elements.`,
      });
      const data = response.data as ImageGenerationResponse;
      setGeneratedImages(data.imageUrls);
    } catch (error) {
      console.error("Error fetching image suggestions:", error);
    }
    setIsLoading(false);
  };
  return (
    <div
      onClick={closePrompt}
      className="fixed z-10 w-screen fade-in h-screen top-0 left-0 bg-[rgba(255,255,255,0.7)] flex justify-center items-center"
    >
      <div className="flex w-full h-full justify-center items-center">
        <section
          className="w-[60%] h-[75%] mx-auto rounded-2xl shadow-primary lg:pb-6 pb-10 bg-white "
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "fadeInUp 0.3s ease-in" }}
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
            <h1 className="text-secondary my-3 text-lg font-semibold">
              Image{" "}
              <span className="text-textBrown font-thin text-xs">(Add)</span>
            </h1>
          </div>
          <article
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent",
            }}
            className={`overflow-y-auto border border-primary rounded-[35px] min-w-[80%]  max-w-[80%] mx-auto p-10 min-h-[70%] max-h-[70%] grid ${
              isLoading ? "grid-cols-1" : "grid-cols-2"
            }  gap-10 place-items-center`}
          >
            {isLoading ? (
              <p className="text-brown text-lg font-semibold">
                Generating Images...
              </p>
            ) : (
              generatedImages.map((book, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center gap-5"
                >
                  <img src={book} width={150} height={150} />
                  <section>
                    <button
                      onClick={() => handleDonwnloadSelectedImage(book)}
                      className={`bg-primary relative flex items-center justify-center rounded-full text-xs px-7 text-white p-1`}
                    >
                      Add Img
                      <img src={icons.plus} className="absolute right-1" />
                    </button>
                  </section>
                </div>
              ))
            )}
          </article>
        </section>
      </div>
    </div>
  );
}

export default SuggestionImages;
