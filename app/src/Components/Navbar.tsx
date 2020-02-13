import React, {useEffect, useContext, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {
  Button,
  Dropdown,
  Menu,
  Radio,
  Icon,
  Container,
} from 'semantic-ui-react';
import {Dataset, Data} from '../Utils/Dataset';
import {style} from 'typestyle';
import {ActionContext} from '../App';
import AddPlotMenu from './AddPlotMenu';

interface NavbarProps {
  store?: any;
  datasets: any[];
  setDataset: (d: Dataset) => void;
  data: Data;
}

function Navbar({store, data, datasets, setDataset}: NavbarProps) {
  const {
    dataset,
    showCategories,
    multiBrushBehaviour,
    categoryColumn,
    isAnythingSelected,
  } = store!;

  const actions = useContext(ActionContext);

  const [addingPlot, setAddingPlot] = useState(false);

  const {categoricalColumns} = data;

  useEffect(() => {
    if (
      showCategories &&
      categoryColumn === '' &&
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
        text={dataset.name}>
        <Dropdown.Menu>
          {datasets.map(d => (
            <Dropdown.Item
              key={d.key}
              active={d.key === dataset}
              onClick={() => {
                setDataset(d);
              }}>
              {d.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );

  const addPlot = (
    <Menu.Item>
      <Button primary onClick={() => setAddingPlot(true)}>
        <Icon name="add" />
        Add Plot
      </Button>
    </Menu.Item>
  );

  const showCategoriesToggle = (
    <Menu.Item>
      <Radio
        toggle
        label="Show Categories"
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
        <Dropdown labeled text={categoryColumn}>
          <Dropdown.Menu>
            {categoricalColumns.map(cat => (
              <Dropdown.Item
                active={categoryColumn === cat}
                key={cat}
                onClick={() => actions.changeCategory(cat)}>
                {cat}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      }
    </Menu.Item>
  );

  const brushToggle = (
    <Menu.Item>
      <Radio
        toggle
        label="Union"
        checked={multiBrushBehaviour === 'Union'}
        onChange={() => {
          actions.toggleMultiBrushBehaviour(
            multiBrushBehaviour === 'Union' ? 'Intersection' : 'Union',
          );
        }}
      />
    </Menu.Item>
  );

  const invertSelectionButton = (
    <Menu.Item>
      <Button primary>Invert Selection</Button>
    </Menu.Item>
  );

  const clearSelectionButton = (
    <Menu.Item>
      <Button
        disabled={!isAnythingSelected}
        primary
        onClick={() => actions.clearSelections()}>
        Clear Selection
      </Button>
    </Menu.Item>
  );

  return (
    <div className={`${menuStyle} ${navStyle}`}>
      <Container fluid textAlign="center">
        <Menu compact>
          {addingPlot ? (
            <AddPlotMenu closeMenu={setAddingPlot} />
          ) : (
            <>
              {datasetDropdown}
              {addPlot}
              {categoricalColumns.length > 0 && showCategoriesToggle}
              {showCategories && showCategoriesDropdown}
              {brushToggle}
              {invertSelectionButton}
              {clearSelectionButton}
            </>
          )}
        </Menu>
      </Container>
    </div>
  );
}

(Navbar as any).whyDidYouRender = true;
export default inject('store')(observer(Navbar));

const menuStyle = style({
  margin: '1em',
});

const navStyle = style({
  gridArea: 'nav',
});
