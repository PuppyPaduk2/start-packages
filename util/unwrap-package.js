const { resolve } = require("path");
const { readFile } = require("fs/promises");

const spawn = require("./spawn");

async function unwrapPackage({
  fromDir = __dirname,
  toDir = process.env.INIT_CWD,
} = {}) {
  const fromPackageJsonFile = resolve(fromDir, "./package.json");
  const fromJson = await readJson(fromPackageJsonFile);
  const mainDeps = buildDependencies(fromJson.dependencies);
  const devDeps = buildDependencies(fromJson.devDependencies);

  await installDependencies("--save", mainDeps, toDir);
  await installDependencies("--save-dev", devDeps, toDir);
  await uninstallCurrentPackage(fromJson.name, toDir);
}

async function readJson(path) {
  try {
    const raw = await readFile(path);
    return JSON.parse(raw.toString());
  } catch {
    return {};
  }
}

function buildDependencies(dependencies) {
  const packages = [];

  for (const key in dependencies) {
    packages.push(`${key}@${dependencies[key]}`);
  }

  return packages;
}

async function installDependencies(flag, dependencies, cwd) {
  const args = ["install", flag, ...dependencies];
  return await spawn("npm", args, { cwd, onCreate: spawn.pipe });
}

async function uninstallCurrentPackage(packageName, cwd) {
  return await spawn("npm", ["uninstall", packageName], {
    cwd,
    onCreate: spawn.pipe,
  });
}

module.exports = unwrapPackage;
