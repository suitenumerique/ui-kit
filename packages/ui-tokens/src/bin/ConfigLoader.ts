import path from "path";
import * as fs from "fs";
import deepmerge from "deepmerge";
import { ConfigShape } from "TokensGenerator";
import { workPath } from "Paths";
import { createJiti } from "jiti";
import Config from "./Config";

const getLocalConfig = async () => {
  const filename = Config.configurationFilenames
    .map((filename_) => path.join(workPath(), filename_))
    .find((filename_) => fs.existsSync(filename_));

  if (!filename) {
    console.log("No local config found, using default config.");
    return {};
  }
  console.log("Found local config file: " + filename);

  // Load TypeScript configs without depending on the consumer's compiler API.
  // jiti also handles configs in applications with "type": "module".
  const jiti = createJiti(__filename);
  return jiti.import<Partial<ConfigShape>>(filename, { default: true });
};

const getDistConfig = async () => {
  const config = await import("./cunningham");
  return config.default;
};

export const getConfig = async () => {
  const localConfig = await getLocalConfig();
  const distConfig = await getDistConfig();
  const config: ConfigShape = deepmerge(distConfig, localConfig);
  return config;
};
