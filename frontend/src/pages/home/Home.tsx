/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { CarouselSlider } from "./components/Carousel";
import { Cards } from "./components/Cards";
import { Map } from "./components/Map";
const Home = () => {
  return (
    <div>
      <CarouselSlider />
      <Cards />
      <Map />
     
    </div>
  );
};

export default Home;
