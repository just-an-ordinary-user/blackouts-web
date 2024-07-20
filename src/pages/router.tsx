import { createBrowserRouter } from "react-router-dom";

import { Root } from "./Root";
import { Home } from "./Home";
import { Schedule } from "./Schedule";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
    ],
  },
]);
