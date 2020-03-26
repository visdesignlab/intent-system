import { observable } from 'mobx';

import { defaultStudyState, Phase } from './StudyState';

export default class StudyStore {
  @observable phase: Phase = defaultStudyState.phase;
  @observable loading: boolean = true;
  @observable hintUsedForTasks: string[] = [];
}
