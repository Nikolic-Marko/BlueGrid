"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = require("./api");
const cache_1 = __importDefault(require("./cache"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const CACHE_KEY = "transformedData";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
let cacheReady = false;
// Function to populate the cache
const populateCache = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, api_1.fetchDataAndTransform)();
        cache_1.default.set(CACHE_KEY, data, CACHE_TTL / 1000); // TTL in seconds
        cacheReady = true;
        console.log("Cache populated");
    }
    catch (error) {
        console.error("Error populating cache:", error);
    }
});
// Populate cache when the app starts
populateCache();
// Set interval to repopulate cache every 30 minutes
setInterval(populateCache, CACHE_TTL);
app.get("/api/files", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (cacheReady) {
        const data = cache_1.default.get(CACHE_KEY);
        res.json(data);
    }
    else {
        // Wait until cache is populated
        try {
            yield new Promise((resolve) => {
                const checkCacheReady = setInterval(() => {
                    if (cacheReady) {
                        clearInterval(checkCacheReady);
                        resolve();
                    }
                }, 100); // Check every 100ms
            });
            const data = cache_1.default.get(CACHE_KEY);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: "Error while waiting for cache" });
        }
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
