import axios from "axios";
import { fetchDataAndTransform } from "../api";
import { transformData } from "../utils";

jest.mock("axios");
jest.mock("../utils");

describe("fetchDataAndTransform", () => {
    it("should fetch data from API and transform it", async () => {
        const mockResponse = {
            data: {
                items: [{ fileUrl: "http://34.8.32.234:48183/SvnRep/README.txt" }],
            },
        };
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);
        (transformData as jest.Mock).mockReturnValue({
            "34.8.32.234": [
                {
                    SvnRep: ["README.txt"],
                },
            ],
        });

        const result = await fetchDataAndTransform();
        expect(result).toEqual({
            "34.8.32.234": [
                {
                    SvnRep: ["README.txt"],
                },
            ],
        });
        expect(axios.get).toHaveBeenCalledWith("https://rest-test-eight.vercel.app/api/test");
        expect(transformData).toHaveBeenCalledWith([{ fileUrl: "http://34.8.32.234:48183/SvnRep/README.txt" }]);
    });

    it("should throw an error if the API call fails", async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

        await expect(fetchDataAndTransform()).rejects.toThrow("Error fetching data");
        expect(axios.get).toHaveBeenCalledWith("https://rest-test-eight.vercel.app/api/test");
    });
});
