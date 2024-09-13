import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header/Header";

export default function MainLayOut() {
  return (
    <>
      <div className="container">
        <Header />
        <div className="d-flex justify-content-center">
          <Outlet />
        </div>
      </div>
    </>
  );
}
