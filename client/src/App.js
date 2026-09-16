import React, { useEffect } from "react";
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./components/Assets/css/sidebar.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
// import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css"; // Custom styles
import "./components/Assets/css/style.css";
import "react-confirm-alert/src/react-confirm-alert.css";

/* Components */
import MainLayout from "./components/MainLayout/MainLayout";
import Error404 from "./views/Errors/Error404";
import AccessDenied from "./views/Errors/AccessDenied";
import AddEmployee from "./views/Employee/AddEmployee";
import AddPatient from "./views/Patient/AddPatient";
import AddDoctor from "./views/Doctor/AddDoctor";
import AddPackages from "./views/Packages/AddPackages";
import AddMedicines from "./views/Medicines/AddMedicines";
import AddNote from "./views/Note/AddNote";
import AddBill from "./views/Bill/AddBill";
import EditEmployee from "./views/Employee/EditEmployee";
import EditPatient from "./views/Patient/EditPatient";
import EditDoctor from "./views/Doctor/EditDoctor";
import EditPackages from "./views/Packages/EditPackages";
import EditMedicines from "./views/Medicines/EditMedicines";
import EditNote from "./views/Note/EditNote";
import EditBill from "./views/Bill/EditBill";
import Appointment from "./views/Appointment/Appointment";
import AppointmentDetails from "./views/Appointment/AppointmentDetails";
import DoctorProfile from "./views/Doctor/DoctorProfile";
import EmployeeProfile from "./views/Employee/EmployeeProfile";
import PackagesDetails from "./views/Packages/PackagesDetails";
import MedicinesDetails from "./views/Medicines/MedicinesDetails";
import NoteDetails from "./views/Note/NoteDetails";
import BillDetails from "./views/Bill/BillDetails";
import Doctor from "./views/Doctor/Doctor";
import Employee from "./views/Employee/Employee";
import Packages from "./views/Packages/Packages";
import Bill from "./views/Bill/Bill";
import Reports from "./views/reports/reports";
import Medicines from "./views/Medicines/Medicines";
import Note from "./views/Note/Note";
import Message from "./views/Message/Message";
import Profile from "./views/Profile/Profile";
import EditProfile from "./views/Profile/EditProfile";
import ClinicProfile from "./views/ClinicProfile/ClinicProfile";
import EditClinicProfile from "./views/ClinicProfile/EditClinicProfile";
import Notification from "./views/Notification/Notification";
import PatientProfille from "./views/Patient/PatientProfille";
import Patient from "./views/Patient/Patient";
import RequestAppointment from "./views/Appointment/RequestAppointment";
import EditAppointment from "./views/Appointment/EditAppointment";
import Search from "./views/Search/Search";
import Welcome from "./views/Welcome/Welcome";
import Login from "./views/Authentication/Login";
import SignIn from "./views/Authentication/SignIn";
// import ForgetPassword from "./views/Authentication/ForgetPassword";
import SignUp from "./views/Authentication/SignUp";
import RequireAuth from "./components/RiquireAuth";
import Home from "./views/Home/Home";
import DiagnosisHistory from "./views/Patient/DiagnosisHistory";
import { IMAGE_URL } from "./constants";
import tokenService from "./apiServices/token.service";
import PrintInvoice from "./views/PrintInvoice/PrintInvoice";

function App() {
  useEffect(() => {
    const data = tokenService.getUser();
    let clinic;
    if (data) {
      clinic = data.clinic;
    }
    const changeFavicon = (faviconUrl) => {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = faviconUrl;
    };
    clinic
      ? changeFavicon(IMAGE_URL + clinic?.favicon?.url)
      : changeFavicon("./favicon.ico");
  }, []);

  // return <RouterProvider router={routes} />;
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/add-packages" element={<AddPackages />} />
            <Route path="/add-medicines" element={<AddMedicines />} />
            <Route path="/add-note" element={<AddNote />} />
            <Route path="/add-invoice" element={<AddBill />} />
            <Route path="/edit-employee/:id" element={<EditEmployee />} />
            <Route path="/edit-patient/:id" element={<EditPatient />} />
            <Route path="/edit-doctor/:id" element={<EditDoctor />} />
            <Route path="/edit-packages/:id" element={<EditPackages />} />
            <Route path="/edit-Medicines/:id" element={<EditMedicines />} />
            <Route path="/edit-Note/:id" element={<EditNote />} />
            <Route path="/edit-invoice/:id" element={<EditBill />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/edit-appointment/:id" element={<EditAppointment />} />
            <Route
              path="/appointment-details/:id"
              element={<AppointmentDetails />}
            />
            <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
            <Route path="/employee-profile/:id" element={<EmployeeProfile />} />
            <Route path="/packages-details/:id" element={<PackagesDetails />} />
            <Route
              path="/medicines-details/:id"
              element={<MedicinesDetails />}
            />
            <Route path="/note-details/:id" element={<NoteDetails />} />
            <Route path="/invoice-details/:id" element={<BillDetails />} />
            <Route path="/doctors" element={<Doctor />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/invoice" element={<Bill />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/note" element={<Note />} />
            <Route path="/message" element={<Message />} />
            <Route path="/my-profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/clinic-profile" element={<ClinicProfile />} />
            <Route
              path="/edit-clinic-profile"
              element={<EditClinicProfile />}
            />
            <Route path="/notification" element={<Notification />} />
            <Route path="/patient-profile/:id" element={<PatientProfille />} />
            <Route path="/diagnosis-history" element={<DiagnosisHistory />} />
            <Route path="/patients" element={<Patient />} />
            <Route
              path="/request-appointment"
              element={<RequestAppointment />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/welcome" element={<Welcome />} />
          </Route>
        </Route>
        <Route path="*" element={<Error404 />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forget-password" element={<ForgetPassword />} /> */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/print-invoice/:id" element={<PrintInvoice />} />
      </Routes>
    </>
  );
}

export default App;
