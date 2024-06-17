import NodeCache from "node-cache";

const CACHE_TTL = 30 * 60;
const CACHE_CHECK_PERIOD = 120;

const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_CHECK_PERIOD });

export default cache;
