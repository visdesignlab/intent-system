export type FeedbackQuestionStructure = {
  question: string;
  lowText: string;
  highText: string;
};

export const Questions: FeedbackQuestionStructure[] = [
  {
    question: "How helpful is the “individual selection” of points feature.",
    lowText: "Not Helpful",
    highText: "Very Helpful"
  },
  {
    question: "How helpful is the rectangle selection feature.",
    lowText: "Not Helpful",
    highText: "Very Helpful"
  },
  {
    question: "How helpful is the paintbrush feature.",
    lowText: "Not Helpful",
    highText: "Very Helpful"
  }
];
