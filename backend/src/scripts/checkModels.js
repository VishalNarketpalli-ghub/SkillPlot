import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.log("No GEMINI_API_KEY found");
    process.exit(1);
}

// Manually fetch models to see what the key allows
async function checkModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
             console.log(`Failed to fetch models: ${response.status} ${response.statusText}`);
             return;
        }
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(m => console.log(m.name));
    } catch(e) {
        console.log("Error:", e.message);
    }
}
checkModels();
