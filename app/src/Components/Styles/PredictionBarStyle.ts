import {style} from 'typestyle';

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
