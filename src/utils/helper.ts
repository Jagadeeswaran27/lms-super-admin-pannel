import { SuggestionModel } from "../models/suggestion/SuggestionModel";

export function filterSuggestion(
  suggestions: SuggestionModel[],
  response: { name: string; tag: string[] }[]
): SuggestionModel[] {
  const filteredSuggestions: SuggestionModel[] = suggestions.reduce(
    (acc, suggestion) => {
      const responseItem = response.find((res) => res.name === suggestion.name);

      // If there is a corresponding response item
      if (responseItem) {
        // Check if the suggestion's tags include all response tags
        const hasMatchingTags = responseItem.tag.every((tag) =>
          suggestion.tag.includes(tag)
        );

        // If tags do not match, include it with response tags
        if (!hasMatchingTags) {
          acc.push({
            ...suggestion,
            tag: responseItem.tag, // Replace suggestion's tags with response tags
          });
        }
      } else {
        // If no corresponding response item, include the suggestion without changes
        acc.push(suggestion);
      }

      return acc;
    },
    [] as SuggestionModel[]
  );

  return filteredSuggestions;
}
