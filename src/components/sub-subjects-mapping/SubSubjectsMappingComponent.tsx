import { useEffect, useState } from "react";
import Drawer from "../suggestion/Drawer";
import Header from "../common/Header";
import { SuggestionModel } from "../../models/suggestion/SuggestionModel";
import SubSubjectsMappingCard from "./SubSubjectsMappingCard";
import { Link } from "react-router-dom";
import { routes } from "../../utils/Routes";
import { icons } from "../../resources/icons";
import { Checkbox } from "@mui/material";
import { ThemeColors } from "../../resources/colors";

interface SubSubjectsMappingComponentProps {
  logout: () => void;
  suggestions: SuggestionModel[] | [];
  addNewSubSubject: (
    suggestion: SuggestionModel,
    subSubject: string
  ) => Promise<boolean>;
  toggleIsVerified: (suggestion: SuggestionModel, newChecked: boolean) => void;
}

function SubSubjectsMappingComponent({
  logout,
  suggestions,
  addNewSubSubject,
  toggleIsVerified,
}: SubSubjectsMappingComponentProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    SuggestionModel[] | []
  >(suggestions);

  useEffect(() => {
    setFilteredSuggestions(suggestions);
  }, [suggestions]);

  useEffect(() => {
    if (checked) {
      setFilteredSuggestions(suggestions.filter((sugg) => sugg.isVerified));
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [checked]);

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
  };

  return (
    <div>
      <Drawer
        closeDrawer={closeDrawer}
        logout={logout}
        showDrawer={showDrawer}
      />

      <Header openDrawer={openDrawer} logout={logout} />

      <section className="flex items-center justify-between px-10 my-4">
        <div className="flex items-center gap-4">
          <Link to={routes.suggestions}>
            <img
              src={icons.back}
              alt=""
              width={30}
              height={30}
              className="cursor-pointer"
            />
          </Link>
          <h1 className="text-textBrown md:text-3xl text-2xl max-sm:text-center font-medium">
            Already Added{" "}
            <span className="text-primary md:text-base text-sm">
              (Sub Subject Mapping)
            </span>
            :
          </h1>
        </div>
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
      </section>

      <section>
        <div className="mx-auto">
          {filteredSuggestions.length > 0 &&
            filteredSuggestions.map((sugg) => (
              <div key={sugg.id}>
                <SubSubjectsMappingCard
                  toggleIsVerified={toggleIsVerified}
                  addNewSubSubject={addNewSubSubject}
                  suggestion={sugg}
                />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default SubSubjectsMappingComponent;
