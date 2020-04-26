import React from 'react';

import translate from '../Utils/Translate';

// import { symbol, symbols } from 'd3';

interface AddTaskGlyphProps {
  size?: number;
  fill?: string;
  scale?: number;
}

//Occurs on selecting rectangular brush
export function ChangeBrushType({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <svg height={size} width={size} viewBox="0 0 141.75 141.75">
          <g id="Layer 1">
            <path
              stroke={fill}
              strokeWidth="8"
              d="M0+141.75L141.069+0.305731"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
            <path
              stroke={fill}
              strokeWidth="8"
              d="M76.2578+103.486L90.5601+114.114C90.5601+114.114+99.8156+137.498+74.2147+137.498C53.7829+137.498+48.8808+110.711+49.6965+109.863C49.6965+109.863+60.7858+122.325+61.9556+116.24C63.9988+105.611+76.2578+103.486+76.2578+103.486ZM127.585+49.613C127.308+49.6166+127.031+49.6388+126.751+49.6794C124.356+50.0268+121.717+51.7745+118.137+55.3776L84.3591+88.0407C84.3585+88.0411+84.3578+88.0402+84.3573+88.0407C82.4109+89.8348+81.776+93.0922+82.5535+96.6415C83.3425+100.243+85.4619+103.608+88.3851+105.635C91.2896+107.65+95.1882+108.221+99.2129+107.403C103.001+106.633+106.521+104.693+108.654+102.179C108.654+102.179+108.653+102.178+108.654+102.177C108.654+102.177+108.655+102.178+108.655+102.177L134.486+66.7279C134.487+66.7273+134.486+66.7266+134.486+66.726C136.375+63.9384+137.395+61.4407+137.462+59.166C137.537+56.6101+136.4+54.3632+133.911+52.4215C131.424+50.4808+129.522+49.5881+127.585+49.613Z"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
            <path
              stroke={fill}
              strokeWidth="8"
              d="M17.5647+7.49443L61.7224+7.49443C66.5892+7.49443+70.5345+12.5807+70.5345+18.8549L70.5345+50.7774C70.5345+57.0516+66.5892+62.1379+61.7224+62.1379L17.5647+62.1379C12.6979+62.1379+8.75258+57.0516+8.75258+50.7774L8.75258+18.8549C8.75258+12.5807+12.6979+7.49443+17.5647+7.49443Z"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </g>
    </g>
  );
}

//Occurs on clear all click ???
export function ClearAll({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf2ed;
        </text>
      </g>
    </g>
  );
}

//Occurs on removing a brush
export function RemoveBrush({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf057;
        </text>
      </g>
    </g>
  );
}

//Occurs on shifting a rectangle size, dragging it ???
export function ChangeBrush({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf044;
        </text>
      </g>
    </g>
  );
}

//Occurs on invert
export function Invert({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf042;
        </text>
      </g>
    </g>
  );
}

export function TurnPrediction({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf25a;
        </text>
      </g>
    </g>
  );
}

//When the check is clicked
export function LockPrediction({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf0eb;
        </text>
      </g>
    </g>
  );
}

//When a rectangular brush is added
export function AddBrush({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf5ef;
        </text>
      </g>
    </g>
  );
}

//When a point is individually deselected
export function PointDeselection({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf12d;
        </text>
      </g>
    </g>
  );
}

//When a brush or individual selection is made
export function PointSelection({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf1fc;
        </text>
      </g>
    </g>
  );
}

//When add plot is clicked, or initial loading of data.
export function AddPlot({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <svg height={size} width={size} viewBox="0 0 141.75 141.75">
          <g id="Layer 1">
            <path
              stroke={fill}
              strokeWidth="25"
              d="M11.34-11.34L11.6801+130.41L153.09+130.41"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="miter"
            />
            <path
              stroke={fill}
              strokeWidth="25"
              d="M77.7957+28.35L77.7957+99.225"
              fill="none"
              strokeLinecap="butt"
              opacity="1"
              strokeLinejoin="round"
            />
            <path
              stroke={fill}
              strokeWidth="25"
              d="M113.4+63.8289L42.525+63.7875"
              fill="none"
              strokeLinecap="butt"
              opacity="1"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </g>
    </g>
  );
}

//Whenever a new dataset is selected
export function LoadDataset({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf0ce;
        </text>
      </g>
    </g>
  );
}

export function MultiBrush({ size = 15, fill = "#ccc" }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf1fc;
        </text>
      </g>
    </g>
  );
}

export function SwitchCategoryVisibility({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf61f;
        </text>
      </g>
    </g>
  );
}

export function ChangeBrushSize({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <svg height={size} width={size} viewBox="0 0 141.75 141.75">
          <g id="Layer 1">
            <path
              stroke={fill}
              strokeWidth="8"
              d="M76.8252+103.165L90.6711+113.451C90.6711+113.451+99.6313+136.08+74.8472+136.08C55.0673+136.08+50.3216+110.158+51.1113+109.337C51.1113+109.337+61.8468+121.397+62.9792+115.508C64.9572+105.222+76.8252+103.165+76.8252+103.165ZM126.515+51.0305C126.247+51.0339+125.979+51.0555+125.708+51.0948C123.388+51.431+120.834+53.1223+117.368+56.6091L84.6679+88.2186C84.6674+88.219+84.6667+88.2181+84.6662+88.2186C82.7819+89.9548+82.1673+93.1071+82.92+96.5419C83.6838+100.027+85.7355+103.283+88.5655+105.246C91.3773+107.195+95.1515+107.748+99.0478+106.956C102.715+106.212+106.122+104.333+108.187+101.901C108.188+101.9+108.187+101.9+108.187+101.899C108.188+101.899+108.189+101.9+108.189+101.899L133.196+67.5932C133.196+67.5927+133.195+67.592+133.196+67.5915C135.024+64.8937+136.012+62.4766+136.077+60.2753C136.149+57.8019+135.048+55.6274+132.639+53.7484C130.231+51.8702+128.39+51.0064+126.515+51.0305Z"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
            <path
              stroke={fill}
              strokeWidth="12.58"
              d="M7.0875+29.2572L49.6125+29.2572"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
            <path
              stroke={fill}
              strokeWidth="12.58"
              d="M28.4705+8.505L28.35+51.03"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
            <path
              stroke={fill}
              strokeWidth="5"
              d="M28.4705+72.2925L70.9955+29.7675"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
            <path
              stroke={fill}
              strokeWidth="12.58"
              d="M58.1175+62.3878L58.1175+62.3878L70.0025+62.3878L93.555+62.3878"
              fill="none"
              strokeLinecap="round"
              opacity="1"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </g>
    </g>
  );
}

export function ChangeCategory({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <text
          fontSize={size}
          fill={fill}
          textAnchor="middle"
          alignmentBaseline="middle"
          x={size / 2}
          y={size / 2}
          fontFamily="FontAwesome"
        >
          &#xf61f;
        </text>
      </g>
    </g>
  );
}
