import { useEffect } from "react";
// import { IProduct } from "../../Model/IProduct";
import ProductList from "./ProductList";
import { CircularProgress } from "@mui/material";
// import requests from "../../api/requests";

import { fetchProducts, selectAllProducts } from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function CatalogPage() {
  //!before normalization
  // const [products, setProducts] = useState<IProduct[]>([]);
  // const [loading, setLoading] = useState(true);

  //!after normalization
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts); //artık adaptör üzerinden bu bilgiler alınır.
  const { status, isLoaded } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    //!before normalization
    //   requests.Catalog.list() //axios request
    //     .then((data) => setProducts(data))
    //     .finally(() => setLoading(false));

    //!after normalization
    if (!isLoaded) dispatch(fetchProducts());
  }, [isLoaded]);

  if (status === "pendingFetchProducts") return <CircularProgress />;

  return <ProductList products={products} />;
}
