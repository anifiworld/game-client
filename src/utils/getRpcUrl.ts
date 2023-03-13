import random from 'lodash/random';

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE];

export const getNodeUrl = (index?: number) => {
  if (!index) index = random(0, nodes.length - 1);
  return nodes[index];
};
