import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { API_BASE } from "../services/apiConfig";
import toast from "react-hot-toast";

const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user || null;
  } catch {
    user = null;
  }

  // Fallback to localStorage if not yet populated in context
  if (!user) {
    try {
      const stored = localStorage.getItem("user");
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }
  }

  const [points, setPoints] = useState(() => {
    return user?.loyaltyPoints !== undefined ? user.loyaltyPoints : 150;
  });

  const [tier, setTier] = useState({
    tierId: "insider",
    name: "Clan Insider",
    subtitle: "Level 1 • Auto Unlocked",
    badge: "Entry Tier",
    minPts: 0,
    nextTier: "Clan Elite",
    pointsNeeded: 350,
    progressPercent: 30,
    freeShippingAlways: false,
    perks: [
      "Free standard delivery on orders above ₹999",
      "Welcome voucher code FIRSTGLAM (₹200 OFF)",
      "Earn 1 Clan Point on every ₹10 spent",
    ],
  });

  const [canClaimBonus, setCanClaimBonus] = useState(true);
  const [nextClaimInHours, setNextClaimInHours] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sync points with user from AuthContext
  useEffect(() => {
    if (user?.loyaltyPoints !== undefined) {
      setPoints(user.loyaltyPoints);
    }
  }, [user]);

  // Fetch real loyalty status from backend
  const refreshLoyalty = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/loyalty/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.loyalty) {
          setPoints(data.loyalty.points);
          if (data.loyalty.tier) {
            setTier(data.loyalty.tier);
          }
          setCanClaimBonus(data.loyalty.canClaimBonus);
          setNextClaimInHours(data.loyalty.nextClaimInHours || 0);
        }
      }
    } catch (err) {
      console.error("Failed to load loyalty status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshLoyalty();
    }
  }, [user, refreshLoyalty]);

  // Claim Daily Bonus points (+50 pts)
  const claimDailyBonus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to claim Clan VIP points");
      return { success: false };
    }

    try {
      const res = await fetch(`${API_BASE}/loyalty/claim-bonus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPoints(data.points);
        if (data.tier) setTier(data.tier);
        setCanClaimBonus(false);
        setNextClaimInHours(24);
        toast.success(data.message || "✨ +50 Clan Points claimed successfully!", {
          icon: "👑",
          duration: 3500,
        });
        return { success: true, points: data.points };
      } else {
        toast.error(data.message || "Could not claim points at this moment");
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Claim bonus error:", err);
      toast.error("Network error while claiming points");
      return { success: false };
    }
  };

  // Local helper updater
  const addPoints = (amount) => {
    setPoints((prev) => prev + amount);
  };

  // Local helper redeemer
  const redeemPoints = (amount) => {
    setPoints((prev) => Math.max(prev - amount, 0));
  };

  return (
    <LoyaltyContext.Provider
      value={{
        points,
        tier,
        canClaimBonus,
        nextClaimInHours,
        loading,
        refreshLoyalty,
        claimDailyBonus,
        addPoints,
        redeemPoints,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => useContext(LoyaltyContext);