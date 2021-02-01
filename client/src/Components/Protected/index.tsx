import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useMappedState } from "redux-react-hook";

const ProtectedRoute = ({
  Component,
  ...configs
}: {
  Component: any;
  exact?: boolean;
  path: string;
}) => {
  const isAuth: boolean = useMappedState(({ adminReducer }: any) => adminReducer.isAuthenticated);
  return (
    <Route
      {...configs}
      render={(props) =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
