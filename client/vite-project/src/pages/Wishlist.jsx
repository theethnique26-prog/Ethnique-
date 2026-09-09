import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/Wishlistcontext";
import { CartContext } from "../context/CartContext";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item._id);
    toast.success(`${item.name} moved to your shopping bag!`, {
      icon: "🛍️",
      duration: 3000,
    });
  };

  const handleRemove = (itemId, itemName) => {
    removeFromWishlist(itemId);
    toast(`${itemName || "Item"} removed from wishlist`);
  };

  return (
    <div className="bg-[#FAF7F5] dark:bg-[#120B15] min-h-screen text-[var(--text-primary)] transition-colors duration-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[3px] uppercase text-[#8B1E3F] dark:text-[#E5C583] mb-1">
              <Sparkles size={13} />
              <span>Curated Favorites</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2B2523] dark:text-[#FAF5EF]">
              My Wishlist ({wishlist.length})
            </h1>
          </div>
          {wishlist.length > 0 && (
            <Link
              to="/products"
              className="text-xs font-semibold text-[#8B1E3F] dark:text-[#E5C583] hover:underline"
            >
              Explore More Sarees →
            </Link>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#18101C] rounded-3xl border border-gray-100 dark:border-[#2C1F32] shadow-sm max-w-2xl mx-auto p-8">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart size={36} />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-[#FAF5EF]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
              Save your favorite designer sarees here to keep track of festive drops, bridal drapes, and member discounts.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider transition shadow-md"
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-start">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="
                  group relative
                  bg-white dark:bg-[#18101C]
                  rounded-t-[36px] rounded-b-[24px]
                  overflow-hidden
                  border border-[#E8DFD3] dark:border-[#2C1F32]
                  hover:border-[#D4B483] dark:hover:border-[#E5C583]
                  shadow-sm hover:shadow-xl
                  hover:-translate-y-1.5
                  transition-all duration-400 flex flex-col justify-between
                "
              >
                {/* Image Stage */}
                <Link to={`/products/${item._id}`} className="relative h-[380px] sm:h-[400px] overflow-hidden bg-[#FAF6F0] dark:bg-[#1D1322] block">
                  <img
                    src={item.images?.[0] || "https://res.cloudinary.com/djs5fhvwd/image/upload/v1783179793/product8.1_w6x0lq.png"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item._id, item.name);
                    }}
                    aria-label="Remove from Wishlist"
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 dark:bg-[#18101C]/90 text-gray-500 hover:text-red-500 backdrop-blur-md shadow-md hover:scale-110 transition"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/95 dark:bg-[#18101C]/95 backdrop-blur-md border border-[#D4B483]/60 text-[#6D1830] dark:text-[#E5C583] text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                      Designer Edit
                    </span>
                  </div>
                </Link>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <Link
                      to={`/products/${item._id}`}
                      className="font-serif text-base font-semibold text-[#2B2523] dark:text-[#FAF5EF] hover:text-[#8B1E3F] dark:hover:text-[#E5C583] transition line-clamp-1 block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 font-light">
                      {item.fabric || "Jayant Saree Center Curated Saree"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0EAE1] dark:border-[#261D2B]">
                    <span className="font-serif text-xl font-bold text-[#8B1E3F] dark:text-[#E5C583]">
                      {formatPrice(item.priceINR)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="px-4 py-2 rounded-full bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 active:scale-95"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;