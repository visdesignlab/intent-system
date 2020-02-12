import React, {FC} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';

export interface Props {
  store?: IntentStore;
}

const Scatterplot: FC<Props> = ({}: Props) => {
  return <g></g>;
};

export default inject('store')(observer(Scatterplot));
