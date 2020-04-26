import { style } from 'typestyle';

const goldenBorder = {
  stroke: "gold",
  opacity: 1,
  strokeWidth: "4px",
  strokeOpacity: 1,
};

const hoverEffect = {
  $nest: {
    "&:hover": goldenBorder,
  },
};

// Mark styling
export const REGULAR_MARK_STYLE = style(
  {
    fill: "black",
    opacity: 0.4,
    cursor: "pointer",
  },
  hoverEffect
);

export const union_color = "rgb(244, 106, 15)";
const intersection_color = "rgb(44, 127, 184)";

export const UNION_MARK_STYLE = style(
  {
    fill: union_color,
    opacity: 0.9,
    cursor: "pointer",
  },
  hoverEffect
);

export const INTERSECTION_MARK_STYLE = style(
  {
    fill: intersection_color,
    opacity: 0.9,
    cursor: "pointer",
  },
  hoverEffect
);

// Selection Style

export const FADE_IN = style({
  $unique: true,
  opacity: "1",
  $debugName: "fadein",
});

export const FADE_OUT = style({
  $unique: true,
  opacity: 0.1,
  $debugName: "fadeout",
});

export const FADE_OUT_2 = style({
  $unique: true,
  opacity: 0.1,
  $debugName: "fadeout2",
});

// Pred-Sel comparision

export const FADE_COMP_IN = style({
  $unique: true,
  fill: "#84dd63",
  opacity: "1 !important",
  $debugName: "fadecompin",
});

export const FADE_COMP_IN_2 = style({
  $unique: true,
  fill: "#84dd63",
  opacity: "1 !important",
  $debugName: "fadecompin2",
});

export const FADE_SELECTION_IN = style({
  $unique: true,
  opacity: 1,
  ...goldenBorder,
  fill: "black",
  $debugName: "fadeselin",
});

export const FADE_OUT_PRED_SELECTION = style({
  $unique: true,
  opacity: "0.1",
  $debugName: "fadeoutpred",
});

export const COLOR = style({
  fill: "red !important",
});

export const REFERENCE_MARK = style({
  stroke: "black",
  strokeWidth: "2px",
  fill: "green",
  opacity: "0.5",
});
