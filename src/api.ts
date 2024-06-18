import axios from "axios";
import { transformData } from "./utils";

interface ApiResponse {
    items: { fileUrl: string }[];
}

const FILES_API_URL = "https://rest-test-eight.vercel.app/api/test";

export const fetchDataAndTransform = async (): Promise<Record<string, any[]>> => {
    try {
        const response = await axios.get<ApiResponse>(FILES_API_URL);
        const urls = response.data.items;
        return transformData(urls);
    } catch (error) {
        console.error("Error fetching data from API:", error);
        throw new Error("Error fetching data");
    }
};
