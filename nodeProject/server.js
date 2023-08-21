const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
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

// 启动服务器
app.listen(9999, () => {
  	console.log(`Server is running on port ${9999}`);
});