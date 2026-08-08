import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_DB = process.env.REDIS_DB;
const REDIS_TLS_ENABLED = process.env.REDIS_TLS_ENABLED;

if (!REDIS_HOST || !REDIS_PORT) {
    throw new Error('Missing Redis environment variables: REDIS_HOST and REDIS_PORT are required');
}

export const config = {
    redis: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
        password: REDIS_PASSWORD,
        db: REDIS_DB ? Number(REDIS_DB) : 0,
        tlsEnabled: REDIS_TLS_ENABLED === 'true'
    }
};
