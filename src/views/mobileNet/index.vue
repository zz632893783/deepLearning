<template>
	<video class="capture" width="277" height="277" ref="captureRef"></video>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as tf from '@tensorflow/tfjs'

const captureRef = ref()

const loadCamera = async () => {
	window.stream && window.stream.getTracks().forEach(track => track.stop())
	const constraints = {
		audio: false,
		video: {
			sourceId: 'default',
			facingMode: { exact: 'user' }
		}
	}
	const stream = await navigator.mediaDevices.getUserMedia(constraints)
	try {
		window.stream = stream
		captureRef.value.srcObject = window.stream
	} catch (e) {
		captureRef.value.src = window.URL.createObjectURL(stream)
	}
}

onMounted(() => {
	loadCamera()
})
</script>
<style lang="scss" scoped>
.capture {
	border: 1px solid;
}
</style>