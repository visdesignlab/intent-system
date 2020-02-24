import React, {FC, useContext, SVGProps} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import MarkType from './MarkType';
import {SymbolContext} from './Visualization';
import translate from '../../Utils/Translate';
import {
  REGULAR_MARK_STYLE,
  UNION_MARK_STYLE,
  INTERSECTION_MARK_STYLE,
} from '../Styles/MarkStyle';

type Props = SVGProps<SVGElement> & {
  store?: IntentStore;
  type: MarkType;
  x: number;
  y: number;
  category: string;
  extraClass: string;
};

const Mark: FC<Props> = ({
  store,
  x,
  y,
  category,
  type,
  extraClass,
  id,
}: Props) => {
  const {showCategories} = store!;

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

  let mark = (
    <circle
      id={id}
      cx={x}
      cy={y}
      r="0.35em"
      className={`${className} ${extraClass}`}
    />
  );

  if (showCategories) {
    const path = symbolMap[category];
    mark = (
      <path
        id={id}
        transform={translate(x, y)}
        d={path.size(80)()}
        className={`${className} ${extraClass}`}
      />
    );
  }

  return <>{mark}</>;
};

export default inject('store')(observer(Mark));
