import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout/MainLayout";
import Home from "../views/Home/Home";
import SignIn from "../views/Authentication/SignIn";
import SignUp from "../views/Authentication/SignUp";
import Login from "../views/Authentication/Login";
import AddEmployee from "../views/Employee/AddEmployee";
import AccessDenied from "./../views/Errors/AccessDenied";
import AddPatient from "../views/Patient/AddPatient";
import Appointment from "../views/Appointment/Appointment";
import AddPackages from "../views/Packages/AddPackages";
import AddDoctor from "../views/Doctor/AddDoctor";
import DoctorProfile from "../views/Doctor/DoctorProfile";
import EmployeeProfile from "../views/Employee/EmployeeProfile";
import PackagesDetails from "../views/Packages/PackagesDetails";
import Doctor from "./../views/Doctor/Doctor";
import Employee from "./../views/Employee/Employee";
import Packages from "./../views/Packages/Packages";
import History from "./../views/History/History";
import Message from "./../views/Message/Message";
import Profile from "./../views/Profile/Profile";
import Notification from "../views/Notification/Notification";
import PatientProfille from "../views/Patient/PatientProfille";
import Patient from "./../views/Patient/Patient";
import RequestAppointment from "../views/Appointment/RequestAppointment";
import Search from "../views/Search/Search";
import Error404 from "./../views/Errors/Error404";
import Welcome from "../views/Welcome/Welcome";
import PrintInvoice from "./../views/PrintInvoice/PrintInvoice"

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/access-denied", element: <AccessDenied /> },
      { path: "/add-employee", element: <AddEmployee /> },
      { path: "/add-patient", element: <AddPatient /> },
      { path: "/appointment", element: <Appointment /> },
      { path: "/add-doctor", element: <AddDoctor /> },
      { path: "/add-packages", element: <AddPackages /> },
      { path: "/doctor-profile", element: <DoctorProfile /> },
      { path: "/employee-profile", element: <EmployeeProfile /> },
      { path: "/packages-details", element: <PackagesDetails /> },
      { path: "/doctor", element: <Doctor /> },
      { path: "/employees", element: <Employee /> },
      { path: "/packages", element: <Packages /> },
      { path: "/history", element: <History /> },
      { path: "/message", element: <Message /> },
      { path: "/my-profile", element: <Profile /> },
      { path: "/notification", element: <Notification /> },
      { path: "/patient-profile", element: <PatientProfille /> },
      { path: "/patients", element: <Patient /> },
      { path: "/request-appointment", element: <RequestAppointment /> },
      { path: "/search", element: <Search /> },
      { path: "/welcome", element: <Welcome /> },
    ],
  },
  { path: "*", element: <Error404 /> },
  { path: "/login", element: <Login /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/print-invoice", element: <PrintInvoice /> }
]);

export default routes;
