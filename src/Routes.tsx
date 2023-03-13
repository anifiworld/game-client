import React, { Dispatch } from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import {
  Home,
  Game,
  Welcome,
  Team,
  ReceivedHero,
  Shop,
  Hero,
  Inventory,
  SelectWorld,
  ViewHero,
  StageSelection,
  Battle,
  PrivateSale,
  Staking,
} from './views';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route path="/game" element={<ProtectedRoute element={<Game />} />} />
      <Route
        path="/welcome"
        element={<ProtectedRoute element={<Welcome />} />}
      />
      <Route path="/team" element={<ProtectedRoute element={<Team />} />} />
      <Route
        path="/received-hero"
        element={<ProtectedRoute element={<ReceivedHero />} />}
      />
      <Route path="/shop" element={<ProtectedRoute element={<Shop />} />} />
      <Route path="/hero" element={<ProtectedRoute element={<Hero />} />} />
      <Route
        path="/inventory"
        element={<ProtectedRoute element={<Inventory />} />}
      />
      <Route
        path="/select-world"
        element={<ProtectedRoute element={<SelectWorld />} />}
      />
      <Route
        path="/view-hero"
        element={<ProtectedRoute element={<ViewHero />} />}
      />
      <Route
        path="/stage-selection"
        element={<ProtectedRoute element={<StageSelection />} />}
      />
      <Route path="/battle" element={<ProtectedRoute element={<Battle />} />} />
      <Route path="/private-sale" element={<PrivateSale />} />
      <Route path="/staking" element={<Staking />} />
    </ReactRoutes>
  );
};

export default Routes;
