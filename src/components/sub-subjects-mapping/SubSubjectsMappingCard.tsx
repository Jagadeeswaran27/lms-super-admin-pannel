import { useContext, useState } from 'react';
import { SuggestionModel } from '../../models/suggestion/SuggestionModel';
import { Check, Close, Delete, Edit } from '@mui/icons-material';
import AIButton from '../suggestion/AIButton';
import IOSSwitch from '../common/IOSSwitch';
import { ThemeColors } from '../../resources/colors';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/config/firebase';
import NewSubSubjectsPopUp from './NewSubSubjectsPopUp';
import { showSnackBar } from '../../utils/Snackbar';
import { SnackBarContext } from '../../store/SnackBarContext';
interface SubSubjectsMappingCardProps {
  suggestion: SuggestionModel;
  addNewSubSubject: (
    suggestion: SuggestionModel,
    subSubject: string
  ) => Promise<boolean>;
  deleteSuggestions: (id: string) => void;
  deleteSubSubject: (id: string, docId: string) => void;
  toggleIsVerified: (suggestion: SuggestionModel, newChecked: boolean) => void;
}
function SubSubjectsMappingCard({
  suggestion,
  addNewSubSubject,
  deleteSuggestions,
  deleteSubSubject,
  toggleIsVerified,
}: SubSubjectsMappingCardProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newSubSubjects, setNewSubSubjects] = useState<string[]>([]);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);

  const handleToggleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    event.preventDefault();
    toggleIsVerified(suggestion, newChecked);
  };

  const handleGetModifiedSuggestion = async () => {
    setIsLoading(true);

    const suggestNewSubSubjects = httpsCallable(
      functions,
      'suggestNewSubSubjects'
    );
    try {
      const response = await suggestNewSubSubjects({
        subject: suggestion.name,
        existingSubSubjects: suggestion.subSubjects!.map((sub) => sub.name),
      });
      const data = response.data as {
        suggestions: string[];
      };
      if (data.suggestions.length > 0) {
        setNewSubSubjects(data.suggestions);
        setShowPopUp(true);
      }
    } catch (error) {
      console.error('Error fetching name suggestions:', error);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`bg-white ${
        isEdit ? 'border border-primary' : ''
      } rounded-md w-[80%] mx-auto my-3 flex relative gap-2 items-center shadow-custom px-2 py-5 lg:pl-5 max-lg:px-7 max-sm:px-2 `}
    >
      <div className="flex gap-3 max-w-[40%] min-w-[40%] items-center">
        <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
          <img
            className="w-full h-full rounded-full object-cover"
            src={suggestion.image}
            alt={`${suggestion.name} avatar`}
          />
        </div>
        <div className="rounded-full overflow-hidden">
          <p>{suggestion.name}</p>
        </div>
      </div>
      <div className="flex justify-between w-[60%] items-center gap-5">
        <div>
          <ul className="flex items-start flex-wrap gap-3">
            {suggestion.subSubjects &&
              suggestion.subSubjects.map((sub, _) => (
                <li
                  key={_}
                  className="bg-authPrimary text-sm text-center rounded-full px-2 py-[1px] text-white"
                >
                  {sub.name}
                  {isEdit && (
                    <Close
                      fontSize="small"
                      onClick={() => deleteSubSubject(sub.id, suggestion.id)}
                      className="cursor-pointer"
                    />
                  )}
                </li>
              ))}
          </ul>
          {showPopUp && (
            <NewSubSubjectsPopUp
              closePrompt={() => setShowPopUp(false)}
              addNewSubSubject={addNewSubSubject}
              existingSubSubjects={suggestion.subSubjects!.map(
                (sub) => sub.name
              )}
              newSubSubjects={newSubSubjects}
              suggestion={suggestion}
            />
          )}
          {!isEdit && (
            <div
              className={`${
                suggestion.isVerified ? 'opacity-0 invisible' : ''
              } w-[180px] mt-7`}
            >
              <AIButton
                isLoading={isLoading}
                text="AI"
                onClick={handleGetModifiedSuggestion}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <IOSSwitch
            checked={suggestion.isVerified}
            onChange={handleToggleChange}
          />
          {isEdit ? (
            <Check
              onClick={() => setIsEdit(false)}
              className=" mx-2 transition-all transform hover:scale-110"
              sx={{
                color: ThemeColors.brown,
                cursor: 'pointer',
              }}
            />
          ) : (
            <Edit
              onClick={suggestion.isVerified ? () => {} : () => setIsEdit(true)}
              className={`${
                suggestion.isVerified && 'opacity-0 invisible'
              } mx-2 transition-all transform hover:scale-110`}
              sx={{
                color: ThemeColors.brown,
                cursor: suggestion.isVerified ? 'default' : 'pointer',
              }}
            />
          )}
          <Delete
            onClick={
              suggestion.isVerified || suggestion.registeredBy.length > 0
                ? () => {
                    showSnackBar({
                      dispatch: dispatch,
                      color: ThemeColors.error,
                      message: 'Cannot delete suggestion',
                    });
                  }
                : () => deleteSuggestions(suggestion.id)
            }
            className={`${
              suggestion.isVerified && 'opacity-0 invisible'
            } transition-all transform hover:scale-110`}
            sx={{
              color: ThemeColors.brown,
              cursor: suggestion.isVerified ? 'default' : 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SubSubjectsMappingCard;
