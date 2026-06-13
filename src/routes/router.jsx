import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

// Pages
import Home from "../pages/Home/Home";
import AllPets from "../pages/Pets/AllPets";
import PetDetails from "../pages/Pets/PetDetails";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/Error/NotFound";

// Dashboard Pages
import MyListings from "../pages/Dashboard/MyListings";
import AddPet from "../pages/Dashboard/AddPet";
import MyRequests from "../pages/Dashboard/MyRequests";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "pets", element: <AllPets /> },
      {
        path: "pets/:id",
        element: (
          <PrivateRoute>
            <PetDetails />
          </PrivateRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <MyListings /> },
      { path: "my-listings", element: <MyListings /> },
      { path: "add-pet", element: <AddPet /> },
      { path: "my-requests", element: <MyRequests /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
