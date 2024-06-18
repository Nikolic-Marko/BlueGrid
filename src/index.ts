import { fetchDataAndTransform } from "./api";
import Cache from "./cache";
import { Request, Response } from "express";

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const CACHE_CONFIG = {
    defaultTtl: 30 * 60, 
    checkPeriod: 120, 
};

const cache = new Cache(CACHE_CONFIG);

const CACHE_KEYS = {
    files: "transformedData",
    newFiles: "newTransformedData",
};

const populateCache = async (key: string, fetchFunction: () => Promise<any>, ttl?: number): Promise<void> => {
    try {
        const data = await fetchFunction();
        cache.set(key, data, ttl);
        console.log(`Cache populated for ${key}`);
    } catch (error) {
        console.error(`Error populating cache for ${key}:`, error);
    }
};

const FILES_TTL = 30 * 60;

const initializeCache = () => {
    populateCache(CACHE_KEYS.files, fetchDataAndTransform, FILES_TTL);
    setInterval(() => populateCache(CACHE_KEYS.files, fetchDataAndTransform, FILES_TTL), FILES_TTL * 1000);
};

initializeCache();

app.get("/api/files", async (req: Request, res: Response) => {
    try {
        const data = await cache.withCache(CACHE_KEYS.files, fetchDataAndTransform, FILES_TTL);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
