import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useIsLoggedIn } from '../state/hooks';

const useEagerConnect = () => {
  const { login } = useAuth();
  const connectorID = useIsLoggedIn();

  useEffect(() => {
    if (connectorID) {
      login(connectorID);
    }
  }, [connectorID, login]);
};

export default useEagerConnect;
