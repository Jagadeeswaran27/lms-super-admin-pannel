import { useContext, useState, useRef } from 'react';
import {
  SuggestionModel,
  WithSubSubjectModel,
} from '../../models/suggestion/SuggestionModel';
import { Check, Delete, Edit } from '@mui/icons-material';
import IOSSwitch from '../common/IOSSwitch';
import { ThemeColors } from '../../resources/colors';
import { showSnackBar } from '../../utils/Snackbar';
import { SnackBarContext } from '../../store/SnackBarContext';
interface SubSubjectsMappingCardProps {
  subSubject: WithSubSubjectModel;
  modifyName: (
    subSubject: WithSubSubjectModel,
    name: string
  ) => Promise<boolean>;
  addNewSubSubject: (
    suggestion: SuggestionModel,
    subSubject: string
  ) => Promise<boolean>;
  deleteSubSubject: (id: string, docId: string) => void;
  toggleIsVerified: (
    subSubject: WithSubSubjectModel,
    newChecked: boolean
  ) => void;
}
function SubSubjectMappingCard({
  subSubject,
  modifyName,
  deleteSubSubject,
  toggleIsVerified,
}: SubSubjectsMappingCardProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [newSubSubjects, setNewSubSubjects] = useState<string[]>([]);
  //   const [showPopUp, setShowPopUp] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch] = useContext(SnackBarContext);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleToggleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    event.preventDefault();
    toggleIsVerified(subSubject, newChecked);
  };

  const handleModifySubSubject = async () => {
    const name = nameRef.current?.value.trim();

    if (name?.length === 0) {
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: 'Name cannot be empty',
      });
      setIsEdit(false);
      return;
    }

    const response = await modifyName(subSubject, name!);
    if (response) {
      setIsEdit(false);
      showSnackBar({
        dispatch,
        color: ThemeColors.success,
        message: 'Name modified successfully',
      });
    } else {
      setIsEdit(false);
      showSnackBar({
        dispatch,
        color: ThemeColors.error,
        message: 'Failed to modify name',
      });
    }
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
            src={subSubject.image}
            alt={`${subSubject.name} avatar`}
          />
        </div>
        {isEdit ? (
          <div className="rounded-lg overflow-hidden">
            <input
              ref={nameRef}
              className={`focus:border-none text-textBrown px-2 focus:outline-none text-lg bg-cardColor px-1 rounded-sm`}
              defaultValue={subSubject.name}
            />
          </div>
        ) : (
          <p className="text-lg pt-1 text-textBrown">{subSubject.name}</p>
        )}
      </div>
      <div className="flex justify-between w-[60%] items-center gap-5">
        <div>
          <ul className="flex items-start flex-wrap gap-3">
            <li
              key={_}
              className="bg-authPrimary text-sm text-center rounded-full px-2 py-[1px] text-white"
            >
              {subSubject.subjectName}
              {/* {isEdit && (
                <Close
                  fontSize="small"
                  onClick={() => deleteSubSubject(sub.id, suggestion.id)}
                  className="cursor-pointer"
                />
              )} */}
            </li>
          </ul>
          {/* {showPopUp && (
            <NewSubSubjectsPopUp
              closePrompt={() => setShowPopUp(false)}
              addNewSubSubject={addNewSubSubject}
              existingSubSubjects={suggestion.subSubjects!.map(
                (sub) => sub.name
              )}
              newSubSubjects={newSubSubjects}
              suggestion={suggestion}
            />
          )} */}
          {/* {!isEdit && (
            <div
              className={`${
                subSubject.isVerified ? 'opacity-0 invisible' : ''
              } w-[180px] mt-7`}
            >
              <AIButton
                isLoading={isLoading}
                text="AI"
                onClick={handleGetModifiedSuggestion}
              />
            </div>
          )} */}
        </div>
        <div className="flex gap-2 items-center">
          <IOSSwitch
            checked={subSubject.isVerified}
            onChange={handleToggleChange}
          />
          {isEdit ? (
            <Check
              onClick={handleModifySubSubject}
              className=" mx-2 transition-all transform hover:scale-110"
              sx={{
                color: ThemeColors.brown,
                cursor: 'pointer',
              }}
            />
          ) : (
            <Edit
              onClick={subSubject.isVerified ? () => {} : () => setIsEdit(true)}
              className={`${
                subSubject.isVerified && 'opacity-0 invisible'
              } mx-2 transition-all transform hover:scale-110`}
              sx={{
                color: ThemeColors.brown,
                cursor: subSubject.isVerified ? 'default' : 'pointer',
              }}
            />
          )}
          <Delete
            onClick={
              subSubject.isVerified || subSubject.registeredBy.length > 0
                ? () => {
                    showSnackBar({
                      dispatch: dispatch,
                      color: ThemeColors.error,
                      message: 'Cannot delete suggestion',
                    });
                  }
                : () => {
                    deleteSubSubject(subSubject.subjectId, subSubject.id);
                }
            }
            className={`${
              subSubject.isVerified && 'opacity-0 invisible'
            } transition-all transform hover:scale-110`}
            sx={{
              color: ThemeColors.brown,
              cursor: subSubject.isVerified ? 'default' : 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SubSubjectMappingCard;
