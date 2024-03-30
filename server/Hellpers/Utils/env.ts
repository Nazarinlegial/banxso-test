import * as dotenv from "dotenv"
import {join, dirname} from 'node:path'
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadEnv(filename: string = ".env.local") {
    return dotenv.config({
        path: join(__dirname, filename)
    })
}