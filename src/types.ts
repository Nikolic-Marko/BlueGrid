export interface ApiResponse {
    items: { fileUrl: string }[];
}

export interface CacheConfig {
    defaultTtl: number;
    checkPeriod: number;
}
