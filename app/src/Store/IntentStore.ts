import {observable, action} from 'mobx';
import {defaultState, IntentState, MultiBrushBehaviour} from './IntentState';
import {ProvenanceGraph} from '@visdesignlab/provenance-lib-core';
import {IntentEvents} from './Provenance';

export default class IntentStore {
  @observable graph: ProvenanceGraph<IntentState, IntentEvents> = null as any;
  @observable dataset: string = defaultState.dataset;
  @observable isAtRoot: boolean = false;
  @observable isAtLatest: boolean = false;
  @observable multiBrushBehaviour: MultiBrushBehaviour =
    defaultState.multiBrushBehaviour;
  @action resetStore(graph: ProvenanceGraph<IntentState, IntentEvents>) {
    this.dataset = defaultState.dataset;
    this.graph = graph;
  }
}
