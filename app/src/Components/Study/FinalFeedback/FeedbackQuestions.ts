export type FeedbackComponentType = "Question" | "Section Header";

export type FeedbackQuestionStructure = {
  type: FeedbackComponentType;
  id: number;
  question: string;
  lowText: string;
  highText: string;
};

export type SectionHeader = {
  type: FeedbackComponentType;
  header: string;
};

export type FeedbackStructure = (FeedbackQuestionStructure | SectionHeader)[];

export const Questions: FeedbackStructure = [
  {
    type: "Section Header",
    header: "Regarding the selection mechanism"
  },
  {
    id: 0,
    question: "How helpful is the “individual selection” of points feature?",
    lowText: "Not Helpful",
    highText: "Very Helpful",
    type: "Question"
  },
  {
    id: 1,
    question: "How helpful is the rectangle selection feature?",
    lowText: "Not Helpful",
    highText: "Very Helpful",
    type: "Question"
  },
  {
    id: 2,
    question: "How helpful is the paintbrush feature?",
    lowText: "Not Helpful",
    highText: "Very Helpful",
    type: "Question"
  },
  {
    type: "Section Header",
    header: "Regarding computer-supported predictions"
  },
  {
    id: 3,
    question: "How easy was the prediction interface to use?",
    lowText: "Very Difficult",
    highText: "Very Easy",
    type: "Question"
  },
  {
    id: 4,
    question: "How accurate did you find the predictions?",
    lowText: "Not Accurate",
    highText: "Very Accurate",
    type: "Question"
  },
  {
    id: 5,
    question: "How helpful did you find the predictions?",
    lowText: "Not Helpful",
    highText: "Very Helpful",
    type: "Question"
  },
  {
    type: "Section Header",
    header: "Comparing User Driven and Computer Supported Mode"
  },
  {
    id: 6,
    question: "Do you prefer user-driven or computer supported selections?",
    lowText: "Strongly prefer user-driven",
    highText: "Strongly prefer computer supported",
    type: "Question"
  },
  {
    type: "Section Header",
    header: "General Questions"
  },
  {
    id: 7,
    question: "How experienced are you with scatterplots?",
    lowText: "Not experienced",
    highText: "Very experienced",
    type: "Question"
  },
  {
    id: 8,
    question: "How experienced are you with statistics?",
    lowText: "Not experienced",
    highText: "Very experienced",
    type: "Question"
  }
];
