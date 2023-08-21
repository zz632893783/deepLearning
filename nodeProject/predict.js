const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function predictNumber(imageData) {
    // 加载模型
    const modelPath = path.join(__dirname, './models/my-model-4');
    const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    // 构建输入数据，这里假设你的模型接受一个形状为 [batch_size, input_size] 的输入
    const predictions = model.predict(tf.tensor4d(
        [
            imageData
        ]
    ));
    // 将预测结果转换为 JavaScript 数组
    const predictionsArray = predictions.arraySync()[0].map((n, i) => {
        return ({ probability: n * 100, num: i })
    });
    predictionsArray.sort((x, y) => y.probability - x.probability);
    return predictionsArray
}
module.exports = {
    predictNumber: predictNumber
};