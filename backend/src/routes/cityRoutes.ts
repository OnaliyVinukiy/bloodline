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
import express from "express";
import {
  getCities,
  getCitiesByDistrict,
  getCitiesByProvince,
  getCityByPostcode,
  searchCities,
  findNearbyCities,
} from "../controllers/cityController";

const router = express.Router();

router.get("/cities", getCities);
router.get("/district/:districtName", getCitiesByDistrict);
router.get("/province/:provinceName", getCitiesByProvince);
router.get("/postcode/:postcode", getCityByPostcode);
router.get("/search", searchCities);
router.get("/nearby", findNearbyCities);

export default router;
