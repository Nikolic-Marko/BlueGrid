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
exports.fetchDataAndTransform = void 0;
const axios_1 = __importDefault(require("axios"));
const TEST_API_URL = "https://rest-test-eight.vercel.app/api/test";
/**
 * Checks if the given segment has a valid lowercase extension.
 *
 * @param segment - The last segment of the URL path
 * @returns True if the segment has a lowercase extension, false otherwise
 */
const hasLowerCaseExtension = (segment) => {
    const parts = segment.split(".");
    if (parts.length < 2)
        return false;
    const extension = parts.pop();
    return extension === extension.toLowerCase();
};
/**
 * Validates the URL path segments to check for valid files and extensions.
 *
 * @param pathSegments - Array of path segments from the URL
 * @returns True if the URL is valid, false otherwise
 */
const isValidUrl = (pathSegments) => {
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.includes(".") && hasLowerCaseExtension(lastSegment) && !pathSegments.includes("RECYCLE.BIN");
};
/**
 * Fetches data from the API and transforms it into a structured format.
 *
 * @returns A structured object based on the fetched URLs
 */
const fetchDataAndTransform = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(TEST_API_URL);
        const urls = response.data.items;
        const result = {};
        const validUrls = urls.filter((url) => {
            const urlObj = new URL(url.fileUrl);
            const pathSegments = urlObj.pathname.split("/").filter(Boolean);
            return isValidUrl(pathSegments);
        });
        validUrls.forEach((url) => {
            const urlObj = new URL(url.fileUrl);
            const ip = urlObj.hostname;
            const pathSegments = urlObj.pathname.split("/").filter(Boolean);
            if (!result[ip]) {
                result[ip] = [];
            }
            let currentLevel = result[ip];
            pathSegments.forEach((segment, index) => {
                if (index === pathSegments.length - 1) {
                    if (segment.includes("."))
                        currentLevel.push(segment);
                }
                else {
                    let existingDir = currentLevel.find((item) => typeof item === "object" && item[segment]);
                    if (!existingDir) {
                        existingDir = { [segment]: [] };
                        currentLevel.push(existingDir);
                    }
                    currentLevel = existingDir[segment];
                }
            });
        });
        return result;
    }
    catch (error) {
        console.error("Error fetching data", error);
        throw new Error("Error fetching data");
    }
});
exports.fetchDataAndTransform = fetchDataAndTransform;
