import { nodeCrypto, Random } from "random-js";
import { sha256 } from "crypto-hash";
import { config } from "../config.js";

export function generateAllCombinations(images) {
  //https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
  const cartesian = (...a) =>
    a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
  const combinations = cartesian.apply(this, images);
  console.log(`Created ${combinations.length} combinations!`);
  return combinations;
}

function generateCombination(images) {
  const random = new Random(nodeCrypto);
  const combination = [];

  let color;
  let upperBound;
  let image;

  for (var i = 0; i < images.length; i++) {

    const isOption = config.optional_layers.find((x) => x == i); 
    if(isOption !== undefined && random.bool() == false){
      combination.push(undefined); 
      continue; 
    }

    const isColor = config.color_layers.find((x) => x == i);
    if (isColor !== undefined) {
      if (color == undefined) {
        upperBound = images[i].length - 1;
        image = random.integer(0, upperBound);
        color = images[i][image].replace(/(\w+_)/, "");
        color = color.replace(".png", "");
        combination.push(images[i][image]);
      } else {
        const colored_images = images[i].filter((x) => x.includes(color));
        upperBound = colored_images.length - 1;
        image = random.integer(0, upperBound);
        combination.push(colored_images[image]);
      }
    } else {
      upperBound = images[i].length - 1;
      image = random.integer(0, upperBound);
      combination.push(images[i][image]);
    }
  }
  return combination;
}

export async function generateRandomCombinations(images) {
  const map = new Map();
  const combinations = [];

  for (var k = 0; k < config.limit; k++) {
    let isValidCombination = false;

    while (!isValidCombination) {
      const combination = generateCombination(images);
      const hash_string = combination.toString();
      const hash = await sha256(hash_string);
      if (!map.has(hash)) {
        map.set(hash, true);
        combinations.push(combination);
        isValidCombination = true;
      }
    }
  }
  return combinations;
}
