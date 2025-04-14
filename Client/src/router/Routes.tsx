import { createBrowserRouter, Navigate } from "react-router";
import App from "../components/App";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import { ContactPage } from "@mui/icons-material";
import CatalogPage from "../pages/catalog/CatalogPage";
import ProductDetailsPage from "../pages/catalog/ProductDetailsPage";
import ErrorPage from "../pages/ErrorPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import ShoppingCartPage from "../pages/cart/ShoppingCartPage";
import LoginPage from "../pages/account/loginPage";
import RegisterPage from "../pages/account/RegisterPage";

import AuthGuard from "./AuthGuard";
import CheckoutPage from "../pages/checkout/CheckOutPage";
import OrderList from "../pages/orders/OrderList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        //korumalı linkler
        element: <AuthGuard />,
        children: [
          { path: "checkout", element: <CheckoutPage /> },
          { path: "orders", element: <OrderList /> },
        ],
      },
      { path: "", element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "catalog/:id", element: <ProductDetailsPage /> },
      { path: "cart", element: <ShoppingCartPage /> },
      { path: "error", element: <ErrorPage /> },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate to={"/not-found"} /> },
    ],
  },
]);
