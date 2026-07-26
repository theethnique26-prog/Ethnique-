import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useContext
} from "react";

import {
  WishlistContext
} from "../context/Wishlistcontext";
import {
  CartContext
} from "../context/CartContext";
import toast from "react-hot-toast";

function AllProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { addToCart } =
      useContext(CartContext);
  const { addToWishlist } =
  useContext(WishlistContext);
  const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://ethnique-bmae.onrender.com/api/admin/products"
      );

      const data = await response.json();

      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );


  
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Hero Section */}
<div className="relative h-[300px] rounded-3xl overflow-hidden mb-10">

  <img
    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c"
    alt=""
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/40" />

  <div className="absolute inset-0 flex flex-col justify-center items-center text-white">

    <p className="uppercase tracking-[5px] mb-2">
      Ethnique By Jayant
    </p>

    <h1 className="text-5xl font-bold">
      Cotton Sarees
    </h1>

    <p className="mt-4 text-lg">
      Handcrafted Elegance For Every Occasion
    </p>

  </div>

</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

  <div className="bg-white p-5 rounded-xl shadow-sm text-center">
    <h3 className="text-2xl font-bold">
      {products.length}+
    </h3>
    <p className="text-gray-500">
      Designs
    </p>
  </div>

  <div className="bg-white p-5 rounded-xl shadow-sm text-center">
    <h3 className="text-2xl font-bold">
      100%
    </h3>
    <p className="text-gray-500">
      Cotton
    </p>
  </div>

  <div className="bg-white p-5 rounded-xl shadow-sm text-center">
    <h3 className="text-2xl font-bold">
      Handmade
    </h3>
    <p className="text-gray-500">
      Craftsmanship
    </p>
  </div>

  <div className="bg-white p-5 rounded-xl shadow-sm text-center">
    <h3 className="text-2xl font-bold">
      Free
    </h3>
    <p className="text-gray-500">
      Shipping
    </p>
  </div>

</div>

      {/* Search */}
      <div className="mb-8">

  <input
    type="text"
    placeholder="Search sarees..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="
      w-full
      border
      border-gray-200
      bg-white
      rounded-full
      px-6
      py-4
      shadow-sm
      focus:ring-2
      focus:ring-amber-700
      outline-none
    "
  />

</div>
<div className="flex gap-3 overflow-x-auto mb-10">

  {[
    "All",
    "Handloom",
    "Printed",
    "Office Wear",
    "Festive",
    "Premium Cotton"
  ].map((item) => (

    <button
      key={item}
      className="
        px-5
        py-2
        rounded-full
        border
        hover:bg-black
        hover:text-white
        transition
      "
    >
      {item}
    </button>

  ))}

</div>
<div className="flex justify-between items-center mb-8">

  <h2 className="font-medium text-gray-600">
    Showing {filteredProducts.length} Products
  </h2>

</div>
      {/* Product Grid */}
      <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-8
  "
>
        {filteredProducts.map((product) => (
          <div
  key={product._id}
  onClick={() =>
    navigate(
      `/products/${product._id}`
    )
  }
   className="
    relative
    group
    cursor-pointer
    bg-white
    rounded-2xl
    overflow-hidden
    border
    border-gray-100
    hover:shadow-2xl
    transition-all
    duration-500
  "
>
            <div className="overflow-hidden">

  <img
    src={product.images?.[0]}
    alt={product.name}
    className="
      w-full
      h-[500px]
      object-cover
      transition-transform
      duration-700
      group-hover:scale-110
    "
  />

</div>

            <div className="p-4">

              <h3 className="font-semibold">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {product.highlight}
              </p>

              <div className="flex justify-between items-center mt-4">

                <span className="font-bold text-lg">
                  {formatPrice(product.priceINR)}
                </span>

                <div className="flex gap-3">
{/* Wishlist */}
                  <button
  className="
    absolute
    top-4
    right-4
    bg-white
    p-2
    rounded-full
    shadow-md
  "

  onClick={(e) => {
    e.stopPropagation();

    addToWishlist(product);

    toast.success(
      "Added to Wishlist"
    );
  }}
>
  <Heart size={20} />
</button>
{/* cart */}
                  <button
  onClick={(e) => {
    e.stopPropagation();

    addToCart(product);

    toast.success(
      "Added to Cart"
    );
  }}
>
  <ShoppingCart size={20} />
</button>

                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          No sarees found.
        </div>
      )}
    </div>
  );
}

export default AllProducts;