import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY");
    process.exit(1);
}

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            console.error(`Failed to list models: ${response.status}`);
            const text = await response.text();
            console.error(text);
            return [];
        }
        const data = await response.json();
        
        console.log("=== AVAILABLE MODELS ===");
        const candidates = [];
        data.models.forEach(m => {
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`MODEL: ${m.name.replace('models/', '')}`);
                console.log(`SUPPORTED METHODS: ${m.supportedGenerationMethods.join(', ')}`);
                console.log("-----------------------");
                
                if (m.name.includes("flash")) {
                    candidates.push(m.name.replace('models/', ''));
                }
            }
        });
        
        return candidates;
    } catch (e) {
        console.error("Error listing models:", e.message);
        return [];
    }
}

async function testModel(modelName) {
    console.log(`\n=== TESTING MODEL: ${modelName} ===`);
    try {
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you available?");
        console.log("MODEL:", modelName);
        console.log("HTTP STATUS: 200");
        console.log("AUTHENTICATION: PASS");
        console.log("GENERATION: PASS");
        console.log("QUOTA: AVAILABLE");
        console.log("ERROR: NONE");
    } catch (e) {
        console.log("MODEL:", modelName);
        if (e.status) {
            console.log("HTTP STATUS:", e.status);
        } else if (e.message.includes("429")) {
            console.log("HTTP STATUS: 429");
        } else {
            console.log("HTTP STATUS: UNKNOWN");
        }
        console.log("AUTHENTICATION: PASS"); // We know auth works if we got 429 or list models worked
        console.log("GENERATION: FAIL");
        
        if (e.message.includes("quota") && e.message.includes("limit: 0")) {
            console.log("QUOTA: ZERO");
        } else if (e.message.includes("quota") || e.message.includes("429")) {
            console.log("QUOTA: EXCEEDED");
        } else {
            console.log("QUOTA: UNKNOWN");
        }
        
        console.log("ERROR:", e.message);
    }
}

async function run() {
    const candidates = await listModels();
    
    // Sort candidates so we pick gemini-3.8-flash preferentially
    let target = null;
    if (candidates.includes("gemini-3.8-flash")) target = "gemini-3.8-flash";
    else if (candidates.includes("gemini-3.7-flash")) target = "gemini-3.7-flash";
    else if (candidates.length > 0) target = candidates[0];
    
    if (target) {
        await testModel(target);
    } else {
        console.log("No Flash candidates found.");
    }
}

run();
