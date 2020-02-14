import React, {FC, useContext} from 'react';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {Menu, Container} from 'semantic-ui-react';
import {SymbolContext} from './Visualization';
import translate from '../../Utils/Translate';

export interface Props {
  store?: IntentStore;
}

const Legend: FC<Props> = ({store}: Props) => {
  const {showCategories} = store!;
  const symbolMap = useContext(SymbolContext);

  const symbols = Object.keys(symbolMap);

  const dimension = 20;

  return showCategories ? (
    <Container fluid textAlign="center" style={{marginBottom: '10px'}}>
      <Menu compact>
        {symbols.map(s => {
          return (
            <Menu.Item key={s}>
              <svg
                height={dimension}
                width={dimension}
                style={{margin: '0.5em'}}>
                <path
                  fill="gray"
                  transform={translate(dimension / 2, dimension / 2)}
                  d={symbolMap[s].size(100)()}
                />
              </svg>
              {s}
            </Menu.Item>
          );
        })}
      </Menu>
    </Container>
  ) : (
    <></>
  );
};

export default inject('store')(observer(Legend));
