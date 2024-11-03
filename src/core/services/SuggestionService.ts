import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  addDoc,
  or,
  and,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import { app, db } from "../config/firebase";
import { SuggestionCategoriesModel } from "../../models/suggestion/SuggestionCategoriesModel";

export async function getSuggestionCategories(): Promise<
  SuggestionCategoriesModel[] | []
> {
  try {
    const suggestionCategoriesRef = collection(db, "suggestion-hierarchy");
    const querySnapshot = await getDocs(suggestionCategoriesRef);

    if (querySnapshot.empty) {
      return [];
    }

    const suggestionCategories: SuggestionCategoriesModel[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const secondLevelCollectionRef = collection(
        db,
        `suggestion-hierarchy/${docSnapshot.id}/2nd Level`
      );
      const secondLevelCategories: string[] = [];
      const secondLevelSnapshot = await getDocs(secondLevelCollectionRef);

      secondLevelSnapshot.forEach((secondLevelDoc) => {
        secondLevelCategories.push(secondLevelDoc.id);
      });
      suggestionCategories.push({
        superCategory: {
          name: docSnapshot.id,
          secondLevelCategories: secondLevelCategories,
        },
      });
    }

    return suggestionCategories;
  } catch (e) {
    console.error("Error fetching suggestion categories:", e);
    return [];
  }
}

export async function modifySuggestion(
  suggestion: SuggestionModel
): Promise<boolean> {
  try {
    const suggestionRef = doc(db, "suggestions", suggestion.id);
    await updateDoc(suggestionRef, {
      tag: suggestion.tag,
      name: suggestion.name,
    });
    return true;
  } catch (e) {
    console.error("Error modifying suggestion:", e);
    return false;
  }
}

export async function addSuggestionCategory(
  superCategory: string,
  newCategory: string
): Promise<boolean> {
  try {
    const secondLevelCollectionRef = collection(
      db,
      `suggestion-hierarchy/${superCategory}/2nd Level`
    );
    const newCategoryDocRef = doc(secondLevelCollectionRef, newCategory);

    await setDoc(newCategoryDocRef, { name: newCategory });

    return true;
  } catch (e) {
    console.error("Error adding suggestion category:", e);
    return false;
  }
}
export async function addSuperCategory(
  superCategory: string
): Promise<boolean> {
  try {
    const suggestionCategoriesRef = collection(db, "suggestion-hierarchy");
    const newCategoryDocRef = doc(suggestionCategoriesRef, superCategory);

    await setDoc(newCategoryDocRef, { name: superCategory });

    return true;
  } catch (e) {
    console.error("Error adding suggestion category:", e);
    return false;
  }
}

export async function getSuggestions(): Promise<SuggestionModel[] | []> {
  try {
    const suggestionsRef = collection(db, "suggestions");
    const querySnapshot = await getDocs(suggestionsRef);
    if (querySnapshot.empty) {
      return [];
    }

    const suggestions: SuggestionModel[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        tag: data.tag,
        isApproved: data.isApproved,
        image: data.image || "",
        isRejected: data.isRejected,
      };
    });
    // .filter((suggestion) => !suggestion.isApproved && !suggestion.isRejected);
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
    console.error("Error rejecting suggestion:", e);
    return false;
  }
}

export async function deleteAdminSuggestion(id: string): Promise<boolean> {
  try {
    const suggestionRef = doc(db, "suggestions", id);
    await deleteDoc(suggestionRef);
    return true;
  } catch (e) {
    console.error("Error deleting suggestion:", e);
    return false;
  }
}

export async function addAdminSuggestion(
  suggestion: string,
  tag: string[],
  image?: File | null
): Promise<SuggestionModel | null> {
  if (suggestion === "" || image === null || image === undefined) {
    return null;
  }

  try {
    // Check if suggestion already exists
    const suggestionsRef = collection(db, "suggestions");
    const q = query(
      suggestionsRef,
      or(
        and(
          where("name", ">=", suggestion.toLowerCase()),
          where("name", "<=", suggestion.toLowerCase() + "\uf8ff")
        ),
        and(
          where("name", ">=", suggestion.toUpperCase()),
          where("name", "<=", suggestion.toUpperCase() + "\uf8ff")
        )
      )
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("Suggestion already exists");
      return null;
    }

    const storage = getStorage(app);
    const storageRef = ref(storage, `suggestions/${Date.now()}_${image.name}`);
    const uploadResult = await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    // Add new suggestion to Firestore
    const newSuggestion: SuggestionModel = {
      id: doc(suggestionsRef).id,
      name: suggestion,
      isApproved: true,
      isRejected: false,
      tag: tag,
      image: imageUrl,
    };

    await addDoc(suggestionsRef, newSuggestion);
    return newSuggestion;
  } catch (e) {
    console.error("Error adding suggestion:", e);
    return null;
  }
}
