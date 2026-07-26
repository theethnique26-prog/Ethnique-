import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useContext,
} from "react";
import { API_BASE } from "../services/apiConfig.js";
import {
  CartContext,
} from "../context/CartContext";


import {
  WishlistContext
} from "../context/Wishlistcontext"; 
import toast from "react-hot-toast";

const formatPrice = (price) => {
return `₹${Number(price).toLocaleString("en-IN")}`;
};
function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const { addToCart } =
  useContext(CartContext);

const {
  addToWishlist
} = useContext(
  WishlistContext
);

  useEffect(() => {
  fetchProduct();
}, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/admin/products/${id}`
      );

      const data = await response.json();

      setProduct(data.product);
    } catch (error) {
      console.log(error);
    }
  };
if (!product) {
  return <h2>Loading...</h2>;
}
  return (
    <div className="max-w-7xl mx-auto p-10">

      <div className="grid md:grid-cols-2 gap-10">

        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full rounded-xl"
        />

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-2xl mt-4">
            {formatPrice(product.priceINR)}
          </p>

          <div className="mt-6 space-y-2">

            <p>
              <strong>Fabric:</strong>{" "}
              {product.fabric}
            </p>

            <p>
              <strong>Color:</strong>{" "}
              {product.color}
            </p>

            <p>
              <strong>Saree Length:</strong>{" "}
              {product.sareeLength}
            </p>

            <p>
              <strong>Blouse:</strong>{" "}
              {product.blouse}
            </p>

            <p>
              <strong>Collection:</strong>{" "}
              {product.collection}
            </p>

          </div>

          <p className="mt-6">
            {product.description}
          </p>

          <div className="flex gap-4 mt-8">
{/* cart  */}
       <button
  onClick={() => {
    addToCart(product);

    toast.success(
      "Added to Cart"
    );
  }}
>
  Add To Cart
</button>
{/* wishlist  */}
            <button
  onClick={() => {
    addToWishlist(product);

    toast.success(
      "Added to Wishlist"
    );
  }}
>
  Wishlist
</button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;