import { useState } from "react";
import adminApi from "../../services/adminApi";
function Homepage() {
  const [videoUrl, setVideoUrl] =
    useState("");

  await fetch(
  "https://ethnique-bmae.onrender.com/api/homepage",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
    body: JSON.stringify({
      title: "Cotton Collection",
      subtitle:
        "Handwoven cotton sarees crafted for timeless elegance.",
      videoUrl,
      buttonText: "Shop Collection",
      buttonLink: "/products",
    }),
  }
);

    alert("Saved");
  };
const saveSection = async () => {
  try {
    await adminApi.post("/homepage", {
      title: "Cotton Collection",
      subtitle:
        "Handwoven cotton sarees crafted for timeless elegance.",
      videoUrl,
      buttonText: "Shop Collection",
      buttonLink: "/products",
    });

    alert("Saved");
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div>
      <h2>Homepage Section</h2>

      <input
        placeholder="Cloudinary Video URL"
        value={videoUrl}
        onChange={(e) =>
          setVideoUrl(
            e.target.value
          )
        }
      />

      <button onClick={saveSection}>
        Save
      </button>
    </div>
  );


export default Homepage;