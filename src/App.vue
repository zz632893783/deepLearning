<template>
    <el-container class="root">
        <el-aside width="200px">
            <el-menu size="small" :default-active="defaultActive">
                <el-menu-item v-for="(routerItem) in routes.filter(n => !!n.path)" :index="routerItem.path" :key="routerItem.path" @click="changeRouter(routerItem)">{{ routerItem.cName }}</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { routes } from './router/index.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const defaultActive = computed(() => route.path);

const changeRouter = item => route.path !== item.path && router.push({ path: item.path })
onMounted(() => {
    console.log(route.path)
})
</script>
<style lang="scss" scoped>
.root {
    height: 100vh;
}
aside {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    background-color: rgba(64, 158, 255, 0.1);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    .el-menu {
        background-color: transparent;
        border-right: 0;
    }
    .el-menu-item {
        height: 48px;
        &.is-active {
            background-color: rgba(64, 158, 255, 0.3);
            border-radius: 4px;
        }
    }
}
</style>
