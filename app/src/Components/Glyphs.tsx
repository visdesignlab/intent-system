import React from 'react';
import {EventConfig} from '../ProvVis/Utils/EventConfig';
import {IntentEvents} from '../Store/Provenance';
import AddPlotGlyph from './Glyphs/AddPlotGlyph';

// const AddPlotGlyph = (isCurrent: boolean = false) => {
//   return (
//     <g>
//       <circle fill={isCurrent ? 'lightgray' : 'white'} r="7" />
//       <text
//         dominantBaseline="middle"
//         textAnchor="middle"
//         fontSize="0.8em"
//         fill="gray">
//         A
//       </text>
//     </g>
//   );
// };

export const config: EventConfig<IntentEvents> = {
  'Add Plot': {
    currentGlyph: <AddPlotGlyph />,
    backboneGlyph: <AddPlotGlyph />,
    regularGlyph: <AddPlotGlyph />,
  },
};
