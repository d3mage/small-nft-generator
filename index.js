import fs from "fs";
import "dotenv/config";
import { config } from "./config.js";
import {
  generateAllCombinations,
  generateRandomCombinations,
} from "./Scripts/Combinations.js";
import { generateImages } from "./Scripts/Images.js";
import { generateMetadata } from "./Scripts/Metadata.js";

async function loadLayersIntoMemory() {
  const folders = await fs.promises.readdir("./Layers");
  const layers = [];
  const images = [];
  for (const folder of folders) {
    const files = await fs.promises.readdir(`./Layers/${folder}`);
    layers.push(folder);
    images.push(files);
  }
  return { layers, images };
}

async function clearOutput() {
  const folders = await fs.promises.readdir("./Output");
  for (const folder of folders) {
    const files = await fs.promises.readdir(`./Output/${folder}`);
    for (const file of files) {
        await fs.promises.unlink(`./Output/${folder}/${file}`); 
    }
  }
}

async function act() {
  await clearOutput();
  const { layers, images } = await loadLayersIntoMemory();
  let combinations;
  if (config.isRandom) {
    combinations = await generateRandomCombinations(images);
  } else {
    combinations = await generateAllCombinations(images);
  }
  await generateImages(layers, combinations);
  // await generateMetadata(layers, combinations);
}
act();
