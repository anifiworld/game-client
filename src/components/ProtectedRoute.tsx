import React, { Component, ReactNode, useMemo } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useIsLoggedIn } from '../state/hooks';

const ProtectedRoute = ({ element, ...props }: { element: JSX.Element }) => {
  const loggedIn = useIsLoggedIn();
  const { account } = useWeb3React();
  const isLoggedIn = useMemo(
    () => loggedIn !== null && account !== null && account !== undefined,
    [account, loggedIn],
  );
  const isAuthenticated = isLoggedIn;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return element;
};

export default ProtectedRoute;
