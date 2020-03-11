import React, { FC, useContext, memo } from "react";
import IntentStore from "../../Store/IntentStore";
import { style } from "typestyle";
import { Menu, Button } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { Plot } from "../../Store/IntentState";
import { ActionContext } from "../../Contexts";

type Props = {
  store?: IntentStore;
  plotID: string;
};

const ScatterplotControls: FC<Props> = ({ store, plotID }: Props) => {
  const { plots } = store!;

  const plot = plots.find(f => f.id === plotID) as Plot;

  const actions = useContext(ActionContext);

  return (
    <Menu className={brushButtonStyle} borderless fluid secondary size="mini">
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
export default memo(inject("store")(observer(ScatterplotControls)));

const closeButtonStyle = style({
  opacity: 0.4,
  transition: "opacity 0.5s",
  $nest: {
    "&:hover": {
      opacity: 1,
      transition: "opacity 0.5s"
    }
  }
});

const brushButtonStyle = style({
  position: "absolute",
  left: 0,
  top: 0,
  margin: "0 !important"
});

const itemStyle = style({
  paddingTop: "0 !important",
  paddingBottom: "0 !important"
});
