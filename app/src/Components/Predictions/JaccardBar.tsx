import React, { FC, useRef, useState, useEffect } from "react";
import IntentStore from "../../Store/IntentStore";
import { inject, observer } from "mobx-react";
import { scaleLinear } from "d3";
import translate from "../../Utils/Translate";
import {
  JACCARD_BAR_BACKGROUND,
  JACCARD_BAR_FOREGROUND
} from "../Styles/PredictionBarStyle";

export interface Props {
  store?: IntentStore;
  score: number;
  height: number;
  label: string;
}

const JaccardBar: FC<Props> = ({ score, height, label }: Props) => {
  const ref = useRef<SVGSVGElement>(null);

  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    const current = ref.current;
    if (current) {
      const dims = current.getBoundingClientRect();
      const width = dims.width;
      if (width !== maxWidth) {
        setMaxWidth(width);
      }
    }
  }, [maxWidth]);

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, maxWidth])
    .nice();

  return (
    <svg ref={ref} height={height} width="100%">
      <rect
        height={height}
        width={maxWidth}
        className={JACCARD_BAR_BACKGROUND}
      />
      <rect
        height={height}
        width={barScale(score)}
        className={JACCARD_BAR_FOREGROUND}
      />
      <text
        transform={translate(maxWidth * 0.05, height / 2)}
        dominantBaseline="middle"
      >
        {label}
      </text>
    </svg>
  );
};

export default inject("store")(observer(JaccardBar));
