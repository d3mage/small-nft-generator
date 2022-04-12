import fs from "fs";
import path from "path";
import mime from "mime";
import { config } from "../config.js";
import { NFTStorage, File } from "nft.storage";

const API_KEY = process.env.STORAGE_KEY;
const storage = new NFTStorage({ token: API_KEY });

async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
}

export async function generateMetadata(layers, combinations) {
  console.log(`Generating metadata. Wait.`);
  try {
    await fs.promises.mkdir(`./Output/Metadata/`);
  } catch {}

  const length = config.isLimited ? 5 : combinations.length;
  for (var k = 0; k < length; k++) {
    console.log(combinations[k]);
    const traits = [];
    for (var i = 1; i < layers.length; i++) {
      if (combinations[k][i] == undefined) continue;
      const type = layers[i].replace(/[0-9]+_/, "");
      const value = combinations[k][i].replace(".png", "");
      traits.push({
        trait_type: type,
        value: value,
      });
    }
    // const name = `NFT Human #${k + 1}`;
    // const description = 'so human\n much nft';
    // const filePath = `./Output/Images/${k + 1}.png`;
    // const image = await fileFromPath(filePath);

    console.log(traits);

    // const metadata = await storage.store({
    //     name,
    //     description,
    //     image,
    //     traits
    // });

    // const url = metadata.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    // console.log(url);
    // await fs.promises.appendFile(`./Output/Metadata/${k + 1}.txt`, url);
  }
}
