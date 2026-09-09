import { useState, useEffect } from "react";
import {
  Image,
  Plus,
  Trash2,
  Eye,
  Save,
  Loader2,
  CheckCircle,
  Upload,
} from "lucide-react";
import bannerApi from "../../services/bannerApi";
import adminApi from "../../services/adminApi";

function Banners() {
  const [banner, setBanner] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",
    position: "Top",
    active: true,
  });

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerApi.getAll();
      if (Array.isArray(res)) {
        setBanners(res);
      } else if (res && res.banners) {
        setBanners(res.banners);
      }
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setBanner({
      ...banner,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append("image", file);
      const res = await adminApi.uploadFile("/upload/image", fd);
      if (res?.imageUrl || res?.url) {
        setBanner((prev) => ({
          ...prev,
          imageUrl: res.imageUrl || res.url,
        }));
      } else {
        alert("Failed to upload banner photo: " + (res?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      alert("Upload error: " + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const addBanner = async () => {
    if (!banner.title || !banner.imageUrl) {
      alert("Please provide at least a title and an image URL");
      return;
    }

    try {
      setSubmitting(true);
      await bannerApi.create(banner);
      setFeedback("Banner saved to live website!");
      setTimeout(() => setFeedback(""), 3500);

      setBanner({
        title: "",
        subtitle: "",
        imageUrl: "",
        buttonText: "",
        buttonLink: "",
        position: "Top",
        active: true,
      });

      await fetchBanners();
    } catch (err) {
      console.error("Failed to create banner:", err);
      alert("Failed to save banner");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBanner = async (id, index) => {
    if (!window.confirm("Are you sure you want to remove this banner?")) return;

    try {
      if (id) {
        await bannerApi.remove(id);
      }
      setBanners(banners.filter((b, i) => (b._id ? b._id !== id : i !== index)));
    } catch (err) {
      console.error("Failed to delete banner:", err);
      alert("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">

        <div>
          <h1 className="text-3xl font-serif font-bold text-[#6D1830] dark:text-[#E5C583]">
            Banner Management
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage promotional hero banners shown across the website.
          </p>
        </div>

        <button
          className="bg-[#6D1830] hover:bg-[#521123] text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition shadow-md"
          onClick={addBanner}
        >
          <Plus size={18} />
          Add Banner
        </button>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT */}

        <div className="bg-white rounded-3xl shadow p-8 space-y-5">

          <h2 className="text-xl font-semibold">
            Banner Details
          </h2>

          <div>

            <label className="block mb-2">
              Banner Title
            </label>

            <input
              name="title"
              value={banner.title}
              onChange={handleChange}
              className="border rounded-xl p-3 w-full"
            />

          </div>

          <div>

            <label className="block mb-2">
              Banner Subtitle
            </label>

            <textarea
              rows={4}
              name="subtitle"
              value={banner.subtitle}
              onChange={handleChange}
              className="border rounded-xl p-3 w-full"
            />

          </div>

          <div>

            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium">
                Banner Image
              </label>
              <label className="cursor-pointer text-xs font-semibold text-[#6D1830] hover:text-[#541224] flex items-center gap-1.5 bg-[#6D1830]/10 hover:bg-[#6D1830]/15 px-3 py-1.5 rounded-lg transition border border-[#6D1830]/20 shadow-xs">
                <Upload size={13} />
                <span>{uploadingImage ? "Uploading..." : "Upload from Computer"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            <input
              name="imageUrl"
              value={banner.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL or click 'Upload from Computer'"
              className="border rounded-xl p-3 w-full text-sm"
            />

            {uploadingImage && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[#6D1830] font-medium animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-[#6D1830] border-t-transparent rounded-full animate-spin" />
                <span>Uploading banner photo to Cloudinary CDN...</span>
              </div>
            )}

            {banner.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 max-h-48 bg-gray-50 flex items-center justify-center">
                <img src={banner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
              </div>
            )}

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block mb-2">
                Button Text
              </label>

              <input
                name="buttonText"
                value={banner.buttonText}
                onChange={handleChange}
                className="border rounded-xl p-3 w-full"
              />

            </div>

            <div>

              <label className="block mb-2">
                Button Link
              </label>

              <input
                name="buttonLink"
                value={banner.buttonLink}
                onChange={handleChange}
                className="border rounded-xl p-3 w-full"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2">
              Banner Position
            </label>

            <select
              name="position"
              value={banner.position}
              onChange={handleChange}
              className="border rounded-xl p-3 w-full"
            >
              <option>Top</option>
              <option>Middle</option>
              <option>Bottom</option>
            </select>

          </div>

          <label className="flex gap-3 items-center">

            <input
              type="checkbox"
              checked={banner.active}
              name="active"
              onChange={handleChange}
            />

            Banner Active

          </label>

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          <div className="bg-white rounded-3xl shadow p-6">

            <h2 className="font-semibold flex gap-2 items-center mb-5">

              <Eye size={18} />

              Live Preview

            </h2>

            <div className="rounded-2xl overflow-hidden border">

              {banner.imageUrl ? (

                <img
                  src={banner.imageUrl}
                  alt=""
                  className="h-64 w-full object-cover"
                />

              ) : (

                <div className="h-64 flex items-center justify-center text-gray-400">

                  <Image size={40} />

                </div>

              )}

              <div className="p-6">

                <h2 className="text-3xl font-bold">

                  {banner.title || "Banner Title"}

                </h2>

                <p className="mt-3 text-gray-600">

                  {banner.subtitle ||
                    "Banner subtitle will appear here."}

                </p>

                <button className="mt-6 bg-[#6D1830] text-white px-6 py-3 rounded-xl">

                  {banner.buttonText || "Shop Now"}

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Existing Banners */}

      <div className="bg-white rounded-3xl shadow p-8">

        <h2 className="text-xl font-semibold mb-6">
          Existing Banners
        </h2>

        {banners.length === 0 ? (

          <div className="text-center py-12 text-gray-400">
            No banners added yet.
          </div>

        ) : (

          <div className="space-y-4">

            {banners.map((item, index) => (

              <div
                key={index}
                className="border rounded-2xl p-5 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {item.position}
                  </p>

                </div>

                <button
                  onClick={() => deleteBanner(item._id, index)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                  title="Delete Banner"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Banners;