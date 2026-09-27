import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Save,
  Eye,
  Crown,
  Sparkles,
  Layers,
  Award,
  Star,
  BookOpen,
  Upload,
  Image,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../services/apiConfig";
import homepageApi from "../../services/homepageApi";

function AdminHomepage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState({
    // 1. Top Banner & Headline
    heroSealBadge: "✦ By Jayant Saree Center • Curated Ethnic Wear ✦",
    heroTitle: "A Symphony of Heritage & Grace",
    heroHighlightWord: "Heritage",
    heroSubtitle:
      "Curated designer sarees, festive silks, and elegant cotton drapes from the trusted house of Jayant Saree Center.",
    primaryButtonText: "Explore Collection",
    primaryButtonLink: "/products",
    secondaryButtonText: "Watch Draping Reels",
    secondaryButtonLink: "/reels",
    active: true,

    // 2. Palace Archways (3 Jharokha Showcases)
    archway1Badge: "👑 Banarasi Saree",
    archway1Title: "Pure Zari Weave • Heritage Red",
    archway1Link: "/products?search=banarasi",
    archway1Image1: "",
    archway1Image2: "",

    archway2Badge: "✨ The Atelier Signature",
    archway2Tagline: "Exclusive Saree Edit",
    archway2Title: "Curated Chanderi & Festive Silk",
    archway2Link: "/products?search=chanderi",
    archway2Image1: "",
    archway2Image2: "",

    archway3Badge: "Mulmul Cotton",
    archway3Title: "Breathable Weave • Emerald Drape",
    archway3Link: "/products?search=mulmul",
    archway3Image1: "",
    archway3Image2: "",

    // 3. Trust Badges & Statistics Bar
    stat1Value: "1 Lakh+",
    stat1Label: "Patrons Draped Worldwide",
    stat2Value: "100% Inspected",
    stat2Label: "Curated Designer Sarees",
    stat3Value: "Jayant Saree Center",
    stat3Label: "Retail Trust & Heritage",
    stat4Value: "Complimentary",
    stat4Label: "Pan-India Express Shipping",

    // 4. Curated Saree Catalog Section
    sareesSectionBadge: "Curated Atelier",
    sareesSectionTitle: "New Arrivals",
    sareesSectionSubtitle:
      "Handpicked elegance crafted for everyday comfort and sacred celebratory moments.",
    viewAllButtonText: "View Full Gallery",

    // 5. Customer Testimonials & Reviews
    reviewsSectionBadge: "Voices of Patrons",
    reviewsSectionTitle: "What Our Customers Say",
    reviewsSectionSubtitle:
      "Cherished memories styled into every drape, shared by discerning women across the globe.",

    // 6. Brand Heritage & Story
    heritageTitle: "The Jayant Saree Center Legacy",
    heritageSubtitle:
      "From our cherished retail flagship Jayant Saree Center to our online boutique Ethnique, bringing timeless Indian ethnic wear and designer sarees to every celebration.",
    heritageStory:
      "Founded as Jayant Saree Center, our journey began with a simple yet enduring promise: to offer women the most exquisite ethnic wear, bridal drapes, and festive sarees under one roof with uncompromised quality and heartfelt personal service.",
    heritagePhilosophy:
      "Over the years, our brick-and-mortar boutique earned the trust of thousands of families for weddings, festivals, and milestone occasions. To take this legacy forward into the modern era, we created Ethnique By Jayant — our contemporary digital destination delivering our finest curated sarees across India.",
    foundingYear: "1978",
    location: "Varanasi, India",
  });

  useEffect(() => {
    loadHomepage();
  }, []);

  const loadHomepage = async () => {
    try {
      setLoading(true);
      const data = await homepageApi.getHomepage();

      if (data) {
        setForm((prev) => ({
          ...prev,
          heroSealBadge: data.heroSealBadge ?? prev.heroSealBadge,
          heroTitle: data.heroTitle ?? data.title ?? prev.heroTitle,
          heroHighlightWord: data.heroHighlightWord ?? prev.heroHighlightWord,
          heroSubtitle: data.heroSubtitle ?? data.subtitle ?? prev.heroSubtitle,
          primaryButtonText: data.primaryButtonText ?? data.buttonText ?? prev.primaryButtonText,
          primaryButtonLink: data.primaryButtonLink ?? data.buttonLink ?? prev.primaryButtonLink,
          secondaryButtonText: data.secondaryButtonText ?? prev.secondaryButtonText,
          secondaryButtonLink: data.secondaryButtonLink ?? prev.secondaryButtonLink,
          active: data.active ?? true,

          archway1Badge: data.archway1?.badge ?? data.archway1Badge ?? prev.archway1Badge,
          archway1Title: data.archway1?.title ?? data.archway1Title ?? prev.archway1Title,
          archway1Link: data.archway1?.link ?? data.archway1Link ?? prev.archway1Link,
          archway1Image1: data.archway1?.image1 ?? data.archway1Image1 ?? prev.archway1Image1,
          archway1Image2: data.archway1?.image2 ?? data.archway1Image2 ?? prev.archway1Image2,

          archway2Badge: data.archway2?.badge ?? data.archway2Badge ?? prev.archway2Badge,
          archway2Tagline: data.archway2?.tagline ?? data.archway2Tagline ?? prev.archway2Tagline,
          archway2Title: data.archway2?.title ?? data.archway2Title ?? prev.archway2Title,
          archway2Link: data.archway2?.link ?? data.archway2Link ?? prev.archway2Link,
          archway2Image1: data.archway2?.image1 ?? data.archway2Image1 ?? prev.archway2Image1,
          archway2Image2: data.archway2?.image2 ?? data.archway2Image2 ?? prev.archway2Image2,

          archway3Badge: data.archway3?.badge ?? data.archway3Badge ?? prev.archway3Badge,
          archway3Title: data.archway3?.title ?? data.archway3Title ?? prev.archway3Title,
          archway3Link: data.archway3?.link ?? data.archway3Link ?? prev.archway3Link,
          archway3Image1: data.archway3?.image1 ?? data.archway3Image1 ?? prev.archway3Image1,
          archway3Image2: data.archway3?.image2 ?? data.archway3Image2 ?? prev.archway3Image2,

          stat1Value: data.stat1Value ?? prev.stat1Value,
          stat1Label: data.stat1Label ?? prev.stat1Label,
          stat2Value: data.stat2Value ?? prev.stat2Value,
          stat2Label: data.stat2Label ?? prev.stat2Label,
          stat3Value: data.stat3Value ?? prev.stat3Value,
          stat3Label: data.stat3Label ?? prev.stat3Label,
          stat4Value: data.stat4Value ?? prev.stat4Value,
          stat4Label: data.stat4Label ?? prev.stat4Label,

          sareesSectionBadge: data.sareesSectionBadge ?? prev.sareesSectionBadge,
          sareesSectionTitle: data.sareesSectionTitle ?? prev.sareesSectionTitle,
          sareesSectionSubtitle: data.sareesSectionSubtitle ?? prev.sareesSectionSubtitle,
          viewAllButtonText: data.viewAllButtonText ?? prev.viewAllButtonText,

          reviewsSectionBadge: data.reviewsSectionBadge ?? prev.reviewsSectionBadge,
          reviewsSectionTitle: data.reviewsSectionTitle ?? prev.reviewsSectionTitle,
          reviewsSectionSubtitle: data.reviewsSectionSubtitle ?? prev.reviewsSectionSubtitle,

          heritageTitle: data.heritageTitle ?? prev.heritageTitle,
          heritageSubtitle: data.heritageSubtitle ?? prev.heritageSubtitle,
          heritageStory: data.heritageStory ?? prev.heritageStory,
          heritagePhilosophy: data.heritagePhilosophy ?? prev.heritagePhilosophy,
          foundingYear: data.foundingYear ?? prev.foundingYear,
          location: data.location ?? prev.location,
        }));
      }
    } catch (err) {
      toast.error("Could not load homepage data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = async (file, fieldKey) => {
    if (!file) return;
    try {
      setUploadingPhoto(true);
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${API_BASE}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("adminToken") || localStorage.getItem("token")
          }`,
        },
        body: fd,
      });
      const data = await res.json();
      const uploadedUrl =
        data?.imageUrl || (data?.imageUrls && data?.imageUrls[0]) || data?.url;
      if (uploadedUrl) {
        setForm((prev) => ({ ...prev, [fieldKey]: uploadedUrl }));
        toast.success("Photo uploaded to Cloudinary successfully!");
      } else {
        toast.error("Upload failed: " + (data?.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Upload error: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        title: form.heroTitle,
        subtitle: form.heroSubtitle,
        buttonText: form.primaryButtonText,
        buttonLink: form.primaryButtonLink,
        archway1: {
          badge: form.archway1Badge,
          title: form.archway1Title,
          link: form.archway1Link,
          image1: form.archway1Image1,
          image2: form.archway1Image2,
        },
        archway2: {
          badge: form.archway2Badge,
          tagline: form.archway2Tagline,
          title: form.archway2Title,
          link: form.archway2Link,
          image1: form.archway2Image1,
          image2: form.archway2Image2,
        },
        archway3: {
          badge: form.archway3Badge,
          title: form.archway3Title,
          link: form.archway3Link,
          image1: form.archway3Image1,
          image2: form.archway3Image2,
        },
      };

      const res = await homepageApi.updateHomepage(payload);
      if (res.success || res._id || res.heroTitle) {
        toast.success("Homepage successfully updated and live on storefront! 🎉");
      } else {
        toast.error(res.message || "Failed to update homepage");
      }
    } catch (err) {
      toast.error("Error saving homepage: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      id: "hero",
      label: "1. Top Banner & Headline",
      icon: Crown,
      description: "Main royal headline, highlighted word, subtitle, seal badge & buttons",
    },
    {
      id: "archways",
      label: "2. Three Palace Archways",
      icon: Layers,
      description: "Banarasi, Signature & Mulmul showcase cards (photos, badges & links)",
    },
    {
      id: "stats",
      label: "3. Trust & Statistics Bar",
      icon: Award,
      description: "The 4 proof counters (Patrons, 100% Inspected, JSC Heritage, Free Delivery)",
    },
    {
      id: "catalog",
      label: "4. Saree Catalog Showcase",
      icon: Sparkles,
      description: "Section title, story description, and select the 6 sarees displayed on homepage",
    },
    {
      id: "heritage",
      label: "5. About Jayant Saree Center",
      icon: BookOpen,
      description: "Founding year, Varanasi location, boutique history & trust philosophy",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-[#6D1830]/10 text-[#6D1830] dark:text-[#E5C583]">
              <Crown size={22} />
            </span>
            <span className="text-xs font-semibold tracking-[2px] uppercase text-[#6D1830] dark:text-[#E5C583]">
              Storefront Customizer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF]">
            Homepage Content Editor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Easily edit every text, headline, photo, button, and story section on your website.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-gray-700 dark:text-gray-300 hover:bg-gray-50 text-xs font-semibold transition"
          >
            <Eye size={15} />
            <span>Preview Storefront</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6D1830] hover:bg-[#571225] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Relatable Section Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                isActive
                  ? "bg-[#6D1830] text-white border-[#6D1830] shadow-md scale-[1.02]"
                  : "bg-white dark:bg-[#18101C] text-gray-700 dark:text-gray-300 border-[#E8E2DC]/80 dark:border-[#2C1F32] hover:border-[#6D1830]/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`p-2 rounded-xl ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[#6D1830]/10 text-[#6D1830] dark:text-[#E5C583]"
                  }`}
                >
                  <Icon size={16} />
                </span>
                {isActive && <CheckCircle2 size={14} className="text-white/80" />}
              </div>
              <p className="text-xs font-bold leading-tight line-clamp-1">{tab.label}</p>
            </button>
          );
        })}
      </div>

      {/* Editor Container */}
      <form onSubmit={handleSave} className="bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] space-y-6">
        
        {/* ========================================================
            TAB 1: TOP BANNER & MAIN HEADLINE
            ======================================================== */}
        {activeTab === "hero" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-[#2C1F32] pb-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                <Crown size={18} className="text-[#6D1830] dark:text-[#E5C583]" />
                Top Banner &amp; Main Headline
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Customize the main royal headline, announcement badge, and action buttons shown at the top of your website.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Announcement Seal Badge (Small top pill)
                </label>
                <input
                  type="text"
                  name="heroSealBadge"
                  value={form.heroSealBadge}
                  onChange={handleChange}
                  placeholder="e.g. ✦ By Jayant Saree Center • Curated Ethnic Wear ✦"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#6D1830]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Highlighted Word (Golden cursive accent)
                </label>
                <input
                  type="text"
                  name="heroHighlightWord"
                  value={form.heroHighlightWord}
                  onChange={handleChange}
                  placeholder="e.g. Heritage"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#6D1830]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Main Grand Title
              </label>
              <input
                type="text"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                placeholder="e.g. A Symphony of Heritage & Grace"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100 font-serif text-lg focus:outline-none focus:border-[#6D1830]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Hero Subtitle Description
              </label>
              <textarea
                name="heroSubtitle"
                rows={3}
                value={form.heroSubtitle}
                onChange={handleChange}
                placeholder="Describe your saree collection in 1-2 graceful sentences..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#6D1830]"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-4 rounded-2xl border border-gray-100 dark:border-[#2C1F32] bg-gray-50/30 dark:bg-[#120B15]/40 space-y-3">
                <p className="text-xs font-bold text-[#6D1830] dark:text-[#E5C583] uppercase tracking-wider">
                  Primary Button (Maroon Gradient)
                </p>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="primaryButtonText"
                    value={form.primaryButtonText}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Destination URL / Page Link
                  </label>
                  <input
                    type="text"
                    name="primaryButtonLink"
                    value={form.primaryButtonLink}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-gray-100 dark:border-[#2C1F32] bg-gray-50/30 dark:bg-[#120B15]/40 space-y-3">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Secondary Button (Outlined Play)
                </p>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="secondaryButtonText"
                    value={form.secondaryButtonText}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Destination URL / Page Link
                  </label>
                  <input
                    type="text"
                    name="secondaryButtonLink"
                    value={form.secondaryButtonLink}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: THREE PALACE ARCHWAYS SHOWCASE
            ======================================================== */}
        {activeTab === "archways" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-[#2C1F32] pb-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                <Layers size={18} className="text-[#6D1830] dark:text-[#E5C583]" />
                Three Palace Archways (Jharokha Showcases)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Customize the 3 arched photo displays. You can upload custom photos from your computer or paste image links.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Archway 1: Left */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/40 dark:bg-[#140D18] space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#2C1F32] pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-[#FAF5EF]">
                    Left Arch (Banarasi Saree)
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Top Badge Name
                  </label>
                  <input
                    type="text"
                    name="archway1Badge"
                    value={form.archway1Badge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Bottom Caption
                  </label>
                  <input
                    type="text"
                    name="archway1Title"
                    value={form.archway1Title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Click Destination Link
                  </label>
                  <input
                    type="text"
                    name="archway1Link"
                    value={form.archway1Link}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs font-mono text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-2 pt-1 border-t border-gray-200 dark:border-[#2C1F32]">
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    Slide Photo 1 (Image URL or Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="archway1Image1"
                      value={form.archway1Image1}
                      onChange={handleChange}
                      placeholder="Paste image link or upload"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                    />
                    <label className="cursor-pointer px-3 py-1.5 bg-[#6D1830]/10 hover:bg-[#6D1830]/20 text-[#6D1830] dark:text-[#E5C583] rounded-xl text-xs font-semibold flex items-center gap-1 transition">
                      <Upload size={12} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e.target.files?.[0], "archway1Image1")}
                      />
                    </label>
                  </div>
                  {form.archway1Image1 && (
                    <img
                      src={form.archway1Image1}
                      alt="Left Arch Preview"
                      className="h-20 w-full object-cover rounded-xl border border-gray-200 dark:border-[#2C1F32]"
                    />
                  )}
                </div>
              </div>

              {/* Archway 2: Center Masterpiece */}
              <div className="p-5 rounded-2xl border-2 border-[#D4B483]/60 dark:border-[#E5C583]/40 bg-amber-50/20 dark:bg-[#1B1120] space-y-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#D4B483]/40 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="font-serif font-bold text-sm text-[#6D1830] dark:text-[#E5C583]">
                    Center Arch (Signature Atelier)
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Crown Top Badge
                  </label>
                  <input
                    type="text"
                    name="archway2Badge"
                    value={form.archway2Badge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Sub-tag / Collection Tag
                  </label>
                  <input
                    type="text"
                    name="archway2Tagline"
                    value={form.archway2Tagline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Bottom Caption
                  </label>
                  <input
                    type="text"
                    name="archway2Title"
                    value={form.archway2Title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-2 pt-1 border-t border-gray-200 dark:border-[#2C1F32]">
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    Slide Photo 1 (Image URL or Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="archway2Image1"
                      value={form.archway2Image1}
                      onChange={handleChange}
                      placeholder="Paste image link or upload"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                    />
                    <label className="cursor-pointer px-3 py-1.5 bg-[#6D1830]/10 hover:bg-[#6D1830]/20 text-[#6D1830] dark:text-[#E5C583] rounded-xl text-xs font-semibold flex items-center gap-1 transition">
                      <Upload size={12} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e.target.files?.[0], "archway2Image1")}
                      />
                    </label>
                  </div>
                  {form.archway2Image1 && (
                    <img
                      src={form.archway2Image1}
                      alt="Center Arch Preview"
                      className="h-20 w-full object-cover rounded-xl border border-gray-200 dark:border-[#2C1F32]"
                    />
                  )}
                </div>
              </div>

              {/* Archway 3: Right */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/40 dark:bg-[#140D18] space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#2C1F32] pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-[#FAF5EF]">
                    Right Arch (Mulmul Cotton)
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Top Badge Name
                  </label>
                  <input
                    type="text"
                    name="archway3Badge"
                    value={form.archway3Badge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Bottom Caption
                  </label>
                  <input
                    type="text"
                    name="archway3Title"
                    value={form.archway3Title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Click Destination Link
                  </label>
                  <input
                    type="text"
                    name="archway3Link"
                    value={form.archway3Link}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs font-mono text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-2 pt-1 border-t border-gray-200 dark:border-[#2C1F32]">
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    Slide Photo 1 (Image URL or Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="archway3Image1"
                      value={form.archway3Image1}
                      onChange={handleChange}
                      placeholder="Paste image link or upload"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-900 dark:text-gray-100"
                    />
                    <label className="cursor-pointer px-3 py-1.5 bg-[#6D1830]/10 hover:bg-[#6D1830]/20 text-[#6D1830] dark:text-[#E5C583] rounded-xl text-xs font-semibold flex items-center gap-1 transition">
                      <Upload size={12} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e.target.files?.[0], "archway3Image1")}
                      />
                    </label>
                  </div>
                  {form.archway3Image1 && (
                    <img
                      src={form.archway3Image1}
                      alt="Right Arch Preview"
                      className="h-20 w-full object-cover rounded-xl border border-gray-200 dark:border-[#2C1F32]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: TRUST & STATISTICS BAR
            ======================================================== */}
        {activeTab === "stats" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-[#2C1F32] pb-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                <Award size={18} className="text-[#6D1830] dark:text-[#E5C583]" />
                Trust &amp; Statistics Bar (4 Counters)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Customize the 4 proof metrics shown right under the archway gallery to build customer trust.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/40 dark:bg-[#120B15] space-y-3">
                <span className="text-xs font-bold text-[#6D1830] dark:text-[#E5C583]">Counter 1</span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Value / Number
                  </label>
                  <input
                    type="text"
                    name="stat1Value"
                    value={form.stat1Value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-sm font-bold text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description Label
                  </label>
                  <input
                    type="text"
                    name="stat1Label"
                    value={form.stat1Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/40 dark:bg-[#120B15] space-y-3">
                <span className="text-xs font-bold text-[#6D1830] dark:text-[#E5C583]">Counter 2</span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Value / Number
                  </label>
                  <input
                    type="text"
                    name="stat2Value"
                    value={form.stat2Value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-sm font-bold text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description Label
                  </label>
                  <input
                    type="text"
                    name="stat2Label"
                    value={form.stat2Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/40 dark:bg-[#120B15] space-y-3">
                <span className="text-xs font-bold text-[#6D1830] dark:text-[#E5C583]">Counter 3</span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Value / Title
                  </label>
                  <input
                    type="text"
                    name="stat3Value"
                    value={form.stat3Value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-sm font-bold text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description Label
                  </label>
                  <input
                    type="text"
                    name="stat3Label"
                    value={form.stat3Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/40 dark:bg-[#120B15] space-y-3">
                <span className="text-xs font-bold text-[#6D1830] dark:text-[#E5C583]">Counter 4</span>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Value / Title
                  </label>
                  <input
                    type="text"
                    name="stat4Value"
                    value={form.stat4Value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-sm font-bold text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description Label
                  </label>
                  <input
                    type="text"
                    name="stat4Label"
                    value={form.stat4Label}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-white dark:bg-[#18101C] text-xs text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: CURATED SAREE CATALOG SECTION
            ======================================================== */}
        {activeTab === "catalog" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-[#2C1F32] pb-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                <Sparkles size={18} className="text-[#6D1830] dark:text-[#E5C583]" />
                Curated Saree Catalog Section (Products Grid Header)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Customize the titles, badge, and intro text that sit directly above your saree product catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Section Badge Label (Small Gold Pill)
                </label>
                <input
                  type="text"
                  name="sareesSectionBadge"
                  value={form.sareesSectionBadge}
                  onChange={handleChange}
                  placeholder="e.g. Curated Atelier"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  name="sareesSectionTitle"
                  value={form.sareesSectionTitle}
                  onChange={handleChange}
                  placeholder="e.g. New Arrivals"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm font-serif text-lg text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Story Subtitle Description
              </label>
              <textarea
                name="sareesSectionSubtitle"
                rows={2}
                value={form.sareesSectionSubtitle}
                onChange={handleChange}
                placeholder="e.g. Handpicked elegance crafted for everyday comfort and sacred celebratory moments."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                "View All" Button Text (Link to /products)
              </label>
              <input
                type="text"
                name="viewAllButtonText"
                value={form.viewAllButtonText}
                onChange={handleChange}
                placeholder="e.g. View Full Gallery"
                className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Homepage 6 Sarees Selection Callout */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-[#D4B483] dark:border-[#5C3F20] bg-[#FAF8F5]/80 dark:bg-[#18101C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="font-serif font-bold text-sm text-gray-900 dark:text-[#FAF5EF]">
                    Featured Homepage Sarees (Max 6)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                    Curated 6 Sarees
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xl">
                  You can pick exactly which 6 sarees appear in the showcase grid on your homepage. In the Products Catalog, simply toggle <strong>&quot;Show on Homepage&quot;</strong> on your favorite 6 sarees.
                </p>
              </div>

              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] text-[#FAF6F0] text-xs font-semibold hover:opacity-95 transition shadow-sm shrink-0"
              >
                <Sparkles size={14} className="text-[#E5C583]" />
                <span>Choose 6 Sarees in Products &rarr;</span>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ABOUT JAYANT SAREE CENTER & STORY
            ======================================================== */}
        {activeTab === "heritage" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-[#2C1F32] pb-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
                <BookOpen size={18} className="text-[#6D1830] dark:text-[#E5C583]" />
                About Jayant Saree Center &amp; Brand Story
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your boutique's founding year, Varanasi heritage story, and trust philosophy shown on your About page and storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Heritage Story Title
                </label>
                <input
                  type="text"
                  name="heritageTitle"
                  value={form.heritageTitle}
                  onChange={handleChange}
                  placeholder="e.g. The Jayant Saree Center Legacy"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm font-serif text-lg text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Founding Year &amp; Flagship Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="foundingYear"
                    value={form.foundingYear}
                    onChange={handleChange}
                    placeholder="e.g. 1978"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Varanasi, India"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Legacy Subtitle
              </label>
              <textarea
                name="heritageSubtitle"
                rows={2}
                value={form.heritageSubtitle}
                onChange={handleChange}
                placeholder="From our cherished retail flagship Jayant Saree Center to our online boutique Ethnique..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Full Founding Story Paragraph
              </label>
              <textarea
                name="heritageStory"
                rows={4}
                value={form.heritageStory}
                onChange={handleChange}
                placeholder="Describe how the boutique began, the craftsmanship, and your commitment to customers..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Our Philosophy &amp; Future Vision
              </label>
              <textarea
                name="heritagePhilosophy"
                rows={3}
                value={form.heritagePhilosophy}
                onChange={handleChange}
                placeholder="How the brand carries traditional weaving into modern digital commerce..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2C1F32] bg-gray-50/50 dark:bg-[#120B15] text-sm text-gray-900 dark:text-gray-100 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-6 border-t border-gray-100 dark:border-[#2C1F32] flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Changes apply in real-time across your live website immediately upon saving.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6D1830] hover:bg-[#571225] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? "Saving Changes..." : "Save Homepage"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminHomepage;
