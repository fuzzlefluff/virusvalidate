import { Outlet } from 'react-router-dom';
import React from 'react';
import Navbar from './navbar';

/* This creates the heirarch of rendering our navbar then the main page content */

export default function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
