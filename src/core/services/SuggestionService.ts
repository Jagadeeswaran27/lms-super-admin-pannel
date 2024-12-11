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
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import {
  SubSubjectModel,
  SuggestionModel,
  WithSubSubjectModel,
} from '../../models/suggestion/SuggestionModel';
import { app, db } from '../config/firebase';
import { SuggestionCategoriesModel } from '../../models/suggestion/SuggestionCategoriesModel';

export async function getSuggestionCategories(): Promise<
  SuggestionCategoriesModel[] | []
> {
  try {
    const suggestionCategoriesRef = collection(db, 'suggestion-hierarchy');
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
      const secondLevelCategories: { name: string; isVerified: boolean }[] = [];
      const secondLevelSnapshot = await getDocs(secondLevelCollectionRef);

      secondLevelSnapshot.forEach((secondLevelDoc) => {
        secondLevelCategories.push({
          name: secondLevelDoc.id,
          isVerified: secondLevelDoc.data().isVerified,
        });
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
    console.error('Error fetching suggestion categories:', e);
    return [];
  }
}

export async function modifySuggestion(
  suggestion: SuggestionModel
): Promise<boolean> {
  try {
    const suggestionRef = doc(db, 'suggestions', suggestion.id);
    await updateDoc(suggestionRef, {
      tag: suggestion.tag,
      name: suggestion.name,
    });
    return true;
  } catch (e) {
    console.error('Error modifying suggestion:', e);
    return false;
  }
}

export async function modifySubSubject(
  subSubject: WithSubSubjectModel,
  name: string
): Promise<boolean> {
  try {
    const subSubjectRef = doc(
      db,
      'suggestions',
      subSubject.subjectId,
      'sub-subjects',
      subSubject.id
    );
    await updateDoc(subSubjectRef, { name: name });
    return true;
  } catch (e) {
    console.error('Error modifying subject:', e);
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
    console.error('Error adding suggestion category:', e);
    return false;
  }
}
export async function addSuperCategory(
  superCategory: string
): Promise<boolean> {
  try {
    const suggestionCategoriesRef = collection(db, 'suggestion-hierarchy');
    const newCategoryDocRef = doc(suggestionCategoriesRef, superCategory);

    await setDoc(newCategoryDocRef, { name: superCategory });

    return true;
  } catch (e) {
    console.error('Error adding suggestion category:', e);
    return false;
  }
}

export async function modifySuggestionCategory(
  isNameModified: boolean,
  newSuperCategories: string[],
  oldSuperCategories: string[],
  oldCategory: string,
  newCategory: string
): Promise<boolean> {
  if (isNameModified) {
    try {
      for (const superCategory of newSuperCategories) {
        const oldCategoryRef = doc(
          db,
          'suggestion-hierarchy',
          superCategory,
          '2nd Level',
          oldCategory
        );

        await deleteDoc(oldCategoryRef);

        const newCategoryRef = doc(
          db,
          'suggestion-hierarchy',
          superCategory,
          '2nd Level',
          newCategory
        );

        await setDoc(newCategoryRef, { name: newCategory, isVerified: false });
      }
      for (const superCategory of oldSuperCategories) {
        const categoryRef = doc(
          db,
          'suggestion-hierarchy',
          superCategory,
          '2nd Level',
          oldCategory
        );
        await deleteDoc(categoryRef);
      }

      return true;
    } catch (e) {
      console.error('Error modifying suggestion category:', e);
      return false;
    }
  }
  if (!isNameModified) {
    try {
      for (const superCategory of newSuperCategories) {
        const newCategoryRef = doc(
          db,
          'suggestion-hierarchy',
          superCategory,
          '2nd Level',
          newCategory
        );

        await setDoc(newCategoryRef, { name: newCategory, isVerified: false });
      }
      for (const superCategory of oldSuperCategories) {
        const categoryRef = doc(
          db,
          'suggestion-hierarchy',
          superCategory,
          '2nd Level',
          oldCategory
        );
        await deleteDoc(categoryRef);
      }

      return true;
    } catch (e) {
      console.error('Error modifying suggestion category:', e);
      return false;
    }
  } else {
    return false;
  }
}

export async function deleteCategory(
  category: string,
  superCategories: string[]
): Promise<boolean> {
  let allSuccessful = true;

  for (const superCategory of superCategories) {
    try {
      const categoryRef = doc(
        db,
        'suggestion-hierarchy',
        superCategory,
        '2nd Level',
        category
      );
      await deleteDoc(categoryRef);
      console.log(`Successfully deleted from ${superCategory}`);
    } catch (e) {
      console.error(`Error deleting from ${superCategory}:`, e);
      allSuccessful = false;
      // Continue with the loop instead of stopping
    }
  }

  return allSuccessful;
}

export async function deleteSingleCategory(
  superCategory: string,
  category: string
): Promise<boolean> {
  try {
    const categoryRef = doc(
      db,
      'suggestion-hierarchy',
      superCategory,
      '2nd Level',
      category
    );
    await deleteDoc(categoryRef);
    return true;
  } catch (e) {
    console.error('Error deleting single category:', e);
    return false;
  }
}

export async function getSuggestions(): Promise<SuggestionModel[] | []> {
  try {
    const suggestionsRef = collection(db, 'suggestions');
    const querySnapshot = await getDocs(suggestionsRef);

    if (querySnapshot.empty) {
      return [];
    }

    const suggestions: SuggestionModel[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Fetch sub-subjects collection for the current suggestion
        const subSubjectsRef = collection(doc.ref, 'sub-subjects');
        const subSubjectsSnapshot = await getDocs(subSubjectsRef);
        const subSubjects = subSubjectsSnapshot.docs.map((subDoc) => {
          const subData = subDoc.data();
          return {
            id: subDoc.id,
            name: subData.name,
            image: subData.image || '',
            isApproved: subData.isApproved,
            isRejected: subData.isRejected,
            isVerified: subData.isVerified || false,
            registeredBy: subData.registeredBy || [],
          };
        });

        return {
          id: doc.id,
          name: data.name,
          tag: data.tag,
          isApproved: data.isApproved,
          image: data.image || '',
          isRejected: data.isRejected,
          isVerified: data.isVerified || false,
          subSubjects: subSubjects,
          registeredBy: data.registeredBy || [],
        };
      })
    );

    return suggestions;
  } catch (e) {
    console.error('Error fetching suggestions:', e);
    return [];
  }
}

export async function addNewSubSubject(
  suggestionId: string,
  subSubject: string,
  image?: File | null
): Promise<SubSubjectModel | null> {
  if (!subSubject.trim() || !image) {
    return null;
  }
  try {
    const storage = getStorage(app);
    const storageRef = ref(storage, `suggestions/${Date.now()}_${image.name}`);
    const uploadResult = await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    const suggestionRef = doc(db, 'suggestions', suggestionId);
    const subSubjectRef = collection(suggestionRef, 'sub-subjects');

    const newSubSubject: SubSubjectModel = {
      id: '',
      name: subSubject,
      image: imageUrl,
      isApproved: true,
      isRejected: false,
      isVerified: false,
    };
    const addedDoc = await addDoc(subSubjectRef, newSubSubject);

    await updateDoc(addedDoc, { id: addedDoc.id });
    newSubSubject.id = addedDoc.id;
    return newSubSubject;
  } catch (e) {
    console.error('Error adding new sub-subject:', e);
    return null;
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

// export async function deleteAdminSuggestion(id: string): Promise<boolean> {
//   try {
//     const suggestionRef = doc(db, 'suggestions', id);
//     await deleteDoc(suggestionRef);
//     return true;
//   } catch (e) {
//     console.error('Error deleting suggestion:', e);
//     return false;
//   }
// }

export async function addAdminSuggestion(
  suggestion: string,
  tag: string[],
  image?: File | null
): Promise<SuggestionModel | null> {
  if (suggestion === '' || image === null || image === undefined) {
    return null;
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
      console.error('Suggestion already exists');
      return null;
    }

    const storage = getStorage(app);
    const storageRef = ref(storage, `suggestions/${Date.now()}_${image.name}`);
    const uploadResult = await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    // Add new suggestion to Firestore
    const newSuggestion: SuggestionModel = {
      id: '',
      name: suggestion,
      isApproved: true,
      isRejected: false,
      tag: tag,
      image: imageUrl,
      isVerified: false,
      registeredBy: [],
    };

    const docRef = await addDoc(suggestionsRef, newSuggestion);
    await updateDoc(docRef, { id: docRef.id });
    newSuggestion.id = docRef.id;
    return newSuggestion;
  } catch (e) {
    console.error('Error adding suggestion:', e);
    return null;
  }
}

export async function toggleIsVerified(
  id: string,
  isVerified: boolean
): Promise<boolean> {
  try {
    const suggestionRef = doc(db, 'suggestions', id);
    await updateDoc(suggestionRef, { isVerified: isVerified });
    return true;
  } catch (e) {
    console.error('Error verifying suggestion:', e);
    return false;
  }
}

export async function toggleCategoryIsVerified(
  isVerified: boolean,
  superCategories: string[],
  category: string
): Promise<boolean> {
  try {
    for (const superCategory of superCategories) {
      const categoryRef = doc(
        db,
        'suggestion-hierarchy',
        superCategory,
        '2nd Level',
        category
      );
      await updateDoc(categoryRef, { isVerified: isVerified });
    }
    return true;
  } catch (e) {
    console.error('Error verifying category:', e);
    return false;
  }
}

export async function deleteSuggestion(id: string): Promise<boolean> {
  try {
    const suggestionRef = doc(db, 'suggestions', id);
    await deleteDoc(suggestionRef);
    return true;
  } catch (e) {
    console.error('Error deleting suggestion:', e);
    return false;
  }
}

export async function deleteSubSubject(
  id: string,
  docId: string
): Promise<boolean> {
  try {
    const subSubjectRef = doc(db, 'suggestions', docId, 'sub-subjects', id);
    await deleteDoc(subSubjectRef);
    return true;
  } catch (e) {
    console.error('Error deleting sub-subject:', e);
    return false;
  }
}

export async function toggleIsVerifiedForSubjects(
  subjectId: string,
  subSubjectId: string,
  isVerified: boolean
): Promise<boolean> {
  try {
    const subSubjectRef = doc(
      db,
      'suggestions',
      subjectId,
      'sub-subjects',
      subSubjectId
    );

    await updateDoc(subSubjectRef, { isVerified: isVerified });
    return true;
  } catch (e) {
    console.error('Error toggling sub-subject verification:', e);
    return false;
  }
}
