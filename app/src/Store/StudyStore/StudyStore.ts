import { observable } from 'mobx';

import { Phase } from './StudyState';

export default class StudyStore {
  @observable phase: Phase = "Passive Training";
}
