import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
export default function Root() {
  return (
  <>
	<Navbar /> 
	<Outlet />
  </>
  );
}