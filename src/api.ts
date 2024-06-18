import axios from "axios";
import { URL } from "url";

interface ApiResponse {
    items: { fileUrl: string }[];
}

const TEST_API_URL = "https://rest-test-eight.vercel.app/api/test";

const hasLowerCaseExtension = (segment: string): boolean => {
    const parts = segment.split(".");
    if (parts.length < 2) return false;
    const extension = parts.pop() as string;
    return extension === extension.toLowerCase();
};

const isValidUrl = (pathSegments: string[]): boolean => {
    const lastSegment = pathSegments[pathSegments.length - 1];
    return hasLowerCaseExtension(lastSegment) || !lastSegment.includes(".");
};

const transformData = (urls: { fileUrl: string }[]): Record<string, any[]> => {
    const result: Record<string, any[]> = {};

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
                if (segment.includes(".")) currentLevel.push(segment);
            } else {
                let existingDir = currentLevel.find((item: any) => typeof item === "object" && item[segment]);
                if (!existingDir) {
                    existingDir = { [segment]: [] };
                    currentLevel.push(existingDir);
                }
                currentLevel = existingDir[segment];
            }
        });
    });

    return result;
};

export const fetchDataAndTransform = async (): Promise<Record<string, any[]>> => {
    try {
        const response = await axios.get<ApiResponse>(TEST_API_URL);
        const urls = response.data.items;
        return transformData(urls);
    } catch (error) {
        console.error("Error fetching data from API:", error);
        throw new Error("Error fetching data");
    }
};
