import React from 'react';
import {selectAll} from 'd3';

export type HoverConfig = {
  selector: string;
  classToApply: string;
};

export interface Props {
  configs?: HoverConfig[];
}

function hoverable<P>(BaseComponent: React.ComponentType<P>) {
  return function(props: P & Props) {
    const {configs = []} = props;

    const addClasses: any[] = [];
    const removeClasses: any[] = [];

    configs.forEach(config => {
      const {selector, classToApply} = config;

      const selectNodes = () => selectAll(selector);

      const addClass = () => selectNodes().classed(classToApply, true);
      const removeClass = () => selectNodes().classed(classToApply, false);

      addClasses.push(addClass);
      removeClasses.push(removeClass);
    });

    const addClass = () => addClasses.forEach(f => f());
    const removeClass = () => removeClasses.forEach(f => f());

    return (
      <>
        <BaseComponent
          onMouseEnter={addClass}
          onMouseLeave={removeClass}
          {...props}
        />
      </>
    );
  };
}

export default hoverable;
