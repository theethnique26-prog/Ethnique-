import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";
import {
  Upload,
  Video,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  CheckCircle2,
  Film,
  Plus,
  Play,
  Eye,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

function AdminReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const data = await adminApi.get("/reels");
      setReels(data.reels || []);
    } catch (error) {
      console.error("Fetch reels error:", error);
      toast.error("Failed to load reels");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      const fd = new FormData();
      fd.append("video", file);

      toast.loading("Uploading video reel to Cloudinary...", { id: "upload-vid" });
      const data = await adminApi.uploadFile("/upload/video", fd);

      if (data?.videoUrl || data?.url) {
        const url = data.videoUrl || data.url;
        setVideoUrl(url);

        // Auto-generate Cloudinary start offset thumbnail if thumbnail is empty
        if (!thumbnail && url.includes("cloudinary.com")) {
          const autoThumb = url
            .replace(/\.[a-zA-Z0-9]+$/, ".jpg")
            .replace("/video/upload/", "/video/upload/so_1/");
          setThumbnail(autoThumb);
        }

        toast.success("Video uploaded successfully!", { id: "upload-vid" });
      } else {
        toast.error(data?.message || "Failed to upload video", { id: "upload-vid" });
      }
    } catch (err) {
      console.error("Video upload error:", err);
      toast.error("Upload error: " + err.message, { id: "upload-vid" });
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumbnail(true);
      const fd = new FormData();
      fd.append("image", file);

      toast.loading("Uploading thumbnail to Cloudinary...", { id: "upload-thumb" });
      const data = await adminApi.uploadFile("/upload/image", fd);

      if (data?.imageUrl || data?.url) {
        setThumbnail(data.imageUrl || data.url);
        toast.success("Thumbnail uploaded successfully!", { id: "upload-thumb" });
      } else {
        toast.error(data?.message || "Failed to upload thumbnail", { id: "upload-thumb" });
      }
    } catch (err) {
      console.error("Thumbnail upload error:", err);
      toast.error("Upload error: " + err.message, { id: "upload-thumb" });
    } finally {
      setUploadingThumbnail(false);
      e.target.value = "";
    }
  };

  const addReel = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !videoUrl.trim() || !thumbnail.trim()) {
      toast.error("Please provide Title, Video URL, and Thumbnail.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await adminApi.post("/reels", {
        title: title.trim(),
        videoUrl: videoUrl.trim(),
        thumbnail: thumbnail.trim(),
      });

      if (data.success) {
        toast.success("Reel published to Lookbook successfully!");
        setTitle("");
        setVideoUrl("");
        setThumbnail("");
        await fetchReels();
      } else {
        toast.error(data.message || "Failed to create reel");
      }
    } catch (error) {
      console.error("Add reel error:", error);
      toast.error("Error creating reel: " + (error.message || "Network issue"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReel = async (id, reelTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${reelTitle || "this reel"}"?`
    );
    if (!confirmDelete) return;

    try {
      await adminApi.delete(`/reels/${id}`);
      toast.success("Reel deleted successfully");
      fetchReels();
    } catch (error) {
      console.error("Delete reel error:", error);
      toast.error("Failed to delete reel");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18101C] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2DC]/80 dark:border-[#2C1F32] transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C2F4D] dark:text-[#E5C583] uppercase tracking-wider mb-1">
            <Film size={15} />
            <span>Ethnique Living Lookbook &amp; Reels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#6D1830] dark:text-[#E5C583]">
            Reels Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage live lookbook reels, videos, and draping masterclasses.
          </p>
        </div>

        <a
          href="/reels"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D4B483] dark:border-[#584126] bg-white dark:bg-[#120B15] text-[#6D1830] dark:text-[#E5C583] font-semibold text-xs uppercase tracking-wider hover:bg-[#FAF8F5] dark:hover:bg-[#1E1122] shadow-xs transition"
        >
          <Eye size={15} />
          <span>View Live Lookbook</span>
          <ExternalLink size={13} className="text-gray-400 dark:text-gray-500" />
        </a>
      </div>

      {/* Add Reel Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E8E2DC] p-6 sm:p-8 mb-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#6D1830]/10 text-[#6D1830] flex items-center justify-center">
              <Plus size={18} />
            </div>
            <h2 className="text-lg font-serif font-semibold text-gray-900">
              Publish New Lookbook Reel
            </h2>
          </div>
          <span className="text-xs text-gray-400">
            Upload from device or paste Cloudinary URLs
          </span>
        </div>

        <form onSubmit={addReel} className="grid gap-6">
          {/* Reel Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Reel Title *
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6D1830] transition"
              placeholder="e.g. Pure Cotton Saree Draping Masterclass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video File / URL Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Reel Video (MP4) *
                </label>
                <label className="cursor-pointer text-xs font-semibold text-[#6D1830] hover:text-[#541224] flex items-center gap-1.5 bg-[#6D1830]/10 hover:bg-[#6D1830]/15 px-3 py-1.5 rounded-lg transition border border-[#6D1830]/20">
                  <Upload size={13} />
                  <span>{uploadingVideo ? "Uploading..." : "Upload from Computer"}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D1830]"
                placeholder="Paste video URL or click 'Upload from Computer'"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />

              {uploadingVideo && (
                <div className="flex items-center gap-2 text-xs text-[#6D1830] animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-[#6D1830] border-t-transparent rounded-full animate-spin" />
                  <span>Uploading video to Cloudinary CDN...</span>
                </div>
              )}

              {videoUrl && (
                <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200 bg-black aspect-[9/14] max-h-56 flex items-center justify-center">
                  <video src={videoUrl} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Thumbnail Image / URL Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cover Thumbnail (JPG / PNG) *
                </label>
                <label className="cursor-pointer text-xs font-semibold text-[#6D1830] hover:text-[#541224] flex items-center gap-1.5 bg-[#6D1830]/10 hover:bg-[#6D1830]/15 px-3 py-1.5 rounded-lg transition border border-[#6D1830]/20">
                  <Upload size={13} />
                  <span>{uploadingThumbnail ? "Uploading..." : "Upload from Computer"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumbnail}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D1830]"
                placeholder="Paste thumbnail URL or click 'Upload from Computer'"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                required
              />

              {uploadingThumbnail && (
                <div className="flex items-center gap-2 text-xs text-[#6D1830] animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-[#6D1830] border-t-transparent rounded-full animate-spin" />
                  <span>Uploading thumbnail to Cloudinary CDN...</span>
                </div>
              )}

              {thumbnail && (
                <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-[9/14] max-h-56 flex items-center justify-center">
                  <img src={thumbnail} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || uploadingVideo || uploadingThumbnail}
              className="bg-gradient-to-r from-[#6D1830] to-[#8C2F4D] hover:brightness-110 text-white px-8 py-3.5 rounded-xl font-medium transition shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} />
              <span>{isSubmitting ? "Publishing Reel..." : "Publish Reel"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reel List Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Active Lookbook Reels ({reels.length})
          </h2>
          <span className="text-xs text-gray-500">
            Visible on Customer Storefront &amp; Video Lookbook
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xs border border-[#E8E2DC]">
            <div className="w-10 h-10 border-4 border-[#6D1830] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-serif">Loading lookbook catalog...</p>
          </div>
        ) : reels.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xs border border-[#E8E2DC]">
            <Film size={36} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-serif text-lg font-semibold text-gray-800">No Reels Yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Add your first video reel above to feature on the lookbook page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E8E2DC] hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Thumbnail Card */}
                <div className="relative aspect-[9/13] overflow-hidden bg-black">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-[#E8C58D] border border-white/20">
                      Live Reel
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-sm font-serif font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">
                      {reel.title}
                    </h3>
                  </div>

                  {/* Video player preview */}
                  <div className="mt-2 pt-3 border-t border-gray-100 space-y-3">
                    <video
                      src={reel.videoUrl}
                      controls
                      className="w-full rounded-xl max-h-36 bg-black"
                    />

                    <button
                      onClick={() => deleteReel(reel._id, reel.title)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-red-200"
                    >
                      <Trash2 size={13} />
                      <span>Delete Reel</span>
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

export default AdminReels;