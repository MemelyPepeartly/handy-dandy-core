const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const packageJson = require('../package.json');

const buildCommand = 'npm run build';
const homeDir = os.homedir();
const moduleDir = path.join(homeDir, `AppData\\Local\\FoundryVTT\\Data\\modules\\${packageJson.name}`);

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function copyFiles() {
    if (fs.existsSync(moduleDir)) {
        fs.rmSync(moduleDir, { recursive: true, force: true });
    }
    fs.mkdirSync(moduleDir, { recursive: true });

    const distDir = path.join(__dirname, '..', 'dist');
    copyRecursiveSync(distDir, moduleDir);
}

exec(buildCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Build error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Build stderr: ${stderr}`);
        return;
    }
    console.log(`Build stdout:\n${stdout}`);
    copyFiles();
});
