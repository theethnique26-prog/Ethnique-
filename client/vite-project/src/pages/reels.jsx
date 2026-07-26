import { useEffect, useState } from "react";
import { Play } from "lucide-react";

function Reels() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    const res = await fetch(
      "https://ethnique-bmae.onrender.com/api/reels"
    );

    const data = await res.json();

    setReels(data.reels || []);
  };
  const [selectedReel, setSelectedReel] =
  useState(null);
 

  return (
    <div className="bg-black min-h-screen">

      {/* Hero */}
      <section
        className="
        h-[350px]
        bg-[#F8F4EF]
        flex
        flex-col
        justify-center
        items-center
        text-center
        "
      >
        <h1 className="text-7xl font-serif">
          Reels
        </h1>

        <p className="mt-5 text-gray-600">
          Discover style inspirations
          and craftsmanship stories.
        </p>
      </section>

      {/* Reels */}

      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        py-16
        "
      >
        <div
  className="
  flex
  gap-6
  overflow-x-auto
  pb-5
  scrollbar-hide
  "
>
          {reels.map((reel) => (
            <div
  key={reel._id}
  className="
    relative
    min-w-[280px]
    h-[500px]
    rounded-[32px]
    overflow-hidden
    group
    cursor-pointer
    shadow-xl
  "
>
              <img
  src={reel.thumbnail}
  alt={reel.title}
  className="
    w-full
    h-full
    object-cover
    transition
    duration-500
    group-hover:scale-110
  "
/>

              {/* Overlay */}

              <div
  className="
    absolute
    inset-0
    bg-gradient-to-t
    from-black/90
    via-black/10
    to-transparent
  "
/>

              {/* Play Button */}

              <div
  className="
    absolute
    inset-0
    flex
    items-center
    justify-center
  "
>

  <div
    className="
      w-16
      h-16
      rounded-full
      bg-white/25
      backdrop-blur-lg
      flex
      items-center
      justify-center
      group-hover:scale-110
      transition
    "
  >
    <Play
      size={28}
      fill="white"
      color="white"
    />
  </div>

</div>

              {/* Title */}

              <div
  className="
    absolute
    bottom-6
    left-5
    right-5
    text-white
  "
>
  <h3
    className="
      text-xl
      font-semibold
    "
  >
    {reel.title}
  </h3>

  <p className="text-sm text-white/70">
    Ethnique by Jayant
  </p>
</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Reels;