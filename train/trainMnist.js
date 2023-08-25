const mnist = require('mnist');
const tf = require('@tensorflow/tfjs-node');

const model = tf.sequential();
model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 3,
    filters: 16,
    activation: 'relu'
}));
model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
model.add(tf.layers.flatten({}));
model.add(tf.layers.dense({ units: 64, activation: 'relu' })); // Increased units
model.add(tf.layers.dropout(0.5));
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
model.summary();
model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
});
(async () => {
    const xs = [];
    const labels = [];
    const set = mnist.set(8000, 2000);
    set.training.forEach(a => {
        const v = [];
        let temp;
        a.input.forEach((n, i) => {
            if (i % 28 === 0) {
                temp = [];
                v.push(temp);
            }
            temp.push([n]);
            // temp.push([Math.floor(n * 255)]);
        });
        xs.push(v);
        labels.push(a.output);
    });
    // console.log(JSON.stringify(xs[0]));
    await model.fit(tf.tensor4d(xs), tf.tensor2d(labels), {
        batchSize: 320,
        validationSplit: 0.15,
        epochs: 20,
        callbacks: {
            onBatchEnd: async () => {},
            onEpochEnd: async () => {}
        }
    });
    model.save('file://models/my-model-19');
})();