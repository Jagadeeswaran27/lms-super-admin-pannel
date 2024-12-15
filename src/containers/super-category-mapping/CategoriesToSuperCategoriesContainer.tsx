import { useContext, useEffect, useState } from 'react';
import { logout } from '../../core/services/AuthService';
import { showSnackBar } from '../../utils/Snackbar';
import { SnackBarContext } from '../../store/SnackBarContext';
import { ThemeColors } from '../../resources/colors';
import { SuggestionModel } from '../../models/suggestion/SuggestionModel';
import {
  addAdminSuggestion,
  addNewSuperCategoryByAI,
  addSuggestionCategory,
  addSuperCategory,
  deleteSingleCategory,
  deleteSuggestion as deleteSuggestionService,
  getSuggestionCategories,
  getSuggestions,
  modifySuggestion,
  modifySuggestionCategory,
  toggleCategoryIsVerified,
} from '../../core/services/SuggestionService';
import { SuggestionCategoriesModel } from '../../models/suggestion/SuggestionCategoriesModel';
import CategoriesToSuperCategoriesComponent from '../../components/super-category-mapping/CategoriesToSuperCategoriesComponent';

function CategoriesToSuperCategoriesContainer() {
  const [suggestions, setSuggestions] = useState<SuggestionModel[] | []>([]);
  const [suggestionCategories, setSuggestionCategories] = useState<
    SuggestionCategoriesModel[] | []
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    handleGetSuggestions();
    handleGetSuggestionCategories();
  }, []);

  async function handleGetSuggestions() {
    const suggestions = await getSuggestions();

    setSuggestions(suggestions);
  }

  async function handleModifySuggestion(
    suggestion: SuggestionModel
  ): Promise<boolean> {
    const response = await modifySuggestion(suggestion);
    if (response) {
      setSuggestions((prev) => {
        const updatedSuggestions = prev.map((suggestionItem) => {
          if (suggestionItem.id === suggestion.id) {
            return suggestion;
          }
          return suggestionItem;
        });
        return updatedSuggestions;
      });
    }
    return response;
  }

  async function handleLogout() {
    await logout();
    showSnackBar({
      dispatch: dispatch,
      color: ThemeColors.success,
      message: 'Logout successfull',
    });
  }

  async function handleGetSuggestionCategories() {
    const response = await getSuggestionCategories();
    setSuggestionCategories(response);
    setIsLoading(false);
  }

  async function handleAddNewCategory(
    superCategory: string,
    category: string
  ): Promise<boolean> {
    const response = await addSuggestionCategory(superCategory, category);
    setSuggestionCategories((prev) => {
      const updatedCategories = prev.map((categoryItem) => {
        if (categoryItem.superCategory.name === superCategory) {
          return {
            ...categoryItem,
            superCategory: {
              ...categoryItem.superCategory,
              secondLevelCategories: [
                ...categoryItem.superCategory.secondLevelCategories,
                { name: category, isVerified: false },
              ],
            },
          };
        }
        return categoryItem;
      });
      return updatedCategories;
    });
    return response;
  }
  async function handleAddNewSuperCategory(
    superCategory: string
  ): Promise<boolean> {
    const response = await addSuperCategory(superCategory);
    setSuggestionCategories((prev) => [
      ...prev,
      { superCategory: { name: superCategory, secondLevelCategories: [] } },
    ]);
    return response;
  }

  async function deleteSuggestion(id: string) {
    const response = await deleteSuggestionService(id);
    if (response) {
      setSuggestions((prev) => {
        const updatedSuggestions = prev.filter(
          (suggestion) => suggestion.id !== id
        );
        return updatedSuggestions;
      });
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: 'Suggestion deleted successfully',
      });
    }
  }

  async function handleToggleIsVerified(
    newChecked: boolean,
    superCat: string[],
    categoryName: string
  ) {
    const response = await toggleCategoryIsVerified(
      newChecked,
      superCat,
      categoryName
    );

    if (response) {
      setSuggestionCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.superCategory.name === superCat[0]
            ? {
                ...category,
                superCategory: {
                  ...category.superCategory,
                  secondLevelCategories:
                    category.superCategory.secondLevelCategories.map(
                      (secondLevel) =>
                        secondLevel.name === categoryName
                          ? { ...secondLevel, isVerified: newChecked }
                          : secondLevel
                    ),
                },
              }
            : category
        )
      );
    }
  }

  async function handleAddSuggestion(
    suggestionText: string,
    tag: string[],
    image: File | null
  ): Promise<boolean> {
    const response = await addAdminSuggestion(suggestionText ?? '', tag, image);
    if (response) {
      setSuggestions((pre) => [response, ...pre]);

      return true;
    }
    return false;
  }

  const deleteCategoryHandler = async (
    categoryName: string,
    parentSuperCategory: string[]
  ) => {
    const doesCategoryExists = suggestions.some((suggestion) =>
      suggestion.tag.includes(categoryName)
    );
    if (!doesCategoryExists) {
      const prms = await Promise.all(
        parentSuperCategory.map((superCategory) =>
          deleteSingleCategory(superCategory, categoryName)
        )
      );
      const response = prms.every((prm) => prm);
      if (response) {
        showSnackBar({
          dispatch: dispatch,
          color: ThemeColors.success,
          message: 'Category deleted successfully',
        });
        setSuggestionCategories((prev) =>
          prev.map((category) => {
            if (parentSuperCategory.includes(category.superCategory.name)) {
              return {
                ...category,
                superCategory: {
                  ...category.superCategory,
                  secondLevelCategories:
                    category.superCategory.secondLevelCategories.filter(
                      (secondLevel) =>
                        secondLevel.name.trim() !== categoryName.trim()
                    ),
                },
              };
            }
            return category;
          })
        );
      } else {
        showSnackBar({
          dispatch: dispatch,
          color: ThemeColors.error,
          message: 'Error deleting category',
        });
      }
    } else {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: 'Category is used in suggestions',
      });
    }
  };

  const handleModifySuperCategory = async (
    isNameModified: boolean,
    newName: string,
    addedSuperCategories: string[],
    removedSuperCategories: string[]
  ) => {
    // const response = await modifySuggestionCategory(
    //   isNameModified,
    //   newSuperCategories,
    //   oldSuperCategories,
    //   oldCategory,
    //   newCategory
    // );
    // if (response) {
    //   setSuggestionCategories((prev) =>
    //     prev.map((cat) =>
    //       newSuperCategories.includes(cat.superCategory.name)
    //         ? ({
    //             ...cat,
    //             superCategory: {
    //               ...cat.superCategory,
    //               secondLevelCategories: [
    //                 ...cat.superCategory.secondLevelCategories,
    //                 { name: newCategory, isVerified: false },
    //               ],
    //             },
    //           } as SuggestionCategoriesModel)
    //         : cat
    //     )
    //   );
    //   showSnackBar({
    //     dispatch,
    //     color: ThemeColors.success,
    //     message: "Category modified successfully",
    //   });
    // } else {
    //   showSnackBar({
    //     dispatch,
    //     color: ThemeColors.error,
    //     message: "Error modifying category",
    //   });
    // }
    return true;
  };

  const handleAddNewSuperCategoryByAI = async (
    superCategory: string,
    category: string
  ) => {
    const response = await addNewSuperCategoryByAI(superCategory, category);
    if (response) {
      setSuggestionCategories((prev) =>
        prev.map((cat) =>
          superCategory === cat.superCategory.name
            ? ({
                ...cat,
                superCategory: {
                  ...cat.superCategory,
                  secondLevelCategories: [
                    ...cat.superCategory.secondLevelCategories,
                    { name: category, isVerified: false },
                  ],
                },
              } as SuggestionCategoriesModel)
            : cat
        )
      );
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: 'Super category added successfully',
      });
    } else {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: 'Error adding super category',
      });
    }
    return response;
  };

  return (
    <CategoriesToSuperCategoriesComponent
      toggleIsVerified={handleToggleIsVerified}
      addNewSuperCategory={handleAddNewSuperCategory}
      modifySuggestion={handleModifySuggestion}
      suggestionCategories={suggestionCategories}
      deleteSuggestion={deleteSuggestion}
      addSuggestion={handleAddSuggestion}
      suggestions={suggestions}
      logout={handleLogout}
      addNewCategory={handleAddNewCategory}
      deleteCategory={deleteCategoryHandler}
      isLoading={isLoading}
      handleModifySuperCategory={handleModifySuperCategory}
      handleAddNewSuperCategoryByAI={handleAddNewSuperCategoryByAI}
    />
  );
}

export default CategoriesToSuperCategoriesContainer;
