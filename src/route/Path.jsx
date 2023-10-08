import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../pages/Layout";


const Path = () => {
  const routes = [];
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RouteGuard>
              <Layout />
            </RouteGuard>
          }
        >
          <Route index element={<Dashboard />} />
          {routes && routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Path;
