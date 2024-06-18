import { URL } from "url";

export const hasLowerCaseExtension = (segment: string): boolean => {
    const parts = segment.split(".");
    if (parts.length < 2) return false;
    const extension = parts.pop() as string;
    return extension === extension.toLowerCase();
};

export const isValidUrl = (pathSegments: string[]): boolean => {
    const lastSegment = pathSegments[pathSegments.length - 1];
    return hasLowerCaseExtension(lastSegment) || !lastSegment.includes(".");
};

export const transformData = (urls: { fileUrl: string }[]): Record<string, any[]> => {
    const result: Record<string, any[]> = {};

    urls.forEach((url) => {
        const urlObj = new URL(url.fileUrl);
        const ip = urlObj.hostname;
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);

        if (!isValidUrl(pathSegments)) return;

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
