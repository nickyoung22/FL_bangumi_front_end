<template>
    <div class="main_func">
        <div class="left">
            <el-button type="primary" @click="open">打开配置文件</el-button>
            <hr>
            <el-button type="primary" @click="backup">备份数据库</el-button>
        </div>
        <div class="right">
            <JsonViewer :expand-depth="2" :value="system_info"></JsonViewer>
        </div>

    </div>
</template>
 
<script>
import { useStore } from '@/stores/store.js'
import JsonViewer from 'vue-json-viewer'

export default {
    setup() {
        const store = useStore()
        return { store }
    },

    components: { JsonViewer },
    data() {
        return {
            ComponentName: 'System_Info_page.vue',
            system_info: {}
        }
    },
    computed: {},
    methods: {
        open() {
            this.$axios.get(this.store.api_server + '/system_info/open')
        },
        backup() {
            this.$axios.get(this.store.api_server + '/system_info/backup', {
                params: {
                    type_arr: Object.keys(this.system_info.resources_INFO),
                    time: new Date().toLocaleString()
                }
            })

        }
    },
    created() {
        this.$axios.get(this.store.api_server + '/system_info/get').then(res => {
            // console.log(res)
            this.system_info = res
        })
    },
    mounted() { }
}
</script>

<style scoped lang="less">
.main_func {
    display: flex;

    .left {
        flex: 1;

        .el-button {
            display: block;
            width: 88%;
            margin: 0 auto;
            margin-top: 8px;
            margin-bottom: 8px;
        }
    }

    .right {
        flex: 4;
    }
}
</style>
