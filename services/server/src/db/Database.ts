import { createClient } from '@supabase/supabase-js';


import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config({ path: '.env' });

const database = async () => {
    try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
        }

        const connectdb = createClient(url, key);
        logger.info('Supabase connected successfully');
        return connectdb;


    } catch (err) {
        throw err;
    }
};

export default database;

