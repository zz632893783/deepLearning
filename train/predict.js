const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function predictNumber(imageData) {
    // 加载模型
    const modelPath = path.join(__dirname, './models/my-model-16');
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
async function predictCifar10(imageData) {
    // console.log(JSON.stringify(imageData))
    const modelName = 'cifar10-8';
    console.log('使用模型:', modelName);
    const modelPath = path.join(__dirname, `./models/${modelName}`);
    const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    // 构建输入数据，这里假设你的模型接受一个形状为 [batch_size, input_size] 的输入
    const predictions = model.predict(tf.tensor4d(
        [
            imageData
        ]
    ));
    // console.log(predictions.arraySync())
    // 将预测结果转换为 JavaScript 数组
    const predictionsArray = predictions.arraySync()[0].map((n, i) => {
        return ({
            probability: n * 100,
            category: ['飞机', '汽车', '鸟', '猫', '鹿', '狗', '青蛙', '马', '船', '卡车'][i]
        })
    });
    predictionsArray.sort((x, y) => y.probability - x.probability);
    return predictionsArray
}

async function predictTinyImagenet200(imageData) {
    // console.log(JSON.stringify(imageData))
    const modelName = 'tinyImagenet200-2';
    console.log('使用模型:', modelName);
    const modelPath = path.join(__dirname, `./models/${modelName}`);
    const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    // 构建输入数据，这里假设你的模型接受一个形状为 [batch_size, input_size] 的输入
    const predictions = model.predict(tf.tensor4d(
        [
            imageData
        ]
    ));
    const predictionsArray = predictions.arraySync()[0];
    // console.log(predictionsArray);
    // // console.log(predictions.arraySync())
    // // 将预测结果转换为 JavaScript 数组
    // const predictionsArray = predictions.arraySync()[0].map((n, i) => {
    //     return ({
    //         probability: n * 100,
    //         category: ['飞机', '汽车', '鸟', '猫', '鹿', '狗', '青蛙', '马', '船', '卡车'][i]
    //     })
    // });
    // predictionsArray.sort((x, y) => y.probability - x.probability);
    return predictionsArray
}

module.exports = { predictNumber, predictCifar10, predictTinyImagenet200 };
