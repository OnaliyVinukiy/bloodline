/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "flowbite-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const Map: React.FC = () => {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleApiKey!,
    libraries: ["places"],
  });

  const backendURL =
    import.meta.env.VITE_IS_PRODUCTION === "true"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5000";

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 });
  const [zoom, setZoom] = useState(8);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  //Fetch provinces list
  useEffect(() => {
    axios
      .get(`${backendURL}/api/provinces/provinces-list`)
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Error fetching provinces:", err));
  }, []);

  //Fetch districts list
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`${backendURL}/api/districts/province-name/${selectedProvince}`)
        .then((res) => setDistricts(res.data))
        .catch((err) => console.error("Error fetching districts:", err));
    }
  }, [selectedProvince]);

  //Fetch cities list
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`${backendURL}/api/city/district/${selectedDistrict}`)
        .then((res) => setCities(res.data))
        .catch((err) => console.error("Error fetching cities:", err));
    }
  }, [selectedDistrict]);

  //Fetch camps
  useEffect(() => {
    if (selectedCity) {
      axios
        .get(`${backendURL}/api/camps/city/${selectedCity}`)
        .then((res) => {
          processCampLocations(res.data);
        })
        .catch((err) => console.error("Error fetching camps:", err));
    }
  }, [selectedCity]);

  //Extract latitude and longitude from google map link
  const extractLatLng = (url: string) => {
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match
      ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
      : null;
  };

  //Fetch venue using geocode
  const geocodeVenue = async (venue: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: venue,
            key: googleApiKey,
          },
        }
      );
      const location = response.data.results[0]?.geometry.location;
      return location ? { lat: location.lat, lng: location.lng } : null;
    } catch (error) {
      console.error("Error fetching geocode:", error);
      return null;
    }
  };

  //Process camp locations
  const processCampLocations = async (camps: any[]) => {
    const newMarkers = [];
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;

    for (const camp of camps) {
      let location = extractLatLng(camp.googleMapLink);
      if (!location) {
        location = await geocodeVenue(camp.venue);
      }
      if (location) {
        newMarkers.push({ ...location, name: camp.venue });
        totalLat += location.lat;
        totalLng += location.lng;
        count++;
      }
    }

    setMarkers(newMarkers);

    if (count > 0) {
      setMapCenter({ lat: totalLat / count, lng: totalLng / count });
      setZoom(14);
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <Select
          id="province"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          <option value="">Select Province</option>
          {provinces.map((p) => (
            <option key={p.province_id} value={p.province_name_en}>
              {p.province_name_en}
            </option>
          ))}
        </Select>

        <Select
          id="district"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_name_en}>
              {d.district_name_en}
            </option>
          ))}
        </Select>

        <Select
          id="city"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.city_id} value={c.city_name_en}>
              {c.city_name_en}
            </option>
          ))}
        </Select>
      </div>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={mapCenter}
          zoom={zoom}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.name}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
