import { useState, MouseEvent } from 'react';
import Drawer from '../suggestion/Drawer';
import Header from '../common/Header';
import {
  SuggestionModel,
  WithSubSubjectModel,
} from '../../models/suggestion/SuggestionModel';
import SubSubjectMappingCard from './SubSubjectMappingCard';
import { Link } from 'react-router-dom';
import { routes } from '../../utils/Routes';
import { icons } from '../../resources/icons';
import { ThemeColors } from '../../resources/colors';
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Menu,
  MenuItem,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { SuggestionCategoriesModel } from '../../models/suggestion/SuggestionCategoriesModel';

interface SubSubjectsMappingComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  isLoading: boolean;
  addNewSubSubject: (
    suggestion: SuggestionModel,
    subSubject: string
  ) => Promise<boolean>;
  handleModifySubject: (
    subSubject: WithSubSubjectModel,
    name: string
  ) => Promise<boolean>;
  suggestionCategories: SuggestionCategoriesModel[];
  deleteSubSubject: (id: string, docId: string) => void;
  toggleIsVerified: (
    subSubject: WithSubSubjectModel,
    newChecked: boolean
  ) => void;
}

function SubSubjectsMappingComponent({
  logout,
  suggestions,
  isLoading,
  suggestionCategories,
  addNewSubSubject,
  toggleIsVerified,
  deleteSubSubject,
  handleModifySubject,
}: SubSubjectsMappingComponentProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [unverifiedChecked, setUnverifiedChecked] = useState<boolean>(false);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [anchorEl3, setAnchorEl3] = useState<null | HTMLElement>(null);
  const [selectedSuperCategory, setSelectedSuperCategory] =
    useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string[]>(['All']);
  const [setOperation, setSetOperation] = useState<string | null>(null);

  const handleMouseEnter1 = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleMouseLeave1 = () => {
    setAnchorEl1(null);
  };

  const handleMouseEnter2 = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleMouseEnter3 = (event: MouseEvent<HTMLImageElement>) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleSetSelectedTag1 = (tag: string) => {
    setSelectedSuperCategory(tag);
    setSelectedCategory('All');
    setSelectedSubject(['All']);
  };

  const handleSetSelectedTag2 = (tag: string) => {
    setSelectedCategory(tag);
    setSelectedSubject(['All']);
  };

  const handleSetSelectedTag3 = (tag: string) => {
    if (tag === 'All') {
      setSelectedSubject(['All']);
    } else {
      setSelectedSubject((prevTags) => {
        const newTags = prevTags.includes('All')
          ? [tag]
          : prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag)
          : [...prevTags, tag];
        return newTags.length ? newTags : ['All'];
      });
    }
  };

  const handleMouseLeave2 = () => {
    setAnchorEl2(null);
  };

  const handleMouseLeave3 = () => {
    setAnchorEl3(null);
  };

  function openDrawer() {
    setShowDrawer(true);
  }

  function closeDrawer() {
    setShowDrawer(false);
  }

  const handleToggleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    setChecked(newChecked);
    setUnverifiedChecked(false);
  };

  const handleUnverifiedToggleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ) => {
    setUnverifiedChecked(newChecked);
    setChecked(false);
  };

  const getFilteredSubSubjects = (): WithSubSubjectModel[] => {
    let filteredSuggestions: SuggestionModel[] = JSON.parse(
      JSON.stringify(suggestions)
    );

    if (selectedSuperCategory !== 'All') {
      const possibleCategories = suggestionCategories.find(
        (cat) => cat.superCategory.name === selectedSuperCategory
      )?.superCategory.secondLevelCategories;
      const possibleCategoriesNames = possibleCategories?.map(
        (cat) => cat.name
      );

      filteredSuggestions = suggestions.filter((sugg) =>
        sugg.tag.some((tag) => possibleCategoriesNames?.includes(tag))
      );
    }

    if (selectedCategory !== 'All') {
      filteredSuggestions = suggestions.filter((sugg) =>
        sugg.tag.includes(selectedCategory)
      );
    }

    if (selectedSubject.length > 0 && !selectedSubject.includes('All')) {
      filteredSuggestions = filteredSuggestions.filter((sugg) =>
        selectedSubject.includes(sugg.name)
      );
    }
    if (setOperation) {
      const allSubjects = new Set(
        suggestions
          .filter((sugg) => sugg.tag.includes(selectedCategory))
          .map((sugg) => sugg.name)
      );
      filteredSuggestions = filteredSuggestions.filter((sugg) => {
        const suggestionTagSet = new Set([sugg.name]);
        const selectedTagSet = selectedSubject.includes('All')
          ? allSubjects
          : new Set(selectedSubject);

        switch (setOperation) {
          case 'intersection':
            return [...selectedTagSet].every((tag) =>
              suggestionTagSet.has(tag)
            );

          case 'union':
            return [...selectedTagSet].some((tag) => suggestionTagSet.has(tag));

          case 'difference':
            return [...suggestionTagSet].some(
              (tag) => !selectedTagSet.has(tag)
            );

          default:
            return false;
        }
      });
    }

    return filteredSuggestions.flatMap((suggestion) => {
      const subSubjects = suggestion.subSubjects || [];
      const filteredSubSubjects = checked
        ? subSubjects.filter((sub) => sub.isVerified)
        : unverifiedChecked
        ? subSubjects.filter((sub) => !sub.isVerified)
        : subSubjects;

      return filteredSubSubjects.map((subSubject) => ({
        ...subSubject,
        subjectName: suggestion.name,
        subjectId: suggestion.id,
      }));
    });
  };

  const filteredSubSubjects = getFilteredSubSubjects();

  return (
    <div>
      <Drawer
        closeDrawer={closeDrawer}
        logout={logout}
        showDrawer={showDrawer}
      />
      <Header openDrawer={openDrawer} logout={logout} />
      <div>
        {isLoading ? (
          <div className="mx-auto">
            <div className="flex items-center justify-center h-screen">
              <CircularProgress
                sx={{
                  color: ThemeColors.authPrimary,
                  size: 50,
                  animationDuration: '1s',
                  animationTimingFunction: 'ease-in-out',
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <section className="flex items-center justify-end px-10 my-4">
              <div className="flex items-center gap-5">
                <div className="flex gap-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={setOperation === 'difference'}
                        onChange={(e) =>
                          setSetOperation(
                            e.target.checked ? 'difference' : null
                          )
                        }
                        style={{ color: ThemeColors.primary }}
                      />
                    }
                    label="Difference"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={setOperation === 'intersection'}
                        onChange={(e) =>
                          setSetOperation(
                            e.target.checked ? 'intersection' : null
                          )
                        }
                        style={{ color: ThemeColors.primary }}
                      />
                    }
                    label="Intersection"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={setOperation === 'union'}
                        onChange={(e) =>
                          setSetOperation(e.target.checked ? 'union' : null)
                        }
                        style={{ color: ThemeColors.primary }}
                      />
                    }
                    label="Union"
                  />
                </div>
              </div>
            </section>
            <section className="flex items-start justify-between px-10 my-4 mt-8">
              <div className="flex items-center gap-4">
                <Link to={routes.subjectsToCategories}>
                  <img
                    src={icons.back}
                    alt=""
                    width={30}
                    height={30}
                    className="cursor-pointer"
                  />
                </Link>
                <h1 className="text-textBrown md:text-3xl text-2xl max-sm:text-center font-medium">
                  Already Added{' '}
                  <span className="text-primary md:text-base text-sm">
                    (Sub Subject Mapping)
                  </span>
                  :
                </h1>
              </div>
              <div>
                <div className="flex items-center gap-5">
                  <p className="md:text-xl flex text-textBrown gap-2 text-base lg:text-lg">
                    <span className="font-semibold">Sort by</span>Super
                    Category:{' '}
                    <span className="font-medium gap-2 flex">
                      {selectedSuperCategory}
                      <img
                        onClick={handleMouseEnter1}
                        className="cursor-pointer"
                        src={icons.dropdown}
                        alt="dropdown"
                      />
                    </span>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl1}
                      open={Boolean(anchorEl1)}
                      onClose={handleMouseLeave1}
                      className="max-h-[600px]"
                    >
                      <MenuItem
                        onClick={() => {
                          handleMouseLeave1();
                          handleSetSelectedTag1('All');
                        }}
                      >
                        All
                      </MenuItem>
                      {suggestionCategories.map((supCat) => (
                        <MenuItem
                          key={supCat.superCategory.name}
                          className="flex justify-between"
                          onClick={() => {
                            handleMouseLeave1();
                            handleSetSelectedTag1(supCat.superCategory.name);
                          }}
                        >
                          <p>{supCat.superCategory.name}</p>
                        </MenuItem>
                      ))}
                    </Menu>
                  </p>
                  <p className="md:text-xl text-textBrown flex gap-2 text-lg">
                    Category:
                    <span className="font-medium gap-2 flex">
                      {selectedCategory}
                      <img
                        onClick={handleMouseEnter2}
                        className="cursor-pointer"
                        src={icons.dropdown}
                        alt="dropdown"
                      />
                    </span>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl2}
                      open={Boolean(anchorEl2)}
                      onClose={handleMouseLeave2}
                      className="max-h-[600px]"
                    >
                      <MenuItem
                        onClick={() => {
                          handleMouseLeave2();
                          handleSetSelectedTag2('All');
                        }}
                      >
                        All
                      </MenuItem>
                      {suggestionCategories
                        .find(
                          (cat) =>
                            cat.superCategory.name === selectedSuperCategory
                        )
                        ?.superCategory.secondLevelCategories.map((cat) => (
                          <MenuItem
                            key={cat.name}
                            className="flex justify-between"
                            onClick={() => {
                              handleMouseLeave2();
                              handleSetSelectedTag2(cat.name);
                            }}
                          >
                            <p>{cat.name}</p>
                          </MenuItem>
                        ))}
                    </Menu>
                  </p>
                  <p className="md:text-xl text-textBrown flex gap-2 text-lg">
                    Subject:
                    <span className="font-medium gap-2 flex">
                      {selectedSubject.includes('All') ? 'All' : 'Multiple'}
                      <img
                        onClick={handleMouseEnter3}
                        className="cursor-pointer"
                        src={icons.dropdown}
                        alt="dropdown"
                      />
                    </span>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl3}
                      open={Boolean(anchorEl3)}
                      onClose={handleMouseLeave3}
                      className="max-h-[600px]"
                    >
                      <MenuItem onClick={() => handleSetSelectedTag3('All')}>
                        All
                      </MenuItem>
                      {suggestions
                        .filter((sugg) => sugg.tag.includes(selectedCategory))
                        .map((sugg) => (
                          <MenuItem
                            key={sugg.id}
                            onClick={() => handleSetSelectedTag3(sugg.name)}
                          >
                            <p>{sugg.name}</p>
                            {selectedSubject.includes(sugg.name) && <Check />}
                          </MenuItem>
                        ))}
                    </Menu>
                  </p>
                </div>
                <div className="flex mt-8 justify-end">
                  <div className="mr-20 flex items-center">
                    <Checkbox
                      checked={checked}
                      onChange={handleToggleChange}
                      style={{ color: ThemeColors.primary }}
                    />
                    <span className="text-textBrown text-lg font-semibold ml-2">
                      Show Verified
                    </span>
                  </div>
                  <div className="mr-20 flex items-center">
                    <Checkbox
                      checked={unverifiedChecked}
                      onChange={handleUnverifiedToggleChange}
                      style={{ color: ThemeColors.primary }}
                    />
                    <span className="text-textBrown text-lg font-semibold ml-2">
                      Show Unverified
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className="mx-auto">
                {filteredSubSubjects.length > 0 ? (
                  filteredSubSubjects.map((subject) => (
                    <div key={subject.id}>
                      <SubSubjectMappingCard
                        toggleIsVerified={toggleIsVerified}
                        addNewSubSubject={addNewSubSubject}
                        modifyName={handleModifySubject}
                        subSubject={subject}
                        deleteSubSubject={deleteSubSubject}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <p className="text-textBrown text-lg font-semibold">
                      No sub-subjects found
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default SubSubjectsMappingComponent;
