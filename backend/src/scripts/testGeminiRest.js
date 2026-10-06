import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.log("REST AUTHENTICATION: FAIL");
    console.log("REST GENERATION: FAIL");
    console.log("ERROR REASON: Missing GEMINI_API_KEY");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

async function run() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("REST AUTHENTICATION: FAIL");
            console.log("REST GENERATION: FAIL");
            console.log(`HTTP STATUS: ${response.status}`);
            console.log(`ERROR REASON: ${data.error ? data.error.message : JSON.stringify(data)}`);
            process.exit(1);
        }

        console.log("REST AUTHENTICATION: PASS");
        console.log("REST GENERATION: PASS");
        console.log(`HTTP STATUS: ${response.status}`);
        console.log(`ERROR REASON: NONE`);
    } catch (e) {
        console.log("REST AUTHENTICATION: FAIL");
        console.log("REST GENERATION: FAIL");
        console.log(`HTTP STATUS: N/A`);
        console.log(`ERROR REASON: ${e.message}`);
    }
}

run();
