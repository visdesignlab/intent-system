import {style} from 'typestyle';

export const REGULAR_MARK_STYLE = style({
  fill: 'black',
  opacity: 0.4,
  cursor: 'pointer',
});

const union_color = 'rgb(244, 106, 15)';

const intersection_color = 'rgb(44, 127, 184)';

export const UNION_MARK_STYLE = style({
  fill: union_color,
  opacity: 0.9,
  cursor: 'pointer',
});

export const INTERSECTION_MARK_STYLE = style({
  fill: intersection_color,
  opacity: 0.9,
  cursor: 'pointer',
});

const jaccard_bar_color = 'rgb(168, 211, 238)';

export const JACCARD_BAR_BACKGROUND = style({
  fill: jaccard_bar_color,
  opacity: 0.3,
});

export const JACCARD_BAR_FOREGROUND = style({
  fill: jaccard_bar_color,
  opacity: 0.9,
});

const prob_bar_color = 'rgb(248, 191, 132)';

export const PROB_BAR_BACKGROUND = style({
  fill: prob_bar_color,
  opacity: 0.3,
});

export const PROB_BAR_FOREGROUND = style({
  fill: prob_bar_color,
  opacity: 0.9,
});
