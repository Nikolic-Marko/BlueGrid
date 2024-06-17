import axios from "axios";

interface ApiResponse {
    items: { fileUrl: string }[];
}

const TEST_API_URL = "https://rest-test-eight.vercel.app/api/test";

/**
 * Checks if the given segment has a valid lowercase extension.
 *
 * @param segment - The last segment of the URL path
 * @returns True if the segment has a lowercase extension, false otherwise
 */
const hasLowerCaseExtension = (segment: string): boolean => {
    const parts = segment.split(".");
    if (parts.length < 2) return false;

    const extension = parts.pop() as string;
    return extension === extension.toLowerCase();
};

/**
 * Validates the URL path segments to check for valid files and extensions.
 *
 * @param pathSegments - Array of path segments from the URL
 * @returns True if the URL is valid, false otherwise
 */
const isValidUrl = (pathSegments: string[]): boolean => {
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.includes(".") && hasLowerCaseExtension(lastSegment) && !pathSegments.includes("RECYCLE.BIN");
};

/**
 * Fetches data from the API and transforms it into a structured format.
 *
 * @returns A structured object based on the fetched URLs
 */
export const fetchDataAndTransform = async (): Promise<any> => {
    try {
        const response = await axios.get<ApiResponse>(TEST_API_URL);
        const urls = response.data.items;

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
    } catch (error) {
        console.error("Error fetching data", error);
        throw new Error("Error fetching data");
    }
};
