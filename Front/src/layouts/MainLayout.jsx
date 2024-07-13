
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar/navbar";
export function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>

  );
}
