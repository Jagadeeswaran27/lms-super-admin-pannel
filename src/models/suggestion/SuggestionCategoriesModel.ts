export interface SuggestionCategoriesModel {
  superCategory: {
    name: string;
    secondLevelCategories: {
      name: string;
      isVerified: boolean;
    }[];
  };
}
