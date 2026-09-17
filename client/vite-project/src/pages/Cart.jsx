import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLoyalty } from "../context/LoyaltyContext";
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Gift,
  Crown,
  Scissors,
} from "lucide-react";
import toast from "react-hot-toast";

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const { user } = useAuth();
  const { points } = useLoyalty();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed with checkout", { icon: "🔒" });
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.priceINR * item.quantity,
    0
  );

  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const estimatedPoints = Math.max(1, Math.floor(subtotal / 10));

  return (
    <div className="bg-[#FAF7F5] dark:bg-[#120B15] min-h-screen text-[var(--text-primary)] transition-colors duration-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2B2523] dark:text-[#FAF5EF]">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Curated drapes by Jayant Saree Center • Insured Pan-India Dispatch
            </p>
          </div>
          {cart.length > 0 && (
            <Link
              to="/products"
              className="text-xs font-semibold text-[#8B1E3F] dark:text-[#E5C583] hover:underline"
            >
              Continue Shopping →
            </Link>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#18101C] rounded-3xl border border-gray-100 dark:border-[#2C1F32] shadow-sm max-w-2xl mx-auto p-8">
            <div className="w-20 h-20 rounded-full bg-[#8B1E3F]/10 dark:bg-[#E5C583]/10 text-[#8B1E3F] dark:text-[#E5C583] flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={36} />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-[#FAF5EF]">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
              Explore our bridal, festive, pure cotton, and designer silk sarees finished and ready to drape.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Express Shipping Progress Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#18101C] border border-gray-100 dark:border-[#2C1F32] shadow-sm">
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Truck size={15} className="text-[#8B1E3F] dark:text-[#E5C583]" />
                    {isFreeShipping ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        🎉 You've unlocked Standard Insured Express Delivery Across India!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-[#8B1E3F] dark:text-[#E5C583]">₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</strong> more for Standard Delivery
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-gray-500">{shippingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-[#201426] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B8860B] via-[#E8C58D] to-[#8B1E3F] rounded-full transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-5 bg-white dark:bg-[#18101C] p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-[#2C1F32] shadow-sm hover:border-[#D4B483]/60 transition"
                >
                  <Link
                    to={`/products/${item._id}`}
                    className="w-full sm:w-28 h-36 sm:h-36 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#1D1322] flex-shrink-0"
                  >
                    <img
                      src={item.images?.[0] || "https://res.cloudinary.com/djs5fhvwd/image/upload/v1783179793/product8.1_w6x0lq.png"}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8B1E3F] dark:text-[#E5C583]">
                            Designer Drape
                          </span>
                          <Link
                            to={`/products/${item._id}`}
                            className="font-serif font-semibold text-lg text-gray-900 dark:text-white hover:text-[#8B1E3F] transition line-clamp-1 block mt-0.5"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <span className="font-serif text-lg font-bold text-[#8B1E3F] dark:text-[#E5C583]">
                          {formatPrice(item.priceINR * item.quantity)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {item.fabric && <span>Fabric: {item.fabric}</span>}
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Check size={12} /> Pure Weave Handcrafted
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-[#2C1F32]">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 dark:border-[#38283E] rounded-full bg-gray-50 dark:bg-[#201426] px-2 py-1">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item._id)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item._id)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black font-bold text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(item._id);
                          toast("Item removed from bag");
                        }}
                        className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-[#18101C] p-6 sm:p-7 rounded-3xl border border-gray-100 dark:border-[#2C1F32] shadow-sm sticky top-24">
                <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cart.length} drapes)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Insured Express Shipping</span>
                    <span className={isFreeShipping ? "text-emerald-600 font-semibold" : "font-medium"}>
                      {isFreeShipping ? "FREE" : "₹99"}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Quality Inspection</span>
                    <span className="text-emerald-600 font-semibold">PASSED</span>
                  </div>

                  {/* Estimated Points */}
                  <div className="pt-2">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Crown size={14} className="text-amber-600" />
                        <span>Club Points Earned</span>
                      </span>
                      <span className="font-bold font-mono">+{estimatedPoints} pts</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-[#2C1F32] pt-4 flex justify-between text-lg font-serif font-bold text-gray-900 dark:text-white">
                    <span>Estimated Total</span>
                    <span className="text-[#8B1E3F] dark:text-[#E5C583]">
                      {formatPrice(subtotal + (isFreeShipping ? 0 : 99))}
                    </span>
                  </div>
                </div>

                {/* Coupon prompt link */}
                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-[#201426] border border-gray-100 dark:border-[#38283E] text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Have a coupon code or Clan Points?
                  </p>
                  <span className="text-xs font-semibold text-[#8B1E3F] dark:text-[#E5C583] mt-0.5 block">
                    Apply them at the next checkout step
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full mt-5 py-4 rounded-2xl bg-[#8B1E3F] hover:bg-[#721833] text-white text-xs font-semibold uppercase tracking-wider transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </button>

                {/* Assurance notice */}
                <div className="mt-4 text-center text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>100% Genuine Quality Guarantee • Jayant Saree Center</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;