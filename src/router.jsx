import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "./LayOut/MainLayOut";
import Home from "./Pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayOut />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default router;
