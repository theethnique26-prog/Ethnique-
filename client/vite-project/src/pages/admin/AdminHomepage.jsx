import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  BadgeCheck,
  Video,
} from "lucide-react";
import { toast } from "react-hot-toast";

import homepageApi from "../../services/homepageApi";
function Homepage() {
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

const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHomepage();
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
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const save = async () => {
  try {
    setLoading(true);

    await homepageApi.updateHomepage(form);

    toast.success("Homepage updated successfully");
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
return (
  <div className="space-y-8">

    {/* Header */}

    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-3xl font-bold">
          Homepage Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your website hero section.
        </p>
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="bg-[#6D1830] hover:bg-[#561225] text-white px-6 py-3 rounded-xl flex items-center gap-2"
      >
        <Save size={18} />

        {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>

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

  </div>
);
}

export default Homepage; 

