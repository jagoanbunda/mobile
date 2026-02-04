#!/usr/bin/env node

/**
 * Sync version from package.json to app.json
 * 
 * Updates expo.version, expo.android.versionCode, and expo.ios.buildNumber
 * to match the version in package.json.
 * 
 * Version code formula: major * 10000 + minor * 100 + patch
 * Example: "1.2.3" → 10203
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageJsonPath = path.join(root, "package.json");
const appJsonPath = path.join(root, "app.json");

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const version = packageJson.version;

  if (!version) {
    console.error("❌ No version field found in package.json");
    process.exit(1);
  }

  // Calculate build number from version
  const [major, minor, patch] = version.split(".").map(Number);
  
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    console.error(`❌ Invalid version format: "${version}". Expected "major.minor.patch"`);
    process.exit(1);
  }

  const buildNumber = major * 10000 + minor * 100 + patch;

  // Read app.json
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

  // Update expo.version
  appJson.expo.version = version;

  // Ensure android section exists and update versionCode
  if (!appJson.expo.android) {
    appJson.expo.android = {};
  }
  appJson.expo.android.versionCode = buildNumber;

  // Ensure ios section exists and update buildNumber
  if (!appJson.expo.ios) {
    appJson.expo.ios = {};
  }
  appJson.expo.ios.buildNumber = String(buildNumber);

  // Write updated app.json
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n");

  console.log(`✅ Synced version ${version} from package.json to app.json`);
  console.log(`   - expo.version: "${version}"`);
  console.log(`   - expo.android.versionCode: ${buildNumber}`);
  console.log(`   - expo.ios.buildNumber: "${buildNumber}"`);

  process.exit(0);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
