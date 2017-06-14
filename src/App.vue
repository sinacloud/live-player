<template>
    <div id="app">
        <el-row>
            <router-view></router-view> 
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {
            msg: 'SPA',
        }
    },
    components: {},
    methods: {},
    mounted: function() {},
}
</script>

<style>
body {
    margin: 0px;
}
#app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: #F9FAFC;
    height: 100vh;    
}
</style>