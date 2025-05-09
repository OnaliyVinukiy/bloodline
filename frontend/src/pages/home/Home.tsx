/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { CarouselSlider } from "./components/Carousel";
import Cards from "./components/Cards";
import BloodType from "./components/BloodType";
import Chatbot from "./components/ChatBot";

const Home = () => {
  return (
    <div>
      <CarouselSlider />
      <Cards />
      <BloodType />
      <Chatbot />
    </div>
  );
};

export default Home;
