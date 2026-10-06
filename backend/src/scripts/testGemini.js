import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.log("No GEMINI_API_KEY found");
    process.exit(1);
}

console.log(`GEMINI_API_KEY_PRESENT=${!!apiKey}`);
console.log(`GEMINI_API_KEY_LENGTH=${apiKey.length}`);
console.log(`GEMINI_API_KEY_HAS_LEADING_WHITESPACE=${/^\s/.test(apiKey)}`);
console.log(`GEMINI_API_KEY_HAS_TRAILING_WHITESPACE=${/\s$/.test(apiKey)}`);
console.log(`GEMINI_API_KEY_HAS_SURROUNDING_QUOTES=${/^["'].*["']$/.test(apiKey)}`);

const ai = new GoogleGenerativeAI(apiKey);

// Since we can't easily list models without the fetch API directly, we'll try 'gemini-3.1-pro-preview'
async function test() {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-3.1-pro-preview" });
        await model.generateContent("test");
        console.log("gemini-3.1-pro-preview works");
    } catch(e) {
        console.log("gemini-3.1-pro-preview error:", e.message);
    }
}
test();
