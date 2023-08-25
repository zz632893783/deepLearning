<template>
    <div class="page">
        <div class="left">
            <div class="row">
                <label>手写区域：</label>
                <canvas ref="canvasRef" width="280" height="280" @mousedown="mousedownFunc" @mousemove="mousemoveFunc" @mouseup="mouseupFunc" @contextmenu.stop.prevent></canvas>
            </div>
            <div class="row">
                <label>转化区域：</label>
                <canvas ref="transformRef" width="28" height="28"></canvas>
            </div>
        </div>
        <div class="right">
            <el-table :data="predictionsArray">
                <el-table-column prop="num" label="数字"></el-table-column>
                <el-table-column label="预测概率">
                    <template #default="scope">
                        {{ (scope.row.probability).toFixed(2) }}%
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="bottom">
            <el-button @click="clear">清 除</el-button>
            <el-button @click="predict">识 别</el-button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as tf from '@tensorflow/tfjs'
let ctx;
let transformCtx;
const canvasRef = ref();
const transformRef = ref();
const predictValue = ref('');
const predictionsArray = ref([]);
const mouseState = { keydown: false, path: [] };
onMounted(() => {
    ctx = canvasRef.value.getContext('2d');
    transformCtx = transformRef.value.getContext('2d');
});
const mousedownFunc = e => {
    mouseState.keydown = true;
    mouseState.path = [{
        x: e.offsetX,
        y: e.offsetY
    }];
};
const mousemoveFunc = e => {
    if (mouseState.keydown) {
        mouseState.path.push({
            x: e.offsetX,
            y: e.offsetY
        });
        // 绘制轨迹
        ctx.beginPath();
        mouseState.path.forEach((point, index) => {
            ctx[index === 0 ? 'moveTo' : 'lineTo'](point.x, point.y);
        });
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.closePath();
    }
};
const mouseupFunc = e => {
    mouseState.keydown = false;
    mouseState.path = [];
    e.button === 0 && predict();
    e.button === 2 && clear();
};
const clear = () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
const predict = async () => {
    // 转化成 28 x 28
    transformCtx.clearRect(0, 0, transformCtx.canvas.width, transformCtx.canvas.height);
    transformCtx.beginPath();
    transformCtx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, transformCtx.canvas.width, transformCtx.canvas.height);
    transformCtx.closePath();
    const imageData = transformCtx.getImageData(0, 0, 28, 28).data;
    const tempArray = [];
    for (let i = 3; i < imageData.length; i = i + 4) {
        tempArray.push(imageData[i] / 255);
    }
    const pixelArray = [];
    let temp = [];
    for (let i = 0; i < tempArray.length; i++) {
        if (i % 28 === 0) {
            temp = [];
            pixelArray.push(temp);
        }
        temp.push([tempArray[i]]);
    }
    const model = await tf.loadLayersModel(new URL('/models/mnist/model.json', import.meta.url).href)
    // // 构建输入数据，这里假设你的模型接受一个形状为 [batch_size, input_size] 的输入
    const predictions = model.predict(tf.tensor4d(
        [
            pixelArray
        ]
    ));
    // 将预测结果转换为 JavaScript 数组
    predictionsArray.value = predictions.arraySync()[0].map((n, i) => {
        return ({ probability: n * 100, num: i })
    });
    predictionsArray.value.sort((x, y) => y.probability - x.probability);
};
</script>
<style lang="scss" scoped>
.page {
    display: grid;
    grid-template-columns: 512px 200px;
    .row {
        display: grid;
        grid-template-columns: 100px minmax(0, 1fr);
        margin-bottom: 12px;
        label {
            vertical-align: text-top;
            line-height: 36px;
            font-weight: 600;
        }
        canvas {
            border: 1px solid;
        }
        // border: 1px solid;
    }
}
</style>