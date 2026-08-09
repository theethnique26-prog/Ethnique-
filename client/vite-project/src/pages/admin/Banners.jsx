import { useState } from "react";
import {
  Image,
  Plus,
  Trash2,
  Eye,
  Save,
} from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setBanner({
      ...banner,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addBanner = () => {
    setBanners([...banners, banner]);

    setBanner({
      title: "",
      subtitle: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      position: "Top",
      active: true,
    });
  };

  const deleteBanner = (index) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Banner Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage promotional banners shown across the website.
          </p>

        </div>

        <button
          className="bg-[#6D1830] text-white px-6 py-3 rounded-xl flex items-center gap-2"
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

            <label className="block mb-2">
              Banner Image URL
            </label>

            <input
              name="imageUrl"
              value={banner.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="border rounded-xl p-3 w-full"
            />

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
                  onClick={() => deleteBanner(index)}
                  className="text-red-500"
                >
                  <Trash2 />
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