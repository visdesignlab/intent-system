import React, {FC, useContext} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import MarkType from './MarkType';
import {
  REGULAR_MARK_STYLE,
  UNION_MARK_STYLE,
  INTERSECTION_MARK_STYLE,
} from '../Styles';
import {SymbolContext} from './Visualization';
import translate from '../../Utils/Translate';

interface Props {
  store?: IntentStore;
  type: MarkType;
  x: number;
  y: number;
  category: string;
}

const Mark: FC<Props> = ({store, x, y, category, type}: Props) => {
  const {showCategories, categoryColumn} = store!;

  const symbolMap = useContext(SymbolContext);
  let className = REGULAR_MARK_STYLE;

  switch (type) {
    case 'Union':
      className = UNION_MARK_STYLE;
      break;
    case 'Intersection':
      className = INTERSECTION_MARK_STYLE;
      break;
    case 'Regular':
    default:
      className = REGULAR_MARK_STYLE;
      break;
  }

  let mark = <circle cx={x} cy={y} r="0.35em" className={className} />;

  if (showCategories) {
    const path = symbolMap[category];
    mark = (
      <path
        transform={translate(x, y)}
        d={path.size(80)()}
        className={className}
      />
    );
  }

  return <>{mark}</>;
};

export default inject('store')(observer(Mark));
