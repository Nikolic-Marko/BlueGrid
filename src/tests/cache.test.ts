import Cache from "../cache";

describe("Cache", () => {
    let cache: Cache;

    beforeEach(() => {
        cache = new Cache({ defaultTtl: 30, checkPeriod: 10 });
    });

    it("should set and get a value", () => {
        cache.set("testKey", "testValue");
        const value = cache.get<string>("testKey");
        expect(value).toBe("testValue");
    });

    it("should return undefined for expired key", (done) => {
        cache.set("testKey", "testValue", 1);
        setTimeout(() => {
            const value = cache.get<string>("testKey");
            expect(value).toBeUndefined();
            done();
        }, 1100);
    });
});
