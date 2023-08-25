const tf = require('@tensorflow/tfjs-node');
// const tf = require('@tensorflow/tfjs-node-gpu');
const load = require('@tensorflow-models/universal-sentence-encoder').load;
const Cifar10 = require('tfjs-cifar10').Cifar10;

(async () => {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [32, 32, 3],
        kernelSize: 5,
        filters: 32,
        activation: 'relu',
        padding: 'same'
    }));
    // model.add(tf.layers.dropout(0.3));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(tf.layers.conv2d({ kernelSize: 5, filters: 32, activation: 'relu', padding: 'same' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.conv2d({ kernelSize: 5, filters: 64, activation: 'relu', padding: 'same' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    // model.add(tf.layers.dropout(0.3));
    // model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    // model.add(tf.layers.conv2d({ kernelSize: 3, filters: 128, padding: 'same', activation: 'relu' }));
    // model.add(tf.layers.dropout(0.3));
    // model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    // model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
    // model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, padding: 'same', activation: 'relu' }));
    // model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
    // model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, padding: 'same', activation: 'relu' }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [1024] }));
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
    // model.add(tf.layers.dropout(0.5));
    model.summary();
    model.compile({
        // optimizer: tf.train.adam(1),
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    for (let time = 0; time < 10; time++) {
        const imageCount = 50000;
        const data = new Cifar10();
        await data.load();
        const database = data.nextTrainBatch(imageCount);
        const imageDatas = await database.xs.data();
        const labelDatas = await database.ys.data();
        const xs = tf.tensor4d(imageDatas, [imageCount, 32, 32, 3]);
        const ys = tf.tensor2d(Array.from(labelDatas), [imageCount, 10]);
        await model.fit(xs, ys, {
            epochs: 5,
            validationSplit: 0.15,
            batchSize: 320
        });
        xs.dispose();
        ys.dispose();
    }
    model.save('file://models/cifar10-9');
})()