import { SuggestionCategoriesModel } from "../models/suggestion/SuggestionCategoriesModel";
import { SuggestionModel } from "../models/suggestion/SuggestionModel";

export function filterSuggestion(
  suggestions: SuggestionModel[],
  response: { name: string; tag: string[] }[]
): SuggestionModel[] {
  const filteredSuggestions: SuggestionModel[] = suggestions.reduce(
    (acc, suggestion) => {
      const responseItem = response.find((res) => res.name === suggestion.name);

      if (responseItem) {
        const hasMatchingTags = responseItem.tag.every((tag) =>
          suggestion.tag.includes(tag)
        );

        if (!hasMatchingTags) {
          const newTags = responseItem.tag.filter(
            (tag) => !suggestion.tag.includes(tag)
          );

          const updatedTags = responseItem.tag.filter(
            (tag) => !newTags.includes(tag)
          );

          acc.push({
            ...suggestion,
            tag: updatedTags,
            newTags,
          });
        }
      } else {
        acc.push(suggestion);
      }

      return acc;
    },
    [] as SuggestionModel[]
  );

  return filteredSuggestions;
}

export function filterCategories(
  existingCategories: SuggestionCategoriesModel[],
  newCategories: { superCategory: string }[]
): { superCategory: string }[] {
  return newCategories.filter(
    (category) =>
      !existingCategories.some(
        (existing) => existing.superCategory.name === category.superCategory
      )
  );
}

export function findSuperCategory(
  categories: SuggestionCategoriesModel[],
  secondLevelCategory: string
): string {
  const res = categories.find((category) => {
    return category.superCategory.secondLevelCategories
      .map((cat) => cat.name.trim())
      .includes(secondLevelCategory.trim());
  });
  return res ? `${res.superCategory.name} : ${secondLevelCategory}` : "";
}

export default function refactorSuggestionCategories(
  suggestionCategories: SuggestionCategoriesModel[]
): { category: string; isVerified: boolean; superCategories: string[] }[] {
  const secondLevelCategories: { name: string; isVerified: boolean }[] = [];
  suggestionCategories.forEach((cat) =>
    cat.superCategory.secondLevelCategories.forEach((secondCat) => {
      secondLevelCategories.push({
        name: secondCat.name.trim(),
        isVerified: secondCat.isVerified,
      });
    })
  );

  const uniqueSecondLevelCategories = secondLevelCategories.filter(
    (category, index, self) =>
      index ===
      self.findIndex(
        (cat) =>
          cat.name === category.name && cat.isVerified === category.isVerified
      )
  );

  const refactoredCategories = uniqueSecondLevelCategories.map((sec) => {
    const foundSuperCategories = suggestionCategories
      .filter((cat) =>
        cat.superCategory.secondLevelCategories.some(
          (secondCat) => secondCat.name.trim() === sec.name
        )
      )
      .map((cat) => cat.superCategory.name);

    return {
      category: sec.name,
      isVerified: sec.isVerified,
      superCategories: foundSuperCategories,
    };
  });

  return refactoredCategories;
}
