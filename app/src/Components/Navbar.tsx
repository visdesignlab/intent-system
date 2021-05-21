import { inject, observer } from "mobx-react";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Dropdown,
  Header,
  Icon,
  Image,
  Menu,
  Radio,
} from "semantic-ui-react";
import { style } from "typestyle";

import { ActionContext, TaskConfigContext } from "../Contexts";
import { TaskTypeDescription } from "../Study/TaskList";
import { Data, Dataset } from "../Utils/Dataset";
import AddPlotMenu from "./AddPlotMenu";
import { getAllSelections } from "./Predictions/PredictionRowType";

interface NavbarProps {
  store?: any;
  datasets: any[];
  setDataset: (d: Dataset) => void;
  data: Data;
}

function Navbar({ store, data, datasets, setDataset }: NavbarProps) {
  const {
    dataset,
    showCategories,
    multiBrushBehaviour,
    categoryColumn,
    isAnythingSelected,
    plots,
    brushType,
    brushSize,
    isAtRoot,
    isAtLatest,
  } = store!;

  const selections = getAllSelections(plots, multiBrushBehaviour === "Union")
    .values;

  const datasetsList = useMemo(() => {
    return datasets.map(
      (d) =>
        ({
          ...d,
          value: d.key,
          text: d.name,
        } as any)
    );
  }, [datasets]);

  const actions = useContext(ActionContext);
  const task = useContext(TaskConfigContext);
  const { isManual = false } = task || {};

  const [addingPlot, setAddingPlot] = useState(false);

  const { categoricalColumns } = data;

  useEffect(() => {
    if (
      showCategories &&
      categoryColumn === "" &&
      categoricalColumns.length > 0
    ) {
      actions.toggleCategories(showCategories, categoricalColumns);
    }
  }, [actions, categoricalColumns, categoryColumn, showCategories]);

  const datasetDropdown = (
    <Menu.Item>
      <Dropdown
        icon="table"
        className="icon"
        labeled
        button
        text={dataset.name}
        scrolling
        search
        options={datasetsList}
        selectOnBlur={false}
        onChange={(_, data) => {
          setDataset(datasets.filter((d) => d.key === data.value)[0]);
        }}
      >
        {/* <Dropdown.Menu>
          {datasets.map((d) => (
            <Dropdown.Item
              key={d.key}
              active={d.key === dataset}
              onClick={() => {
                setDataset(d);
              }}
            >
              {d.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu> */}
      </Dropdown>
    </Menu.Item>
  );

  const addPlot = (
    <Menu.Item>
      <Button primary onClick={() => setAddingPlot(true)}>
        <Icon name="add" />
        Plot
      </Button>
    </Menu.Item>
  );

  const showCategoriesToggle = (
    <Menu.Item>
      <Radio
        toggle
        disabled={categoricalColumns.length === 0}
        label="Categories"
        checked={showCategories}
        onChange={() =>
          actions.toggleCategories(!showCategories, categoricalColumns)
        }
      />
    </Menu.Item>
  );

  const showCategoriesDropdown = (
    <Menu.Item>
      {
        <Dropdown
          labeled
          text={categoryColumn}
          disabled={categoricalColumns.length === 1}
        >
          <Dropdown.Menu>
            {categoricalColumns.map((cat) => (
              <Dropdown.Item
                active={categoryColumn === cat}
                key={cat}
                onClick={() => actions.changeCategory(cat)}
              >
                {cat}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      }
    </Menu.Item>
  );

  const brushToggle = (
    <Menu.Item size="mini">
      <Radio
        toggle
        label="Union"
        checked={multiBrushBehaviour === "Union"}
        onChange={() => {
          actions.toggleMultiBrushBehaviour(
            multiBrushBehaviour === "Union" ? "Intersection" : "Union"
          );
        }}
      />
    </Menu.Item>
  );

  const invertSelectionButton = (
    <Menu.Item>
      <Button
        primary
        disabled={selections.length === 0}
        onClick={() => {
          const dataIds = data.values.map((_, i) => i);

          actions.invertSelection(selections, dataIds);
        }}
      >
        Invert
      </Button>
    </Menu.Item>
  );

  const clearSelectionButton = (
    <Menu.Item>
      <Button
        disabled={!isAnythingSelected}
        primary
        onClick={() => actions.clearSelections()}
      >
        Clear
      </Button>
    </Menu.Item>
  );

  const brushSelection = (
    <Menu.Item>
      <Button.Group primary size="mini">
        <Button
          icon="square outline"
          content="Rect"
          active={brushType === "Rectangular"}
          onClick={() => {
            if (brushType === "Rectangular") return;
            actions.changeBrushType("Rectangular");
          }}
        />
        <Button
          icon
          circular
          active={brushSize === "20"}
          onClick={() => {
            actions.changeBrushSize("20");
          }}
        >
          <Icon size="mini" name="circle" />
        </Button>
        <Button
          icon
          circular
          active={brushSize === "35"}
          onClick={() => {
            actions.changeBrushSize("35");
          }}
        >
          <Icon size="small" name="circle" />
        </Button>
        <Button
          icon
          circular
          active={brushSize === "50"}
          onClick={() => {
            actions.changeBrushSize("50");
          }}
        >
          <Icon size="large" name="circle" />
        </Button>
      </Button.Group>
    </Menu.Item>
  );

  const taskTypeDesc: TaskTypeDescription = isManual
    ? "User Driven"
    : "Computer Supported";

  return (
    <div className={`${menuStyle} ${navStyle}`}>
      <Container fluid textAlign="center">
        <Menu compact size="mini">
          {!task && (
            <>
              {/* <Menu.Item> */}
              {/*   <Image src="/imgs/vdl-logo-icon.svg" size="mini" /> */}
              {/* </Menu.Item> */}
              <Menu.Item>
                <Link to="/study">
                  <Button content="Study" size="tiny" primary />
                </Link>
              </Menu.Item>
            </>
          )}
          {addingPlot ? (
            <AddPlotMenu closeMenu={setAddingPlot} />
          ) : (
            <>
              {datasets.length > 1 && datasetDropdown}
              {!task && addPlot}
              {!task && categoricalColumns.length > 0 && showCategoriesToggle}
              {!task && showCategories && showCategoriesDropdown}
              {!task && brushToggle}
              {brushSelection}
              {invertSelectionButton}
              {clearSelectionButton}
              {!task && false && (
                <Menu.Item>
                  <Button.Group primary size="mini">
                    <Button
                      icon
                      disabled={isAtRoot}
                      onClick={() => actions.goBack()}
                    >
                      <Icon name="undo" />
                    </Button>
                    <Button icon disabled={isAtLatest}>
                      <Icon name="redo" onClick={() => actions.goForward()} />
                    </Button>
                  </Button.Group>
                </Menu.Item>
              )}
              {task && (
                <Menu.Item>
                  <Header as="h2">{taskTypeDesc}</Header>
                </Menu.Item>
              )}
            </>
          )}
        </Menu>
      </Container>
    </div>
  );
}

(Navbar as any).whyDidYouRender = true;
export default memo(inject("store")(observer(Navbar)));

const menuStyle = style({
  margin: "1em",
});

const navStyle = style({
  gridArea: "nav",
});
