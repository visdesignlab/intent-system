import React from 'react';
import { Image, ImageProps } from 'semantic-ui-react';

import { DatasetType } from '../../Study/TaskList';

type Props = ImageProps & {
  type: DatasetType;
};

const TaskImage = (props: Props) => {
  const { type, size = "tiny" } = props;
  let imagePath = "/imgs/Cluster.png";
  const getImagePath = (path: string) => `/imgs/${path}.png`;
  switch (type) {
    case "cluster":
      imagePath = getImagePath("Cluster");
      break;
    case "linear regression":
      imagePath = getImagePath("LR");
      break;
    case "quadratic regression":
      imagePath = getImagePath("QR");
      break;
    case "outlier":
      imagePath = getImagePath("Outlier");
      break;
    case "skyline":
      imagePath = getImagePath("Skyline");
      break;
  }
  return <Image src={imagePath} size={size} spaced="right" />;
};

export default TaskImage;
