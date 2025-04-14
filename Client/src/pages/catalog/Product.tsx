import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { IProduct } from "../../Model/IProduct";
import { AddShoppingCart, Search } from "@mui/icons-material";
import { Link } from "react-router";
// import { useState } from "react";
// import requests from "../../api/requests";

// import { useCartContext } from "../../context/CartContext";
// import { toast } from "react-toastify";
import { currenyTRY } from "../../utils/formatCurrency";

import { addItemToCart } from "../cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

interface Props {
  product: IProduct;
}

const Product = ({ product }: Props) => {
  // const [loading, setLoading] = useState(false);

  // const { setCart } = useCartContext(); context
  const dispatch = useAppDispatch(); //redux
  //!after thunk
  const { status } = useAppSelector((state) => state.cart); //redux

  //!before thunk
  // function handleAddItem(productId: number) {
  //   setLoading(true);

  //   requests.Cart.addItem(productId)
  //     .then((cart) => {
  //       // setCart(cart);
  //       dispatch(setCart(cart));
  //       toast.success("Added to your cart.");
  //     })
  //     .catch((error) => console.log(error))
  //     .finally(() => setLoading(false));
  // }

  return (
    <>
      <Card>
        <CardMedia
          sx={{ height: 160, backgroundSize: "contain" }}
          image={`http://localhost:5141/images/${product.imageUrl}`}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            color="text.secondary"
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="secondary">
            {currenyTRY.format(product.price)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            loadingPosition="start"
            startIcon={<AddShoppingCart />}
            // loading={loading} before thunk
            loading={status === "pendingAddItem" + product.id} //using redux thunk
            // onClick={() => handleAddItem(product.id)} //before thunk
            onClick={() => dispatch(addItemToCart({ productId: product.id }))} //using redux thunk
          >
            Add to cart
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Search />}
            color="primary"
            component={Link}
            to={`/catalog/${product.id}`}
          >
            View
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default Product;
