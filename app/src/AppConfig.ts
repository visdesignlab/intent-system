export type Mode = "default" | "study";
export type ShowCategories = "show" | "hide";
export type Coding = "yes" | "no";
export type Pred = "supported" | "manual" | "auto";

export type AppConfig = {
  mode: Mode;
  participantId: string;
  sessionId: string;
  studyId: string;
  coding: Coding;
  pred: Pred;
  debugMode: boolean;
  taskId: string;
};
