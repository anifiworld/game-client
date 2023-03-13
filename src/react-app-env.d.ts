/// <reference types="react-scripts" />
declare module 'babel-plugin-glsl/macro';
declare module '@babel/runtime/helpers/esm/extends';
declare module '@babel/runtime/helpers/esm/defineProperty';
declare module 'three/src/extras/core/Interpolations';
declare module JSX {
  interface IntrinsicElements {
    atlasMaterial: any;
    atlasMaterialLoop: any;
  }
}

declare module '*/gt-resource/data/building.yaml' {
  const data: Buildings;
  export default data;
}

declare module '*.yaml' {
  const data: any;
  export default data;
}

declare module '*.mp3';
declare module '*.ogg';
declare module '*.wav';

interface WindowChain {
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => void;
  };
}
