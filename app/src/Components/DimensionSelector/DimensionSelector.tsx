import * as React from 'react';
import { Icon, Menu, MenuItemProps, MenuProps } from 'semantic-ui-react';
import styled from 'styled-components';

interface OwnProps {
  label: string;
  dimensions: string[];
  disabledDimensions: string[];
  selection: string[];
  debugBackend: string[];
  notifyColumnChange: (coL: string) => void;
}

type Props = OwnProps;

const DimensionSelector: React.FC<Props> = ({
  label,
  dimensions,
  disabledDimensions,
  selection,
  notifyColumnChange,
  debugBackend
}) => {
  return dimensions && dimensions.length > 0 ? (
    <WrappedMenu pointing secondary borderless stackable>
      <MenuHeader header>{label}</MenuHeader>
      {dimensions.map(dim => (
        <Menu.Item
          key={dim}
          name={dim}
          active={selection.includes(dim)}
          disabled={disabledDimensions.includes(dim)}
          onClick={() => {
            notifyColumnChange(dim);
          }}
        >
          {dim}
          {debugBackend.includes(dim) && (
            <Icon name="bullseye" size="mini" color="red" />
          )}
        </Menu.Item>
      ))}
    </WrappedMenu>
  ) : (
    <div />
  );
};

export default DimensionSelector;

const WrappedMenu = styled(Menu)<MenuProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 !important;
`;

const MenuHeader = styled(Menu.Item)<MenuItemProps>`
  font-size: 1.2rem;
  background-color: rgba(128, 128, 128, 0.09) !important;
`;
