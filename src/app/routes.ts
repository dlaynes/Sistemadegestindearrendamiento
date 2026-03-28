import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/dashboard";
import { Properties } from "./components/properties";
import { Contracts } from "./components/contracts";
import { Payments } from "./components/payments";
import { Messages } from "./components/messages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "propiedades", Component: Properties },
      { path: "contratos", Component: Contracts },
      { path: "pagos", Component: Payments },
      { path: "mensajes", Component: Messages },
    ],
  },
]);
