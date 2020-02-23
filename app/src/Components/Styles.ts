import {style} from 'typestyle';

const hoverEffect = {
  $nest: {
    '&:hover': {
      stroke: 'gold',
      opacity: 1,
      strokeWidth: '4px',
      strokeOpacity: 1,
    },
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

// Bar styling

const jaccard_bar_color = 'rgb(168, 211, 238)';
const jaccard_bar_fill = {
  fill: jaccard_bar_color,
};

export const JACCARD_BAR_BACKGROUND = style(jaccard_bar_fill, {
  opacity: 0.3,
});

export const JACCARD_BAR_FOREGROUND = style(jaccard_bar_fill, {
  opacity: 0.9,
});

const prob_bar_color = 'rgb(248, 191, 132)';
const prob_bar_fill = {
  fill: prob_bar_color,
};

export const PROB_BAR_BACKGROUND = style(prob_bar_fill, {
  opacity: 0.3,
});

export const PROB_BAR_FOREGROUND = style(prob_bar_fill, {
  opacity: 0.9,
});
