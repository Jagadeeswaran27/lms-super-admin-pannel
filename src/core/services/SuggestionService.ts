import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { db } from "../config/firebase";

export async function getSuggestions(): Promise<SuggestionModel[] | []> {
  try {
    const suggestionsRef = collection(db, "suggestions");
    const querySnapshot = await getDocs(suggestionsRef);

    if (querySnapshot.empty) {
      return [];
    }

    const suggestions: SuggestionModel[] = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          isApproved: data.isApproved,
          image: data.image || "",
          isRejected: data.isRejected,
        };
      })
      .filter((suggestion) => !suggestion.isApproved && !suggestion.isRejected);

    return suggestions;
  } catch (e) {
    console.error("Error fetching suggestions:", e);
    return [];
  }
}

export async function approveSuggestion(id: string): Promise<boolean> {
  try {
    const suggestionRef = doc(db, "suggestions", id);
    await updateDoc(suggestionRef, { isApproved: true });
    return true;
  } catch (e) {
    console.error("Error approving suggestion:", e);
    return false;
  }
}

export async function rejectSuggestion(id: string): Promise<boolean> {
  try {
    const suggestionRef = doc(db, "suggestions", id);
    await updateDoc(suggestionRef, { isRejected: true });
    return true;
  } catch (e) {
    console.error("Error rejectings suggestion:", e);
    return false;
  }
}
