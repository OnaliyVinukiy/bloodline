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

export const getDistricts = (req: Request, res: Response) => {
    try {
        res.json(dataService.getDistricts());
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
};

export const getDistrictsByProvinceName = (req: Request, res: Response) => {
    try {
        const lang = (req.query.lang as "en" | "si" | "ta") || "en";
        const districts = dataService.getDistrictsByProvinceName(req.params.provinceName, lang);
        return districts.length 
            ? res.json(districts) 
            : res.status(404).json({ message: "No districts found for this province" });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
};
