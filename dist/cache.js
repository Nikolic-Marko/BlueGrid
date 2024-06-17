"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const CACHE_TTL = 30 * 60; // 30 minutes in seconds
const CACHE_CHECK_PERIOD = 120; // Check period in seconds
const cache = new node_cache_1.default({ stdTTL: CACHE_TTL, checkperiod: CACHE_CHECK_PERIOD });
exports.default = cache;
