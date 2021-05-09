const core = require("@actions/core");
const path = require("path");
const fs = require("fs");

try {
  const wildecard = core.getInput("wildecard");
  const filename = core.getInput("filename");
  const wildecardLength = wildecard.length;
  const originalVariables = {};
  let envContent = "";

  for (const key of Object.keys(process.env)) {
    if (key.startsWith(wildecard)) {
      const realKey = key.slice(wildecardLength);
      const value = process.env[key];

      originalVariables[key] = value;
      envContent += `${realKey}=${value}\n`;
    }
  }

  const envKeys = Object.keys(originalVariables);

  console.log(`Found ${envKeys.length} variables starting with ${wildecard}`);

  const filePath = path.join(process.env.GITHUB_WORKSPACE, filename);

  if (fs.existsSync(filePath)) {
    throw new Error(`File "${filePath}" already exists. Use a different name for the generated file`);
  }

  fs.writeFileSync(filePath, envContent, { encoding: "utf-8" });

  console.log(`File "${filename}" successfully created`);
} catch (error) {
  core.setFailed(error.message);
}
