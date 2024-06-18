import NodeCache from "node-cache";

interface CacheConfig {
    defaultTtl: number;
    checkPeriod: number;
}

class Cache {
    private cache: NodeCache;
    private defaultTtl: number;

    constructor(config: CacheConfig) {
        this.defaultTtl = config.defaultTtl;
        this.cache = new NodeCache({ stdTTL: config.defaultTtl, checkperiod: config.checkPeriod });
    }

    set(key: string, value: any, ttl?: number): void {
        if (ttl) {
            this.cache.set(key, value, ttl);
        } else {
            this.cache.set(key, value, this.defaultTtl);
        }
    }

    get<T>(key: string): T | undefined {
        return this.cache.get<T>(key);
    }

    async withCache<T>(key: string, fetchFunction: () => Promise<T>, ttl?: number): Promise<T> {
        const cachedData = this.get<T>(key);
        if (cachedData) {
            return cachedData;
        }

        let fetchInProgress = true;

        const fetchData = async () => {
            try {
                const data = await fetchFunction();
                this.set(key, data, ttl);
                fetchInProgress = false;
            } catch (error) {
                fetchInProgress = false;
                throw error;
            }
        };

        fetchData();

        return new Promise<T>((resolve, reject) => {
            const checkInterval = setInterval(() => {
                const cachedData = this.get<T>(key);
                if (cachedData) {
                    clearInterval(checkInterval);
                    fetchInProgress = false;
                    resolve(cachedData);
                } else if (!fetchInProgress) {
                    clearInterval(checkInterval);
                    reject(new Error("Error fetching data"));
                }
            }, 1000);
        });
    }
}

export default Cache;
