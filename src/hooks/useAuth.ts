import { useCallback } from 'react';
import Web3 from 'web3';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { createNonce, getNonce, signIn } from 'utils/callHelpers';
import { useAppDispatch } from '../state';
import { logout, setLoggedIn } from '../state/actions';
import { ConnectorNames } from '../types/ConnectorNames';
import { setupNetwork } from '../utils/wallet';
import { connectorsByName } from '../utils/web3React';


const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const dispatch = useAppDispatch();

  const alert = useCallback((title: string, msg: string) => {
    //window.alert(title + msg);
  }, []);

  const handleLogout = useCallback(() => {
    deactivate();
    dispatch(logout());
  }, [deactivate, dispatch]);

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      let isError = false;
      const connector = connectorsByName[connectorID];
      if (connector) {
        activate(connector, async (error: Error) => {
          isError = true;
          dispatch(logout());
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              await activate(connector);
            }
          } else {
            if (error instanceof NoEthereumProviderError) {
              // toastError('Provider Error', 'No provider was found')
              alert('No provider was found', 'error');
            } else if (error instanceof UserRejectedRequestErrorInjected) {
              alert('Please authorize to access your account', 'error');
            } else if (error instanceof UserRejectedRequestErrorWalletConnect) {
              alert('Please authorize to access your account', 'error');
            } else {
              alert(error.message, 'error');
            }
          }
        }).then(async () => {
          if (!isError) {
            try {
              const provider = await connector?.getProvider();
              const web3 = new Web3(provider);
              const account = (await web3.eth.getAccounts())[0];
              let nonce = await getNonce(account);
              if (!nonce) {
                nonce = await createNonce(account);
              }
              const signature = await web3.eth.personal.sign(
                nonce,
                account,
                '',
              );
              const { access } = await signIn(account, signature);
              dispatch(
                setLoggedIn({
                  loginType: connectorID,
                  token: access,
                  account,
                }),
              );
            } catch (e: any) {
              handleLogout();
            }
          }
        });
      } else {
        alert('The connector config is wrong', 'error');
        // toastError("Can't find connector", 'The connector config is wrong')
      }
    },
    [activate, dispatch, alert, handleLogout],
  );
  return { login, logout: handleLogout };
};

export default useAuth;