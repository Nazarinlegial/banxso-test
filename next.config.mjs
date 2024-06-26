/** @type {import('next').NextConfig} */
import {join, dirname} from 'node:path'
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
    sassOptions: [join(__dirname, 'src')]
};

export default nextConfig;
