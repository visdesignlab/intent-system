import {createContext} from 'react';
import {ProvenanceActions} from './Store/Provenance';
import {Data} from './Utils/Dataset';

const DataContext = createContext<Data>(null as any);
const ActionContext = createContext<ProvenanceActions>(null as any);

export {DataContext, ActionContext};
