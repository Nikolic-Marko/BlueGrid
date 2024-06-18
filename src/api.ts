import fetch from "node-fetch";
import { transformData } from "./utils";

interface ApiResponse {
    items: { fileUrl: string }[];
}

const FILES_API_URL = "https://rest-test-eight.vercel.app/api/test";

export const fetchDataAndTransform = async (): Promise<Record<string, any[]>> => {
    try {
        const response = await fetch(FILES_API_URL);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data: ApiResponse = (await response.json()) as ApiResponse;
        const urls = data.items;
        return transformData(urls);
    } catch (error) {
        console.error("Error fetching data from API:", error);
        throw new Error("Error fetching data");
    }
};
