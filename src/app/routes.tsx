import { createBrowserRouter } from "react-router";
import { Login } from "./components/login";
import { AdminLayout } from "./components/admin/admin-layout";
import { AdminDashboard } from "./components/admin/admin-dashboard";
import { ArrendadorLayout } from "./components/arrendador/arrendador-layout";
import { ArrendadorDashboard } from "./components/arrendador/arrendador-dashboard";
import { InquilinoLayout } from "./components/inquilino/inquilino-layout";
import { InquilinoDashboard } from "./components/inquilino/inquilino-dashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/administrador",
    Component: AdminLayout,
    children: [
      { path: "dashboard", Component: AdminDashboard },
    ],
  },
  {
    path: "/arrendador",
    Component: ArrendadorLayout,
    children: [
      { path: "dashboard", Component: ArrendadorDashboard },
    ],
  },
  {
    path: "/inquilino",
    Component: InquilinoLayout,
    children: [
      { path: "dashboard", Component: InquilinoDashboard },
    ],
  },
  {
    path: "/",
    Component: Login,
  },
]);