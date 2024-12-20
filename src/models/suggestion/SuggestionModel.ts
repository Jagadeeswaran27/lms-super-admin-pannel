export interface SuggestionModel {
  id: string;
  name: string;
  isApproved: boolean;
  image: string;
  isRejected: boolean;
  tag: string[];
  newTags?: string[];
  isVerified: boolean;
  registeredBy: string[];
  subSubjects?: SubSubjectModel[];
}

export interface SubSubjectModel {
  id: string;
  image: string;
  isApproved: boolean;
  isRejected: boolean;
  isVerified: boolean;
  name: string;
  registeredBy: string[];
}

export interface WithSubSubjectModel extends SubSubjectModel {
  subjectName: string;
  subjectId: string;
}
