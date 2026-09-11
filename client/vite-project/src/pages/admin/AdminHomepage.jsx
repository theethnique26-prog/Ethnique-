import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  BadgeCheck,
  Video,
  BookOpen,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../services/apiConfig";
import homepageApi from "../../services/homepageApi";

function Homepage() {
  const [activeTab, setActiveTab] = useState("hero"); // 'hero' | 'heritage'

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    badge: "",
    videoUrl: "",
    buttonText: "",
    buttonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    active: true,
  });

  const [heritageForm, setHeritageForm] = useState({
    title: "The Jayant Saree Center Legacy",
    subtitle: "From our cherished retail flagship Jayant Saree Center to our online boutique Ethnique, bringing timeless Indian ethnic wear and designer sarees to every celebration.",
    story: "Founded as Jayant Saree Center, our journey began with a simple yet enduring promise: to offer women the most exquisite ethnic wear, bridal drapes, and festive sarees under one roof with uncompromised quality and heartfelt personal service.",
    philosophy: "Over the years, our brick-and-mortar boutique earned the trust of thousands of families for weddings, festivals, and milestone occasions. To take this legacy forward into the modern era, we created Ethnique By Jayant — our contemporary digital destination delivering our finest curated sarees across India.",
    foundingYear: "1978",
    location: "Varanasi, India",
  });

  const [loading, setLoading] = useState(false);
  const [savingHeritage, setSavingHeritage] = useState(false);

  useEffect(() => {
    loadHomepage();
    loadHeritage();
  }, []);

  const loadHomepage = async () => {
    try {
      const data = await homepageApi.getHomepage();

      if (data) {
        setForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          badge: data.badge || "",
          videoUrl: data.videoUrl || "",
          buttonText: data.buttonText || "",
          buttonLink: data.buttonLink || "",
          secondaryButtonText: data.secondaryButtonText || "",
          secondaryButtonLink: data.secondaryButtonLink || "",
          active: data.active ?? true,
        });
      }
    } catch (error) {
      toast.error("Unable to load homepage");
    }
  };

  const loadHeritage = async () => {
    try {
      const res = await fetch(`${API_BASE}/homepage/heritage`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.heritage) {
          setHeritageForm((prev) => ({ ...prev, ...data.heritage }));
        }
      }
    } catch (err) {
      console.log("Could not load heritage:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleHeritageChange = (e) => {
    const { name, value } = e.target;
    setHeritageForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const save = async () => {
    try {
      setLoading(true);
      await homepageApi.updateHomepage(form);
      toast.success("Homepage hero updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const saveHeritage = async () => {
    try {
      setSavingHeritage(true);
      const res = await fetch(`${API_BASE}/homepage/heritage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify(heritageForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Heritage story saved successfully!");
      } else {
        toast.error(data.message || "Failed to update heritage story");
      }
    } catch (err) {
      toast.error("Network error saving heritage");
    } finally {
      setSavingHeritage(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#6D1830] dark:text-[#E5C583]">
            Storefront & Heritage CMS
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your live royal storefront hero section, taglines, and heritage story.
          </p>
        </div>

        {activeTab === "hero" ? (
          <button
            onClick={save}
            disabled={loading}
            className="bg-[#6D1830] hover:bg-[#561225] text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition shadow-md disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving Hero..." : "Save Hero"}
          </button>
        ) : (
          <button
            onClick={saveHeritage}
            disabled={savingHeritage}
            className="bg-[#6D1830] hover:bg-[#561225] text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition shadow-md disabled:opacity-50"
          >
            <Save size={18} />
            {savingHeritage ? "Saving Heritage..." : "Save Heritage Story"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-200 dark:border-[#2C1F32] pb-3">
        <button
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === "hero"
              ? "bg-[#6D1830] text-white shadow-sm"
              : "bg-white dark:bg-[#18101C] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#2C1F32] hover:border-[#6D1830]"
          }`}
        >
          <LayoutTemplate size={16} />
          Homepage Hero
        </button>

        <button
          onClick={() => setActiveTab("heritage")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === "heritage"
              ? "bg-[#6D1830] text-white shadow-sm"
              : "bg-white dark:bg-[#18101C] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#2C1F32] hover:border-[#6D1830]"
          }`}
        >
          <BookOpen size={16} />
          Heritage Story CMS
        </button>
      </div>

      {activeTab === "heritage" ? (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#18101C] rounded-3xl shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] p-8 space-y-5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#8B1E3F]/10 text-[#8B1E3F] dark:text-[#E5C583]">
                <BookOpen size={20} />
              </span>
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF]">
                Edit Heritage & Legacy
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Story Title *
              </label>
              <input
                name="title"
                value={heritageForm.title}
                onChange={handleHeritageChange}
                placeholder="e.g. The Jayant Saree Center Legacy"
                className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Founding Year
                </label>
                <input
                  name="foundingYear"
                  value={heritageForm.foundingYear}
                  onChange={handleHeritageChange}
                  placeholder="e.g. 1978"
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location / City
                </label>
                <input
                  name="location"
                  value={heritageForm.location}
                  onChange={handleHeritageChange}
                  placeholder="e.g. Varanasi, India"
                  className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Hero Subtitle / Tagline
              </label>
              <textarea
                rows={2}
                name="subtitle"
                value={heritageForm.subtitle}
                onChange={handleHeritageChange}
                className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Retail Roots & Founding Story
              </label>
              <textarea
                rows={4}
                name="story"
                value={heritageForm.story}
                onChange={handleHeritageChange}
                className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Philosophy & Modern Brand Evolution
              </label>
              <textarea
                rows={4}
                name="philosophy"
                value={heritageForm.philosophy}
                onChange={handleHeritageChange}
                className="w-full border border-gray-200 dark:border-[#38283E] bg-white dark:bg-[#201426] text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Live Preview of Heritage */}
          <div className="bg-white dark:bg-[#18101C] rounded-3xl shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] p-8 space-y-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-[#FAF5EF] flex items-center gap-2">
              <Eye size={18} className="text-[#8B1E3F]" />
              Heritage Live Preview
            </h2>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#120B15] border border-[#D4B483]/30 space-y-4">
              <span className="text-[11px] font-mono text-[#B8860B] uppercase tracking-widest font-bold block">
                Est. {heritageForm.foundingYear || "1978"} &bull; {heritageForm.location || "India"}
              </span>

              <h3 className="text-2xl font-serif font-bold text-[#6D1830] dark:text-[#E8C58D]">
                {heritageForm.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                {heritageForm.story}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                {heritageForm.philosophy}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">

      {/* LEFT */}

      <div className="bg-white rounded-3xl shadow p-8 space-y-6">

        <h2 className="text-xl font-semibold">
          Hero Content
        </h2>

        <div>

          <label className="block mb-2 font-medium">
            Hero Badge
          </label>

          <input
            name="badge"
            value={form.badge}
            onChange={handleChange}
            placeholder="✨ New Collection"
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Subtitle
          </label>

          <textarea
            rows={4}
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium flex items-center gap-2">
            <Video size={18} />

            Hero Video URL
          </label>

          <input
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">
              Primary Button
            </label>

            <input
              name="buttonText"
              value={form.buttonText}
              onChange={handleChange}
              placeholder="Shop Now"
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Button Link
            </label>

            <input
              name="buttonLink"
              value={form.buttonLink}
              onChange={handleChange}
              placeholder="/products"
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">
              Secondary Button
            </label>

            <input
              name="secondaryButtonText"
              value={form.secondaryButtonText}
              onChange={handleChange}
              placeholder="Explore"
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Button Link
            </label>

            <input
              name="secondaryButtonLink"
              value={form.secondaryButtonLink}
              onChange={handleChange}
              placeholder="/reels"
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />

          Hero Section Active

        </label>

      </div>

      {/* RIGHT */}

      <div className="space-y-6">

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="font-semibold flex items-center gap-2 mb-4">

            <Eye size={18} />

            Live Preview

          </h2>

          <div className="bg-[#FDF8F6] rounded-2xl overflow-hidden">

            {form.videoUrl ? (
              <video
                src={form.videoUrl}
                controls
                muted
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Video Preview
              </div>
            )}

            <div className="p-8">

              {form.badge && (

                <span className="inline-flex items-center gap-2 bg-[#6D1830] text-white px-4 py-2 rounded-full text-sm">

                  <BadgeCheck size={15} />

                  {form.badge}

                </span>

              )}

              <h1 className="text-4xl font-bold mt-5">
                {form.title || "Homepage Title"}
              </h1>

              <p className="text-gray-600 mt-4">
                {form.subtitle ||
                  "Your homepage subtitle will appear here."}
              </p>

              <div className="flex gap-4 mt-8">
                <button className="bg-[#6D1830] text-white px-6 py-3 rounded-xl">
                  {form.buttonText || "Primary Button"}
                </button>
                <button className="border border-[#6D1830] text-[#6D1830] px-6 py-3 rounded-xl">
                  {form.secondaryButtonText || "Secondary Button"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
  </div>
);
}

export default Homepage; 

