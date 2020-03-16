export type Mode = "default" | "study";
export type ShowCategories = "show" | "hide";

export type AppConfig = {
  mode: Mode;
  participantId: string;
  sessionId: string;
  studyId: string;
  coding: string;
};
