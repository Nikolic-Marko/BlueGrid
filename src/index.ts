import express from "express";
import { fetchDataAndTransform } from "./api";
import cache from "./cache";

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_KEY = "transformedData";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

let cacheReady = false;

// Function to populate the cache
const populateCache = async () => {
    try {
        const data = await fetchDataAndTransform();
        cache.set(CACHE_KEY, data, CACHE_TTL / 1000); // TTL in seconds
        cacheReady = true;
        console.log("Cache populated");
    } catch (error) {
        console.error("Error populating cache:", error);
    }
};

// Populate cache when the app starts
populateCache();

// Set interval to repopulate cache every 30 minutes
setInterval(populateCache, CACHE_TTL);

app.get("/api/files", async (req, res) => {
    if (cacheReady) {
        const data = cache.get(CACHE_KEY);
        res.json(data);
    } else {
        // Wait until cache is populated
        try {
            await new Promise<void>((resolve) => {
                const checkCacheReady = setInterval(() => {
                    if (cacheReady) {
                        clearInterval(checkCacheReady);
                        resolve();
                    }
                }, 100); // Check every 100ms
            });
            const data = cache.get(CACHE_KEY);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: "Error while waiting for cache" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});