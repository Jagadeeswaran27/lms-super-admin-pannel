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
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { SuggestionModel } from '../../models/suggestion/SuggestionModel';
import { app, db } from '../config/firebase';

export async function getSuggestions(): Promise<SuggestionModel[] | []> {
  try {
    const suggestionsRef = collection(db, 'suggestions');
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
          image: data.image || '',
          isRejected: data.isRejected,
        };
      })
      .filter((suggestion) => !suggestion.isApproved && !suggestion.isRejected);

    return suggestions;
  } catch (e) {
    console.error('Error fetching suggestions:', e);
    return [];
  }
}

export async function approveSuggestion(id: string): Promise<boolean> {
  try {
    const suggestionRef = doc(db, 'suggestions', id);
    await updateDoc(suggestionRef, { isApproved: true });
    return true;
  } catch (e) {
    console.error('Error approving suggestion:', e);
    return false;
  }
}

export async function rejectSuggestion(id: string): Promise<boolean> {
  try {
    const suggestionRef = doc(db, 'suggestions', id);
    await updateDoc(suggestionRef, { isRejected: true });
    return true;
  } catch (e) {
    console.error('Error rejecting suggestion:', e);
    return false;
  }
}

export async function addAdminSuggestion(
  suggestion: string,
  image?: File | null,
): Promise<boolean> {
  if (suggestion === '' || image === null || image === undefined) {
    return false;
  }

  try {
    // Check if suggestion already exists
    const suggestionsRef = collection(db, 'suggestions');
    const q = query(
      suggestionsRef,
      or(
        and(
          where('name', '>=', suggestion.toLowerCase()),
          where('name', '<=', suggestion.toLowerCase() + '\uf8ff')
        ),
        and(
          where('name', '>=', suggestion.toUpperCase()),
          where('name', '<=', suggestion.toUpperCase() + '\uf8ff')
        )
      )
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('Suggestion already exists');
      return false;
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
      image: imageUrl,
    };

    await addDoc(suggestionsRef, newSuggestion);
    return true;
  } catch (e) {
    console.error('Error adding suggestion:', e);
    return false;
  }
}
