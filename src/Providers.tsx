import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Web3ReactProvider } from '@web3-react/core';
import Theme from './components/Theme';
import store, { persistor } from './state';
import { getLibrary } from './utils/web3React';

const Providers: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      {/* @ts-ignore */}
      <PersistGate loading={null} persistor={persistor}>
        <Theme>
          <Web3ReactProvider getLibrary={getLibrary}>
            {children}
          </Web3ReactProvider>
        </Theme>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
