// Check for repo updates
// This is a simple script that checks for updates to the repo and sends a notification if there are any.
// Should run without authentication repo is public

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();

const owner = "IchiiDev";
const repo = "sound-bot";

const checkForUpdates = async () => {
    console.log("Checking for updates...");

    octokit.auth({ type: "token", token: process.env.GITHUB_FGT });

    try {
        const { data } = await octokit.repos.getCommit({
            owner,
            repo,
            ref: "main"
        });

        const sha = data.sha;
        const currentSha = require("child_process").execSync("git rev-parse HEAD").toString().trim();

        if (sha == currentSha) {
            console.log("No updates found.");
            return;
        }

        console.log("New updates found! Downloading...");

        require("child_process").execSync("git pull", { stdio: "inherit" });
        require("child_process").execSync("npm install", { stdio: "inherit" });

        console.log("Updates downloaded successfully! Building...");

        require("child_process").execSync("npm run build", { stdio: "inherit" });

        console.log("Build successful! Starting...");

    } catch (error) {
        console.error(error.message);
    }
};

(async () => {
    if (process.env.GITHUB_FGT)
        await checkForUpdates();

    require("../dist/index");
})();


