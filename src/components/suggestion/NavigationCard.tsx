import React from 'react';
import { routes } from '../../utils/Routes';
import { Link } from 'react-router-dom';

const NavigationCard: React.FC = (): JSX.Element => {
  return (
    <div className="bg-cardColor flex flex-col p-3 justify-evenly h-[250px] shadow-custom rounded-xl mb-6">
      <h1 className="text-textBrown font-semibold text-xl">Navigation</h1>
      <div className="flex flex-col gap-4 items-left">
        <Link
          to={routes.suggestionManual}
          className="border-textBrown text-authPrimary font-normal text-base px-4 rounded-full"
        >
          Add Manual Suggestion
        </Link>
        <Link
          to={routes.categoriesToSuperCategories}
          className="border-textBrown text-authPrimary font-normal text-base px-4 rounded-full"
        >
          Super Category Mapping
        </Link>
        <Link
          to={routes.subjectsToCategories}
          className="border-textBrown text-authPrimary font-normal text-base px-4 rounded-full"
        >
          Subjects Mapping
        </Link>
        <Link
          to={routes.subSubjectsToSubjects}
          className="border-textBrown text-authPrimary font-normal text-base px-4 rounded-full"
        >
          Sub Subject Mapping
        </Link>
      </div>
    </div>
  );
};

export default NavigationCard;
