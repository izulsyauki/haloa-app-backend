import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

export let redisClient: RedisClientType<
    any, any, any
>;

export async function initRedisClient() {
    redisClient = await createClient({
        url: process.env.REDIS_URL,
    })
        .on("error", (err) => {
            throw new Error(`Redis Client Error: ${err}`);
        })
        .connect();

    console.log("Redis Client Connected");
}
