// load-env-and-prisma.js
require("dotenv").config({ path: ".env.local" });
const { execSync } = require("child_process");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a Prisma command to run.");
  process.exit(1);
}

const command = args.join(" ");

try {
  execSync(`npx prisma ${command}`, { stdio: "inherit" });
} catch (error) {
  console.error("Error running Prisma command:", error.message);
  process.exit(1);
}
