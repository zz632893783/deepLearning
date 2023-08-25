const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');

const model = tf.sequential();
model.add(tf.layers.conv2d({
	inputShape: [64, 64, 3],
	filters: 16,
	kernelSize: 3,
	activation: 'relu',
	padding: 'same'
}));
// model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
// 添加更多卷积层、池化层等
model.add(tf.layers.flatten());
model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
model.add(tf.layers.dense({ units: 4, activation: 'linear' }));
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

// const positionRows = fs.readFileSync('./tiny-imagenet-200/train/n01443537/n01443537_boxes.txt', 'utf8').split('\n');
// positionRows.pop();
// let max = 0;
// positionRows.forEach(positionRow => {
// 	const [left, top, right, bottom] = positionRow.split(/\t/).slice(1);
// 	// max = Math.max(left, top, right, bottom) > max ? Math.max(left, top, right, bottom) : max;
// });
// for (let time = 0; time < 10; time++) {
// 	const imageCount = 1024;
// }

const trainDirs = fs.readdirSync('./tiny-imagenet-200/train');
const dirCache = {};
const imageNamePositionCache = {};
(async () => {
	for (let time = 0; time < 10; time++) {
		const pixels = [];
		const labels = [];
		const imageCount = 1024 * 1;
		// 每一轮获取多少张图片
		for (let count = 0; count < imageCount; count++) {
			const dir = trainDirs[Math.floor(trainDirs.length * Math.random())];
			if (dirCache[dir] === undefined) {
				const positionRows = fs.readFileSync(`./tiny-imagenet-200/train/${dir}/${dir}_boxes.txt`, 'utf8').split('\n').filter(n => !!n);
				positionRows.forEach(row => {
					const info = row.split(/\t/).filter(n => !!n);
					const fileName = info[0];
					// const [left, top, right, bottom] = info.slice(1);
					imageNamePositionCache[fileName] = info.slice(1).map(n => Number(n));
				});
				const imageNames = fs.readdirSync(`./tiny-imagenet-200/train/${dir}`);
				dirCache[dir] = imageNames.length;
			}
			const imageName = `${dir}_${Math.floor(dirCache[dir] * Math.random())}.JPEG`;
			// 单张图片的位置信息
			labels.push(imageNamePositionCache[imageName]);
			const image = await Jimp.read(`./tiny-imagenet-200/train/${dir}/images/${imageName}`);
			for (let y = 0; y < 64; y++) {
				for (let x = 0; x < 64; x++) {
					const pixel = image.getPixelColor(x, y);
					const { r, g, b } = Jimp.intToRGBA(pixel);
					pixels.push(r / 255, g / 255, b / 255);
				}
			}
		}
		const xs = tf.tensor4d(pixels, [imageCount, 64, 64, 3]);
        const ys = tf.tensor2d(labels, [imageCount, 4]);
        await model.fit(xs, ys, {
            epochs: 16,
            validationSplit: 0.15,
            batchSize: 320
        });
        xs.dispose();
        ys.dispose();
	}
    model.save('file://models/tinyImagenet200-2');
})()
