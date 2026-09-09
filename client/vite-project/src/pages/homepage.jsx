import React from "react";
import Carousel from "../components/carousel";
import ReviewsSlider from "../components/reviewsslider";
import SareeSection from "../components/sareesection";

const Home = () => {
  return (
    <main className="min-h-screen text-[#2B2523] dark:text-[#F7F2EC] transition-colors duration-400">
      <Carousel />
      <SareeSection />
      <ReviewsSlider />
    </main>
  );
};

export default Home;