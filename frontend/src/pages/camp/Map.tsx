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
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindowF,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const Map: React.FC = () => {
  const { t } = useTranslation("map");
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
  const [isLoading, setIsLoading] = useState(false);
  const [noCampsFound, setNoCampsFound] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);

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
      setIsLoading(true);
      setNoCampsFound(false);
      axios
        .get(`${backendURL}/api/camps/city/${selectedCity}`)
        .then((res) => {
          if (res.data.length === 0) {
            setNoCampsFound(true);
          } else {
            processCampLocations(res.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching camps:", err);
          if (err.response?.status === 404) {
            setNoCampsFound(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
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
        newMarkers.push({ ...location, ...camp });
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="mt-4 text-4xl font-bold text-center mb-6 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent leading-tight pb-2">
          {t("title")}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              id="province"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full"
            >
              <option value="">{t("select_province")}</option>
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
              className="w-full"
            >
              <option value="">{t("select_district")}</option>
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
              className="w-full"
            >
              <option value="">{t("select_city")}</option>
              {cities.map((c) => (
                <option key={c.city_id} value={c.city_name_en}>
                  {c.city_name_en}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="loading flex justify-center items-center h-64">
            <svg width="64px" height="48px">
              <polyline
                points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                id="back"
                stroke="#e53e3e"
                strokeWidth="2"
                fill="none"
              ></polyline>
              <polyline
                points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                id="front"
                stroke="#f56565"
                strokeWidth="2"
                fill="none"
              ></polyline>
            </svg>
          </div>
        ) : noCampsFound ? (
          <div className="mb-6 p-4 bg-red-200 rounded-lg">
            <p className="text-red-700 text-center font-semibold font-opensans">
              {t("no_camps_found")}
            </p>
          </div>
        ) : isLoaded ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "500px",
                borderRadius: "8px",
              }}
              center={mapCenter}
              zoom={zoom}
            >
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  title={marker.name}
                  onClick={() => setSelectedCamp(marker)}
                >
                  {selectedCamp && selectedCamp._id === marker._id && (
                    <InfoWindowF
                      position={{ lat: marker.lat, lng: marker.lng }}
                      onCloseClick={() => setSelectedCamp(null)}
                    >
                      <div className="p-2">
                        <h2 className="font-bold text-lg">
                          {marker.organizationName}
                        </h2>
                        <p className="text-sm">
                          <strong>{t("info_window_date")}</strong> {marker.date}
                        </p>
                        <p className="text-sm">
                          <strong>{t("info_window_time")}</strong>{" "}
                          {marker.startTime}
                        </p>
                        <p className="text-sm">
                          <strong> {t("info_window_location")} </strong>{" "}
                          <a
                            href={marker.googleMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            {" "}
                            {marker.venue}{" "}
                          </a>
                        </p>
                        <p className="text-sm">
                          {t("info_window_contact")}{" "}
                          <a
                            href={`tel:${marker.contactNumber}`}
                            className="text-blue-500"
                          >
                            {marker.contactNumber}
                          </a>
                        </p>
                      </div>
                    </InfoWindowF>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Map;
