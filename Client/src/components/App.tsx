import { CircularProgress, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useCartContext } from "../context/CartContext";
import { useEffect, useState } from "react";
// import requests from "../api/requests";

import { useAppDispatch } from "../store/store";
import { getCart } from "../pages/cart/cartSlice";
import { getUser } from "../pages/account/accountSlice";
//hata almamak için header en aşağıda olacak
import Header from "./Header";

function App() {
  //!context api
  // const { setCart } = useCartContext();

  //!redux toolkit
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  const initApp = async () => {
    //uygulama yenilendiğinde reduxtaki token kaybolmasın diye tekrardan set ediyoruz.
    // dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    //buranın çalışması için auth middleware oluşturduk çünkü token geçerli mi değil mi kontrol ediyoruz
    // requests.Account.getUser()
    //   .then((user) => {
    //     setUser(user);
    //     localStorage.setItem("user", JSON.stringify(user));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch(logout());
    //   });
    //!bu kısmı thunk method haline (accountSlice içinde) getirdik
    await dispatch(getUser());

    // requests.Cart.get()
    //   // .then((cart) => setCart(cart)) //context api
    //   .then((cart) => dispatch(setCart(cart))) //redux
    //   .catch((error) => console.log(error))
    //   .finally(() => setLoading(false));
    //!bu kısmı thunk method haline (cartSlice içinde) getirdik
    await dispatch(getCart());
  };

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {/* CssBaseline margini sıfırlar mui özelliği */}
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
        {/* //değişen sayfa için */}
      </Container>
    </>
  );
}

export default App;
