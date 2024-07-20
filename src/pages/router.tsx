import { createBrowserRouter, createHashRouter } from "react-router-dom";

import { Root } from "./Root";
import { Home } from "./Home";
import { Schedule } from "./Schedule";

function defineRouter() {
  return import.meta.env.VITE_ROUTER === "hash"
    ? createHashRouter
    : createBrowserRouter;
}

export const router = defineRouter()(
  [
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
  ],
  {
    basename:
      import.meta.env.VITE_ROUTER !== "hash"
        ? import.meta.env.BASE_URL
        : undefined,
  },
);
