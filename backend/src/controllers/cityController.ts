/*!
 * This code includes work from Sri-Lanka-Location-Details by Dineth Siriwardana,
 * licensed under the MIT License.
 *
 * Original Copyright (c) 2025 Dineth Siriwardana
 * 
 * ----
 *
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana. All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this software, 
 * in whole or in part, is strictly prohibited.
 */
import { Request, Response } from "express";
import dataService from "../utils/dataService";

export const getCities = (req: Request, res: Response) => {
    console.log("getCities endpoint hit!");
  res.json(dataService.getCities());
};

export const getCitiesByDistrict = (req: Request, res: Response) => {
  const cities = dataService.getCitiesByDistrict(req.params.districtName);
  return cities.length
    ? res.json(cities)
    : res.status(404).json({ message: "No cities found in this district" });
};

export const getCitiesByProvince = (req: Request, res: Response) => {
  const cities = dataService.getCitiesByProvince(req.params.provinceName);
  return cities.length
    ? res.json(cities)
    : res.status(404).json({ message: "No cities found in this province" });
};

export const getCityByPostcode = (req: Request, res: Response) => {
  const city = dataService.getCityByPostcode(req.params.postcode);
  return city
    ? res.json(city)
    : res.status(404).json({ message: "City not found" });
};

export const searchCities = (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;
  const lang = req.query.lang as "en" | "si" | "ta";

  if (!searchTerm)
    return res.status(400).json({ message: "Search term is required" });

  try {
    const cities = dataService.searchCities(searchTerm, lang);
    return cities.length
      ? res.json(cities)
      : res
          .status(404)
          .json({ message: "No cities found matching search criteria" });
  } catch (error) {
    return res
      .status(400)
      .json({
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
  }
};

export const findNearbyCities = (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);
  const radius = parseFloat(req.query.radius as string) || 5;

  if (isNaN(lat) || isNaN(lon)) {
    return res
      .status(400)
      .json({ message: "Valid latitude and longitude are required" });
  }

  const cities = dataService.findNearbyCities(lat, lon, radius);
  return cities.length
    ? res.json(cities)
    : res
        .status(404)
        .json({ message: "No cities found within specified radius" });
};
