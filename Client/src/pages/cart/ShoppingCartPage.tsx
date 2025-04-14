// import { useState } from "react";
// import requests from "../../api/requests";
import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  AddCircleOutline,
  Delete,
  RemoveCircleOutline,
} from "@mui/icons-material";
// import { Cart } from "../../Model/ICart";
// import { useCartContext } from "../../context/CartContext";
// import { toast } from "react-toastify";
import CartSummary from "./Cartsummary";
import { currenyTRY } from "../../utils/formatCurrency";

import { addItemToCart, deleteItemFromCart } from "./cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Link } from "react-router";
// import { setCart } from "./cartSlice";

export default function ShoppingCartPage() {
  //before context
  //     const [cart, setCart] = useState<Cart | null>(null);
  //   useEffect(() => {
  //     requests.Cart.get()
  //       .then((cart) => setCart(cart))
  //       .catch((error) => console.log(error))
  //       .finally(() => setLoading(false));
  //   }, []);

  //!after context
  // const { cart, setCart } = useCartContext();
  const { cart, status } = useAppSelector((state) => state.cart); //redux
  const dispatch = useAppDispatch(); //redux

  // const [status, setStatus] = useState({ loading: false, id: "" }); before thunk
  //!before thunk
  // function handleAddItem(productId: number, id: string) {
  //   setStatus({ loading: true, id: id });

  //   requests.Cart.addItem(productId)
  //     // .then((cart) => setCart(cart)) context
  //     .then((cart) => dispatch(setCart(cart))) //redux
  //     .catch((error) => console.log(error))
  //     .finally(() => setStatus({ loading: false, id: "" }));
  // }

  // function handleDeleteItem(productId: number, id: string, quantity = 1) {
  //   setStatus({ loading: true, id: id });

  //   requests.Cart.deleteItem(productId, quantity)
  //     // .then((cart) => setCart(cart)) context
  //     .then((cart) => dispatch(setCart(cart))) //redux
  //     .catch((error) => console.log(error))
  //     .finally(() => setStatus({ loading: false, id: "" }));
  // }

  if (!cart || cart?.cartItems.length === 0)
    return <Alert severity="warning">Sepetinizde ürün yok</Alert>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart?.cartItems.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src={`http://localhost:5141/images/${item.imageUrl}`}
                    style={{ height: 60 }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">
                  {currenyTRY.format(item.price)}{" "}
                </TableCell>
                <TableCell align="right">
                  <Button
                    // loading={
                    //   status.loading && status.id === "add" + item.productId
                    // } //before thunk
                    loading={status === "pendingAddItem" + item.productId} //using redux thunk
                    // onClick={() =>
                    //   handleAddItem(item.productId, "add" + item.productId)
                    // } //before thunk
                    onClick={() =>
                      dispatch(addItemToCart({ productId: item.productId }))
                    } //using redux thunk
                  >
                    <AddCircleOutline />
                  </Button>
                  {item.quantity}
                  <Button
                    // loading={
                    //   status.loading && status.id === "del" + item.productId
                    // } //before thunk
                    loading={
                      status === "pendingDeleteItem" + item.productId + "single"
                    } //using redux thunk
                    // onClick={() =>
                    //   handleDeleteItem(item.productId, "del" + item.productId)
                    // } //before thunk
                    onClick={() =>
                      dispatch(
                        deleteItemFromCart({
                          productId: item.productId,
                          quantity: 1,
                          key: "single",
                        })
                      )
                    } //using redux thunk
                  >
                    <RemoveCircleOutline />
                  </Button>
                </TableCell>
                <TableCell align="right">
                  {currenyTRY.format(item.price * item.quantity)}
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="error"
                    // loading={
                    //   status.loading && status.id === "del_all" + item.productId
                    // } //before thunk
                    loading={
                      status === "pendingDeleteItem" + item.productId + "all"
                    } //using redux thunk
                    // onClick={() => {
                    //   handleDeleteItem(
                    //     item.productId,
                    //     "del_all" + item.productId,
                    //     item.quantity
                    //   );
                    //   toast.error("Product removed from your cart.");
                    // }} //before thunk
                    onClick={() =>
                      dispatch(
                        deleteItemFromCart({
                          productId: item.productId,
                          quantity: item.quantity,
                          key: "del_all" + item.productId,
                        })
                      )
                    } //using redux thunk
                  >
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <CartSummary />
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          component={Link}
          to="/checkout"
          variant="contained"
          color="primary"
        >
          Checkout
        </Button>
      </Box>
    </>
  );
}
