import React, {FC, useContext, memo} from 'react';
import IntentStore from '../../Store/IntentStore';
import {style} from 'typestyle';
import {Menu, Button, Input, Header} from 'semantic-ui-react';
import {ActionContext} from '../../App';
import {inject, observer} from 'mobx-react';
import {FreeFromRadiusContext} from './Scatterplot';
import {Plot} from '../../Store/IntentState';

type Props = {
  store?: IntentStore;
  setFreeFormBrushRadius: any;
  plotID: string;
};

const ScatterplotControls: FC<Props> = ({
  store,
  setFreeFormBrushRadius,
  plotID,
}: Props) => {
  const {brushType, plots} = store!;

  const plot = plots.find(f => f.id === plotID) as Plot;

  const actions = useContext(ActionContext);
  const freeFormBrushRadius = useContext(FreeFromRadiusContext);

  const minBrushRange = 20;
  const maxBrushRange = 100;

  return (
    <Menu className={brushButtonStyle} borderless fluid secondary size="mini">
      <Menu.Item className={itemStyle}>
        <Button.Group size="mini">
          <Button
            icon="square outline"
            content="Rectangular"
            active={brushType === 'Rectangular'}
            onClick={() => {
              if (brushType === 'Rectangular') actions.changeBrushType('None');
              else actions.changeBrushType('Rectangular');
            }}
          />
          <Button.Or />
          <Button
            icon="magic"
            content="Freeform"
            active={brushType === 'Freeform'}
            onClick={() => {
              if (brushType === 'Freeform') actions.changeBrushType('None');
              else actions.changeBrushType('Freeform');
            }}
          />
        </Button.Group>
      </Menu.Item>
      {brushType === 'Freeform' && (
        <>
          <Menu.Item className={itemStyle}>
            <Input
              type="range"
              min={minBrushRange}
              max={maxBrushRange}
              step={1}
              value={freeFormBrushRadius}
              onChange={(_, data) => {
                setFreeFormBrushRadius(parseInt(data.value) || 0);
              }}
            />
          </Menu.Item>
          <Menu.Item className={itemStyle}>
            <Header>Brush Size: </Header> {freeFormBrushRadius}
          </Menu.Item>
        </>
      )}
      {plots.length > 1 && (
        <Menu.Menu position="right">
          <Menu.Item className={itemStyle}>
            <Button
              icon="close"
              onClick={() => actions.removePlot(plot)}
              size="mini"
              negative
              compact
              className={closeButtonStyle}
            />
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  );
};

(ScatterplotControls as any).whyDidYouRender = true;
export default memo(inject('store')(observer(ScatterplotControls)));

const closeButtonStyle = style({
  opacity: 0.4,
  transition: 'opacity 0.5s',
  $nest: {
    '&:hover': {
      opacity: 1,
      transition: 'opacity 0.5s',
    },
  },
});

const brushButtonStyle = style({
  position: 'absolute',
  left: 0,
  top: 0,
  margin: '0 !important',
});

const itemStyle = style({
  paddingTop: '0 !important',
  paddingBottom: '0 !important',
});
