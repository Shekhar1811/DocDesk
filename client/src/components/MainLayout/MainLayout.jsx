import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useLocation, Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const MainLayout = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  return (
    <>
      {
        /* !pathname.startsWith("/add-") &&  */ pathname !== "/sign-in" && (
          <Header setShow={setShow} show={show} />
        )
      }
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Outlet />
      </LocalizationProvider>
      {
        /* !pathname.startsWith("/add-") &&  */ pathname !== "/sign-in" && (
          <Footer />
        )
      }
      <Sidebar setShow={setShow} show={show} />
    </>
  );
};

export default MainLayout;
