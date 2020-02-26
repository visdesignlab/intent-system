import {style} from 'typestyle';

const goldenBorder = {
  stroke: 'gold',
  opacity: 1,
  strokeWidth: '4px',
  strokeOpacity: 1,
};

const hoverEffect = {
  $nest: {
    '&:hover': goldenBorder,
  },
};

// Mark styling
export const REGULAR_MARK_STYLE = style(
  {
    fill: 'black',
    opacity: 0.4,
    cursor: 'pointer',
  },
  hoverEffect,
);

const union_color = 'rgb(244, 106, 15)';
const intersection_color = 'rgb(44, 127, 184)';

export const UNION_MARK_STYLE = style(
  {
    fill: union_color,
    opacity: 0.9,
    cursor: 'pointer',
  },
  hoverEffect,
);

export const INTERSECTION_MARK_STYLE = style(
  {
    fill: intersection_color,
    opacity: 0.9,
    cursor: 'pointer',
  },
  hoverEffect,
);

// Selection Style

export const FADE_IN = style({
  opacity: '1',
});

export const FADE_OUT = style({
  opacity: 0.1,
});

// Pred-Sel comparision

export const FADE_COMP_IN = style({
  fill: '#84dd63',
  opacity: '1',
});

export const FADE_SELECTION_IN = style({
  opacity: 1,
  ...goldenBorder,
  fill: 'black',
});
