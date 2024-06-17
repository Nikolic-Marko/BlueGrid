import NodeCache from "node-cache";

const CACHE_TTL = 30 * 60; // 30 minutes in seconds
const CACHE_CHECK_PERIOD = 120; // Check period in seconds

const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_CHECK_PERIOD });

export default cache;
