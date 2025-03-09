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

export const getProvinces = (req: Request, res: Response) => {
    try {
        res.json(dataService.getProvinces());
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
};
