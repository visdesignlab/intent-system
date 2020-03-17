import React from 'react';
import translate from '../Utils/translate';

interface AddTaskGlyphProps {
  size?: number;
  fill?: string;
  scale?: number;
}

export function ChangeBrushType({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function ClearAll({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function RemoveBrush({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function ChangeBrush({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function Invert({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function TurnPrediction({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function LockPrediction({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function AddBrush({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function PointDeselection({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function PointSelection({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function AddPlot({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function LoadDataset({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function MultiBrush({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function SwitchCategoryVisibility({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}

export function ChangeCategory({ size = 15, fill = '#ccc' }: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size} />
      <g transform={translate(-size / 2, -size / 2)}>
        <rect fill={fill} width={size} height={3} />
        <rect fill={fill} y="4" width={size} height={3} />
        <rect fill="green" y="8" width={size} height={3} />
      </g>
    </g>
  );
}
