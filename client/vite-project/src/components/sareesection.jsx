import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom"; 
import {
  useEffect,
  useState,
  useContext,
} from "react";
import { WishlistContext } from "../context/Wishlistcontext";
import { CartContext } from "../context/CartContext";
import {
  CountryContext,
} from "../context/CoutryContext";
import { API_BASE } from "../services/apiConfig.js";



function SareeSection() {
  const { formatPrice } =
  useContext(CountryContext);
  const [products, setProducts] = useState([]);
  const { addToWishlist } =
  useContext(WishlistContext);
  const [featuredSection, setFeaturedSection] =
  useState(null);


const { addToCart } =
  useContext(CartContext);

  useEffect(() => {
    fetchProducts();
    fetchFeaturedSection();
  }, []); 

const fetchFeaturedSection = async () => {
  try {
    const response =
      await fetch(`${API_BASE}/homepage`)

    const data =
      await response.json();

    console.log("HOMEPAGE DATA:", data);

    setFeaturedSection(data);

  } catch (error) {
    console.log(
      "HOMEPAGE ERROR:",
      error
    );
  }
};


  const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE}/products`)

    const data = await response.json();

    console.log("DATA:", data);

    if (data.success) {
  setProducts(data.products);
} else {
  setProducts([]);
}
  } catch (error) {
    console.log("FETCH ERROR:", error);
  }
};
console.log("FEATURED:", featuredSection);
// console.log(products);
  return (
    <section
      id="featured-sarees"
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="flex justify-between items-center mb-4">

  <div>
    <h2 className="text-4xl font-bold">
      New Arrivals
    </h2>

    <p className="text-gray-500 mt-2">
      Handpicked elegance crafted for everyday comfort.
    </p>
  </div>

  <Link
    to="/products"
    className="
      text-sm
      font-semibold
      text-[#8B1E3F]
      hover:underline
    "
  >
    Explore →
  </Link>

</div>
      <div className="grid md:grid-cols-4 gap-8 items-start">
        <div
  className="
    md:col-span-2
    relative
    rounded-3xl
    overflow-hidden
    min-h-[650px]
  "
>

  {featuredSection?.videoUrl && (
  <video
    autoPlay
    muted
    loop
    playsInline
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
  >
    <source
      src={featuredSection.videoUrl}
      type="video/mp4"
    />
  </video>
)}

  <div
    className="
      absolute
      inset-0
      bg-black/30
      flex
      flex-col
      justify-end
      p-10
      text-white
    "
  >

    <span className="tracking-[4px] uppercase text-sm">
      Ethnique By Jayant
    </span>

    <h3 className="text-5xl font-serif mt-3">
      {featuredSection?.title}
    </h3>

    <p className="mt-4 max-w-sm">
      {featuredSection?.subtitle}
    </p>

    <Link
  to={featuredSection?.buttonLink}
  className="
    mt-6
    bg-white
    text-black
    px-6
    py-3
    rounded-full
    w-fit
  "
>
  {featuredSection?.buttonText}
</Link>

  </div>
</div>
        {products.slice(0, 6).map((product) => (
  <Link
    to="/products"
    key={product._id}
    className="
  group
  bg-white
  rounded-3xl
  overflow-hidden
  border
  border-[#EFE8DF]
  hover:shadow-2xl
  hover:-translate-y-2
  transition-all
  duration-500
"
  >
   <div
  className="
    relative
    h-[420px]
    overflow-hidden
    group
  "
>

  {/* Main Image */}
  <img
    src={product.images?.[0]}
    alt={product.name}
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      transition-all
      duration-700
      group-hover:opacity-0
      group-hover:scale-105
    "
  />

  {/* Hover Image */}
  <img
    src={product.images?.[1] || product.images?.[0]}
    alt={product.name}
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      opacity-0
      transition-all
      duration-700
      group-hover:opacity-100
      group-hover:scale-105
    "
  />

  {/* Collection Tag */}
  <div
    className="
      absolute
      top-4
      left-4
      bg-white/90
      backdrop-blur
      px-3
      py-1
      rounded-full
      text-xs
      font-medium
    "
  >
    NEW
  </div>

  {/* Quick View */}
  <button
    className="
      absolute
      bottom-5
      left-1/2
      -translate-x-1/2
      bg-white
      text-black
      px-5
      py-2
      rounded-full
      text-sm
      shadow-lg
      opacity-0
      group-hover:opacity-100
      transition-all
      duration-300
    "
  >
    Quick View
  </button>

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

        <div className="flex gap-2">
          <button
  onClick={(e) => {
    e.preventDefault();
    addToWishlist(product);
  }}
  className="
    p-2
    rounded-full
    hover:bg-pink-100
  "
>
  <Heart size={18} />
</button>

<button
  onClick={(e) => {
    e.preventDefault();
    addToCart(product);
  }}
  className="
    p-2
    rounded-full
    hover:bg-gray-100
  "
>
  <ShoppingCart size={18} />
</button>
        </div>
      </div>
    </div>
  </Link>
))}
      </div>
    </section>
  );
}

export default SareeSection;