/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router";
// import { IProduct } from "../../Model/IProduct";
// import requests from "../../api/requests";
import NotFound from "../../errors/NotFound";
import { AddShoppingCart } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import { useCartContext } from "../../context/CartContext";
import { currenyTRY } from "../../utils/formatCurrency";

import { addItemToCart } from "../cart/cartSlice";
import { fetchProductById, selectProductById } from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function ProductDetailsPage() {
  // const { cart, setCart } = useCartContext(); context
  const { cart, status } = useAppSelector((state) => state.cart); //redux
  const dispatch = useAppDispatch(); //redux
  const { id } = useParams<{ id: string }>();
  //!before normalization (before adaptor)
  // const [product, setProduct] = useState<IProduct | null>(null);
  //!after normalization (after adaptor)
  const product = useAppSelector((state) =>
    selectProductById(state, Number(id))
  );
  const { status: loading } = useAppSelector((state) => state.catalog);
  // const [loading, setLoading] = useState(true);
  // const [isAdded, setIsAdded] = useState(false);

  const item = cart?.cartItems.find((i) => i.productId == product?.id);

  useEffect(() => {
    if (id) {
      //!before normalization
      // requests.Catalog.details(parseInt(id))
      //   .then((data) => setProduct(data))
      //   .catch((error) => console.log(error))
      //   .finally(() => setLoading(false));
      if (!product.id && id) dispatch(fetchProductById(parseInt(id)));
    }
  }, [id]);

  //!before thunk
  // function handleAddItem(id: number) {
  // setIsAdded(true);
  // requests.Cart.addItem(id)
  //   .then((cart) => {
  //     // setCart(cart);
  //     dispatch(setCart(cart)); //redux
  //     toast.success("Added to your cart.");
  //   })
  //   .catch((error) => console.log(error))
  //   .finally(() => setIsAdded(false));
  // }

  // if (loading) return <CircularProgress />;
  if (loading === "pendingFetchProductById") return <CircularProgress />;

  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid size={{ xl: 3, lg: 4, md: 5, sm: 6, xs: 12 }}>
        <img
          src={`http://localhost:5141/images/${product.imageUrl}`}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid size={{ xl: 9, lg: 8, md: 7, sm: 6, xs: 12 }}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          {currenyTRY.format(product.price)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center">
          <Button
            variant="outlined"
            loadingPosition="start"
            startIcon={<AddShoppingCart />}
            // loading={isAdded} before thunk
            loading={status === "pendingAddItem" + product.id} //using redux thunk
            // onClick={() => handleAddItem(product.id)} //before thunk
            onClick={() => dispatch(addItemToCart({ productId: product.id }))} //using thunk
          >
            Add to Cart
          </Button>

          {item?.quantity! > 0 && (
            <Typography variant="body2">
              Added {item?.quantity} to your cart.
            </Typography>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
