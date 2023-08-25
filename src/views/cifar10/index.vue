<template>
    <div class="page" v-loading="isLoading">
        <div class="fileupload">
            <input type="file" @change="selectImage" />
            <i class="plus" v-if="!imageUrl"></i>
            <canvas ref="canvasRef" width="256" height="256" v-show="imageUrl"></canvas>
        </div>
        <canvas ref="sRef" width="32" height="32" v-show="false"></canvas>
        <el-table class="table" :data="predictArray.sort((x, y) => y.probability - x.probability)">
            <el-table-column prop="category" label="类别"></el-table-column>
            <el-table-column prop="probability" label="预测概率">
                <template #default="scope">
                    {{ scope.row.probability.toFixed(2) }}%
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as tf from '@tensorflow/tfjs'
let model = null
const isLoading = ref(false)
const canvasRef = ref()
const sRef = ref()
const imageSrc = ref('')
const predict = ref([])
const categorys = ['飞机', '汽车', '鸟', '猫', '鹿', '狗', '青蛙', '马', '船', '卡车']
const predictArray = ref(categorys.map(category => ({ category, probability: 0 })))
let ctx = null
let sCtx = null
const imageUrl = ref('')
const selectImage = async e => {
    const file = e.target.files[0]
    imageUrl.value = URL.createObjectURL(file)
    e.target.value = null
    const img = document.createElement('img')
    img.src = imageUrl.value
    await new Promise(resolve => (img.onload = resolve))
    let startX
    let startY
    let size
    if (img.naturalWidth >= img.naturalHeight) {
        size = img.naturalHeight
        startX = (img.naturalWidth - size) / 2
        startY = 0
    } else {
        size = img.naturalWidth
        startX = 0
        startY = (img.naturalHeight - size) / 2
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(img, startX, startY, size, size, 0, 0, ctx.canvas.width, ctx.canvas.height)
    sCtx.drawImage(img, startX, startY, size, size, 0, 0, sCtx.canvas.width, sCtx.canvas.height)
    let pixels = sCtx
        .getImageData(0, 0, sCtx.canvas.width, sCtx.canvas.height)
        .data
        .filter((n, i) => (i + 1) % 4 !== 0)
    pixels = Array.from(pixels).map(n => n / 255)
    isLoading.value = true
    if (!model) {
        model = await tf.loadLayersModel(new URL('/models/cifar10/model.json', import.meta.url).href)
    }
    // 构建输入数据，这里假设你的模型接受一个形状为 [batch_size, input_size] 的输入
    const predictions = model.predict(tf.tensor4d( pixels, [1, 32, 32, 3] ));
    predictArray.value = predictions.arraySync()[0].map((n, i) => {
        return ({
            probability: n * 100,
            category: categorys[i]
        })
    });
    isLoading.value = false
}
onMounted(() => {
    ctx = canvasRef.value.getContext('2d')
    sCtx = sRef.value.getContext('2d')
})
</script>
<style lang="scss" scoped>
.page {
    display: grid;
    grid-template-columns: 300px 200px;
    .fileupload {
        width: 256px;
        height: 256px;
        position: relative;
        border: 1px dashed rgba(0, 0, 0, 0.4);
        border-radius: 8px;
        box-sizing: content-box;
        overflow: hidden;
        input {
            width: 100%;
            height: 100%;
            cursor: pointer;
            opacity: 0;
        }
        .plus {
            position: absolute;
            width: 64px;
            height: 64px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            &:before, &:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 4px;
                background-color: rgba(100, 100, 100, 1);
            }
            &:after {
                transform: translate(-50%, -50%) rotate(0deg);
            }
            &:before {
                transform: translate(-50%, -50%) rotate(90deg);
            }
        }
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        }
    }
    .table {
        border: 1px solid;
        width: 200px;
        border-radius: 4px;
    }
}
</style>