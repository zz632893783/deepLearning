const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const multer = require('multer');
const Jimp = require('jimp');

const predict = require('./predict');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/api/post', async (req, res) => {
	const requestBody = req.body;
	const predictResult = await predict.predictNumber(requestBody.pixelArray);
	res.json({
		data: predictResult[0]
	});
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post('/api/post/cifar10', upload.single('image'), async (req, res) => {
	const uploadImage = await Jimp.read(req.file.buffer);
    uploadImage.resize(32, 32);
    const width = uploadImage.getWidth();
    const height = uploadImage.getHeight();
    const pixels = []
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const pixel = uploadImage.getPixelColor(x, y);
            const { r, g, b } = Jimp.intToRGBA(pixel);
            row.push([r / 255, g / 255, b / 255]);
        }
        pixels.push(row);
    }
    const predictResult = await predict.predictCifar10(pixels);
    res.json({
        data: predictResult
    });
});

app.post('/api/post/tinyImagenet200', upload.single('image'), async (req, res) => {
    const uploadImage = await Jimp.read(req.file.buffer);
    uploadImage.resize(64, 64);
    const width = uploadImage.getWidth();
    const height = uploadImage.getHeight();
    const pixels = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const pixel = uploadImage.getPixelColor(x, y);
            const { r, g, b } = Jimp.intToRGBA(pixel);
            row.push([r / 255, g / 255, b / 255]);
        }
        pixels.push(row);
    }
    // console.log(pixels)
    const predictResult = await predict.predictTinyImagenet200(pixels);
    const [ left, top, right, bottom ] = predictResult
    // console.log('predictResult', predictResult)
    res.json({ left, top, right, bottom });
});
// 启动服务器
app.listen(9999, () => {
  	console.log(`Server is running on port ${9999}`);
});
