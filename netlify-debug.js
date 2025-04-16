/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function diagnoseNetlifyDeployment() {
  console.log("🔍 Starting Enhanced Netlify Deployment Diagnosis...\n");

  const checks = [
    checkNextConfig,
    checkNetlifyConfig,
    checkDependencies,
    checkBuildOutput,
    checkNodeVersion,
    checkNetlifyRedirects,
    checkExportConfig,
    checkSSRConfig,
  ];

  const issues = [];

  for (const check of checks) {
    try {
      const checkIssues = await check();
      if (checkIssues) {
        issues.push(...checkIssues);
      }
      console.log("-------------------\n");
    } catch (error) {
      console.error(`❌ Error during ${check.name}:`, error);
      issues.push(`Error in ${check.name}: ${error.message}`);
    }
  }

  if (issues.length > 0) {
    console.log("\n🚨 Potential Issues Found:");
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
}

function checkNextConfig() {
  console.log("📁 Checking Next.js configuration...");
  const issues = [];

  const nextConfigPath = path.join(process.cwd(), "next.config.js");
  if (!fs.existsSync(nextConfigPath)) {
    issues.push("next.config.js not found");
    return issues;
  }

  const config = require(nextConfigPath);
  console.log("✅ next.config.js found");

  // Check for problematic configuration
  if (config.output === "export" && !config.images?.unoptimized) {
    issues.push(
      "Static export requires images.unoptimized = true in next.config.js"
    );
  }

  if (config.experimental?.appDir && !config.output) {
    issues.push(
      "App Router might need explicit output configuration for Netlify"
    );
  }

  return issues;
}

function checkNetlifyConfig() {
  console.log("📁 Checking Netlify configuration...");
  const issues = [];

  const netlifyConfigPath = path.join(process.cwd(), "netlify.toml");
  if (!fs.existsSync(netlifyConfigPath)) {
    issues.push("netlify.toml not found - this may cause deployment issues");
    return issues;
  }

  const config = fs.readFileSync(netlifyConfigPath, "utf8");

  // Check for common configuration issues
  if (
    !config.includes('publish = ".next"') &&
    !config.includes('publish = "out"')
  ) {
    issues.push(
      "Publish directory might be incorrectly configured in netlify.toml"
    );
  }

  if (
    !config.includes('command = "npm run build"') &&
    !config.includes('command = "yarn build"')
  ) {
    issues.push("Build command might be missing in netlify.toml");
  }

  return issues;
}

function checkNetlifyRedirects() {
  console.log("🔄 Checking Netlify redirects...");
  const issues = [];

  const netlifyConfigPath = path.join(process.cwd(), "netlify.toml");
  if (fs.existsSync(netlifyConfigPath)) {
    const config = fs.readFileSync(netlifyConfigPath, "utf8");

    // Check for SPA redirect
    if (!config.includes("/*") || !config.includes("status = 200")) {
      issues.push(
        "Missing SPA redirect rule in netlify.toml - may cause blank pages on direct URL access"
      );
    }
  }

  return issues;
}

function checkExportConfig() {
  console.log("📤 Checking export configuration...");
  const issues = [];

  const packagePath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packagePath)) {
    const package = require(packagePath);

    // Check build script
    if (package.scripts?.build?.includes("next export")) {
      issues.push(
        'next export is deprecated in Next.js 13+. Use output: "export" in next.config.js instead'
      );
    }
  }

  return issues;
}

function checkSSRConfig() {
  console.log("🖥️  Checking SSR configuration...");
  const issues = [];

  const nextConfigPath = path.join(process.cwd(), "next.config.js");
  if (fs.existsSync(nextConfigPath)) {
    const config = require(nextConfigPath);

    if (config.output === "export") {
      // Check for API routes with static export
      const pagesApiDir = path.join(process.cwd(), "pages", "api");
      const appApiDir = path.join(process.cwd(), "app", "api");

      if (
        (fs.existsSync(pagesApiDir) || fs.existsSync(appApiDir)) &&
        config.output === "export"
      ) {
        issues.push(
          'API routes are not supported with static export (output: "export")'
        );
      }
    }
  }

  return issues;
}

function checkDependencies() {
  console.log("📦 Checking dependencies...");

  const packagePath = path.join(process.cwd(), "package.json");
  const packageLockPath = path.join(process.cwd(), "yarn.lock");

  if (!fs.existsSync(packagePath)) {
    console.log("⚠️  package.json not found!");
    return;
  }

  const package = require(packagePath);
  console.log("Dependencies:", JSON.stringify(package.dependencies, null, 2));
  console.log(
    "DevDependencies:",
    JSON.stringify(package.devDependencies, null, 2)
  );

  // Check for common missing dependencies
  const criticalDeps = ["next", "react", "react-dom", "pino-pretty"];
  criticalDeps.forEach((dep) => {
    if (!package.dependencies[dep] && !package.devDependencies[dep]) {
      console.log(`⚠️  Missing critical dependency: ${dep}`);
    }
  });
}

function checkBuildOutput() {
  console.log("🏗️  Checking build output...");

  const nextBuildPath = path.join(process.cwd(), ".next");
  if (!fs.existsSync(nextBuildPath)) {
    console.log("⚠️  .next directory not found! Try running build first.");
    return;
  }

  console.log("✅ .next directory found");
  console.log("Build files:", fs.readdirSync(nextBuildPath));
}

function checkNodeVersion() {
  console.log("🔧 Checking Node.js version...");

  const nvmrcPath = path.join(process.cwd(), ".nvmrc");
  const currentVersion = process.version;

  console.log("Current Node version:", currentVersion);

  if (fs.existsSync(nvmrcPath)) {
    const nvmrcVersion = fs.readFileSync(nvmrcPath, "utf8").trim();
    console.log(".nvmrc version:", nvmrcVersion);
  } else {
    console.log("⚠️  No .nvmrc file found");
  }
}

diagnoseNetlifyDeployment();
