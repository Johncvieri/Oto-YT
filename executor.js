const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// CONFIGURATION
const WORKING_DIR = "C:\\Users\\ASUS\\Downloads\\john\\Oto-YT";
const PROJECT_ANALYSIS = path.join(WORKING_DIR, "PROJECT_ANALYSIS.md");
const LIVE_URL = "https://oto-yt-production.up.railway.app/";
const WORKFLOW_URL = "https://oto-yt-production.up.railway.app/api/workflow/status";
const N8N_URL = "http://localhost:5678/rest/status";
const LOOP_DELAY = 60000; // 60 detik
const N8N_MAX_RETRIES = 5;

// HELPER FUNCTIONS
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(PROJECT_ANALYSIS, logMessage, "utf-8");
    console.log(logMessage);
}

function gitPush() {
    try {
        execSync("git add .", { cwd: WORKING_DIR });
        execSync('git commit -m "Automated update by AI"', { cwd: WORKING_DIR });
        execSync("git push", { cwd: WORKING_DIR });
        return "Git push successful";
    } catch (err) {
        return `Git error: ${err.message}`;
    }
}

async function checkLive() {
    try {
        const res = await axios.get(LIVE_URL, { timeout: 10000 });
        const page = res.data.toLowerCase();
        if (page.includes("setup")) return "setup";
        if (page.includes("auth")) return "auth";
        return "unknown";
    } catch (err) {
        return "error";
    }
}

async function checkWorkflow() {
    try {
        const res = await axios.get(WORKFLOW_URL, { timeout: 10000 });
        if (res.status !== 200) return "error";
        const status = res.data.status ? res.data.status.toLowerCase() : "stopped";
        return status === "running" ? "running" : "stopped";
    } catch (err) {
        return "error";
    }
}

// ================================
// n8n Management
// ================================
async function ensureN8nRunning() {
    let retries = 0;
    while (retries < N8N_MAX_RETRIES) {
        try {
            const res = await axios.get(N8N_URL, { timeout: 5000 });
            if (res.data.status === "ok") return "n8n running";
        } catch {
            log(`⚠️ n8n not running, starting (attempt ${retries + 1})...`);
            try {
                execSync("npx --yes n8n start --max-old-space-size=512 --tunnel", { cwd: WORKING_DIR, stdio: 'ignore' });
            } catch (err) {
                log(`❌ Failed to start n8n: ${err.message}`);
            }
        }
        retries++;
        await new Promise(r => setTimeout(r, 10000)); // tunggu 10 detik sebelum retry
    }
    return "❌ n8n failed to start after multiple attempts";
}

// ================================
// MAIN LOOP
// ================================
async function mainLoop() {
    log("== Starting Fully Integrated Qwen + n8n Optimized ==");

    // Pastikan n8n running sebelum memulai loop
    const n8nStatus = await ensureN8nRunning();
    log(`n8n status: ${n8nStatus}`);
    if (!n8nStatus.includes("running")) {
        log("❌ Cannot proceed, n8n not running. Exiting loop.");
        return;
    }

    while (true) {
        log("--- New Iteration ---");

        // Step 1: Git push
        const gitStatus = gitPush();
        log(`Git: ${gitStatus}`);

        // Step 2: Check live site
        const liveStatus = await checkLive();
        log(`Live site status: ${liveStatus}`);

        // Step 3: Check workflow
        const workflowStatus = await checkWorkflow();
        log(`Workflow status: ${workflowStatus}`);

        // Step 4: Evaluate
        if (liveStatus === "auth" && workflowStatus === "running") {
            log("🎯 Live site and workflow stable. Ending loop.");
            break;
        } else {
            log("⏳ Conditions not met. Repeating iteration...");
        }

        // Step 5: Wait before next iteration
        await new Promise(resolve => setTimeout(resolve, LOOP_DELAY));
    }

    log("== Fully Integrated Execution Finished ==");
}

mainLoop();
