import jimp from 'jimp';
import { config } from '../config.js';

export async function generateImages(layers, combinations) {
    console.log(`Generating images. Wait.`);
    const length = config.isLimited ? limit : combinations.length;
    for (var k = 0; k < length; k++) {
        const base = await jimp.read(`./Layers/${layers[0]}/${combinations[k][0]}`);
        for (var i = 1; i < layers.length; i++) {
            if(combinations[k][i] === undefined) continue; 
            const image = await jimp.read(`./Layers/${layers[i]}/${combinations[k][i]}`);
            base.blit(image, 0, 0);
        }
        await base.writeAsync(`./Output/Images/${k + 1}.png`);
        console.log(`Generated image #${k + 1}`);
    }
    console.log('Successfully generated images :)');
}