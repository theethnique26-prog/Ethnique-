import { useEffect, useState } from "react";
import { Play, X, Volume2, VolumeX } from "lucide-react";
import { API_BASE } from "../services/apiConfig.js";

function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReel, setSelectedReel] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/reels`);
      const data = await res.json();
      setReels(data.reels || []);
    } catch (error) {
      console.error("Failed to fetch reels:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f11] min-h-screen text-white">
      {/* Hero Header */}
      <section className="py-20 bg-[#F8F4EF] text-center px-4">
        <span className="text-[#8B1E3F] text-xs uppercase tracking-[0.3em] font-semibold">
          Ethnique Curated Stories
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-[#2C1810] mt-3">
          Reels & Heritage
        </h1>
        <p className="mt-4 text-gray-600 max-w-lg mx-auto text-base">
          Discover handloom artistry, draping inspirations, and timeless craftsmanship stories.
        </p>
      </section>

      {/* Reels Grid / Carousel */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#8B1E3F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reels.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 max-w-md mx-auto">
            <Play size={48} className="mx-auto text-gray-500 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">No Reels Available</h3>
            <p className="text-gray-400 text-sm mt-2 px-6">
              Our latest collection reels will appear here shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {reels.map((reel) => (
              <div
                key={reel._id}
                onClick={() => setSelectedReel(reel)}
                className="
                  relative
                  h-[520px]
                  rounded-[28px]
                  overflow-hidden
                  group
                  cursor-pointer
                  shadow-2xl
                  border border-white/10
                  hover:border-[#8B1E3F]/50
                  transition-all duration-300
                  hover:-translate-y-2
                "
              >
                {/* Thumbnail */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-105
                  "
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Play Icon Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="
                      w-16
                      h-16
                      rounded-full
                      bg-white/20
                      backdrop-blur-md
                      border border-white/30
                      flex
                      items-center
                      justify-center
                      group-hover:scale-110
                      group-hover:bg-[#8B1E3F]/80
                      transition-all duration-300
                      shadow-lg
                    "
                  >
                    <Play size={28} fill="white" color="white" className="ml-1" />
                  </div>
                </div>

                {/* Title and metadata */}
                <div className="absolute bottom-6 left-5 right-5 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-medium">
                    Ethnique Stories
                  </span>
                  <h3 className="text-xl font-medium mt-1 line-clamp-2">
                    {reel.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    Tap to watch full reel
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {selectedReel && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedReel(null)}
        >
          <div
            className="relative w-full max-w-sm h-[85vh] max-h-[720px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Controls */}
            <div className="absolute top-4 inset-x-4 z-20 flex justify-between items-center">
              <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs tracking-wider text-white">
                Ethnique Reel
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  onClick={() => setSelectedReel(null)}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Close reel"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <video
              src={selectedReel.videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              controls
              className="w-full h-full object-cover"
            />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pointer-events-none">
              <h4 className="text-lg font-semibold text-white">
                {selectedReel.title}
              </h4>
              <p className="text-sm text-white/80 mt-1">
                Ethnique by Jayant • Official Showcase
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reels;