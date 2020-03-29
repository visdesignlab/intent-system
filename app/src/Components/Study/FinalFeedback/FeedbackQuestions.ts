export type FeedbackQuestionStructure = {
  id: number;
  question: string;
  lowText: string;
  highText: string;
};

export const Questions: FeedbackQuestionStructure[] = [
  {
    id: 0,
    question: "How helpful is the “individual selection” of points feature?",
    lowText: "Not Helpful",
    highText: "Very Helpful"
  },
  {
    id: 1,
    question: "How helpful is the rectangle selection feature?",
    lowText: "Not Helpful",
    highText: "Very Helpful"
  },
  {
    id: 2,
    question: "How helpful is the paintbrush feature?",
    lowText: "Not Helpful",
    highText: "Very Helpful"
  },
  {
    id: 3,
    question: "How easy was the prediction interface to use?",
    lowText: "Very Difficult",
    highText: "Very Easy"
  },
  {
    id: 4,
    question: "How accurate did you find the predictions?",
    lowText: "Not Accurate",
    highText: "Very Accurate"
  },
  {
    id: 5,
    question: "How helpful did you find the predictions?",
    lowText: "Not Helpful",
    highText: "Very Helpful"
  },
  {
    id: 6,
    question: "Do you prefer user-driven or computer supported selections?",
    lowText: "Strongly prefer user-driven",
    highText: "Strongly prefer computer supported"
  },
  {
    id: 7,
    question: "How experienced are your with scatterplots?",
    lowText: "Not experienced",
    highText: "Very experienced"
  },
  {
    id: 8,
    question: "How experienced are your with statistics?",
    lowText: "Not experienced",
    highText: "Very experienced"
  }
];
