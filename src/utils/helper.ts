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
          // Identify new tags that are in the response but not in the suggestion
          const newTags = responseItem.tag.filter(
            (tag) => !suggestion.tag.includes(tag)
          );

          // Exclude new tags from responseItem.tag
          const updatedTags = responseItem.tag.filter(
            (tag) => !newTags.includes(tag)
          );

          acc.push({
            ...suggestion,
            tag: updatedTags, // Replace suggestion's tags with updated response tags
            newTags, // Add the new tags to the suggestion
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
