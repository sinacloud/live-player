<template>
	<div id="member">
		<el-row class="mt15">
            <el-col :span="20" :offset="2">
                <el-row>
                    <h4>新浪云在线直播</h4>
                </el-row>
			    <el-row>
                    <el-col :span="player_span">
                        <div class="player" v-if="liveStart">
                            <video-player :options="playerOptions" v-if="liveStart"></video-player>
                        </div>
                        <div class="player" v-else>
                            <!--not start-->
                            <el-row type="flex" justify="center">
                                <el-col :span="24" class="img_container">
                                    <img src="/images/unstarted.png" class="player_img">
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="barrage_span" v-if="barrage" class="barrage">
                        <!--弹幕列表-->
                        <el-row class="barrage_list" ref="barrage_list">
                            <ul class="barrage-content">
                                <li v-for="item in messages"><el-tag>{{item.username}}</el-tag>{{item.content}}</li> 
                            </ul>
                        </el-row>
                        <!--弹幕列表结束-->
                        <!--弹幕发送按钮-->
                        <el-row>
                            <el-form :inline="true" :model="formInline" class="demo-form-inline ml10">
                                <el-form-item label="" style="margin-right:0px;">
                                    <el-input type="textarea" v-model="formInline.content" placeholder="请输入发送的内容" class="barrageInput"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit">发送</el-button>
                                </el-form-item>
                            </el-form>
                        </el-row>
                        <!--弹幕发送按钮结束-->
                    </el-col>
                </el-row>
            </el-col>
		</el-row>
	</div>
</template>

<script type="text/javascript">
require('videojs-contrib-hls/dist/videojs-contrib-hls')
export default {
    data () {
        return {
            username: '匿名用户',
            // 判断直播是否已经开始
            liveStart: false,
            m3u8_base_address: 'http://live.sinacdn.com/play/',
            loading: false,
            // player configure
            playerOptions: {
                // videojs and plugin options
                language: 'zh-CN',
                sources: [{
                    withCredentials: false,
                    type: "application/x-mpegURL",
                    src: ""
                }],
                controlBar: {
                    timeDivider: false,
                    durationDisplay: false
                },
                flash: {
                    hls: {
                        withCredentials: false
                    }
                },
                html5: {
                    hls: {
                        withCredentials: false
                    }
                },
                poster: "/images/unstarted.png",
                height: 500,
            },
            formInline: {
                content: '',
            },
            // websocket link addr
            ws: '',
            ws_link: {},
            // 消息列表
            messages: [],
        }
    },
    components: {},
    computed: {
    	'channel': function() {
            // 从当前URL中获取channel ID
            return this.getParameterByName('channel');
        },
        'barrage': function() {
            // 从访问的URL中检查是否启用弹幕
            if (this.getParameterByName('barrage')) {
                return true;
            }
            return false;
        },
        'm3u8': function() {
            // 获取当前直播的m3u8文件地址
            return this.m3u8_base_address + this.channel + '.m3u8';
        },
        'player_span': function() {
            if (this.barrage) {
                return 18;
            } else {
                return 24;
            }
        },
        'barrage_span': function() {
            if (this.barrage) {
                return 6;
            } else {
                return 0;
            }
        }
    },
    watch: {
        
    },
    updated: function() {
        this.barrageListToEnd();
    },
    methods: {
        getParameterByName: function(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        initZoneList: function() {
            // 加载当前用户能管理的组列表
            var url = this.$store.state.api_base_url + '/ucenter/zone_list.html';
            var method = this.$store.state.http_request;
            this.$http[method](url, {}, {
                headers: {},
                emulateJSON: true
            }).then(function(response) {
                let retval = response.body;
                if (retval.code == 0) {
                    console.log(this.options);
                    console.log(this.options_value);
                    console.log(retval.data);
                    this.options = Array.from(retval.data.list);
                    this.options_value = Array.from(retval.data.root_node);
                } else {
                    // 修改规则错误
                    this.$message({
                        type: 'error',
                        message: retval.message
                    });
                }
            }, function(response) {
                this.$message({
                    type: 'error',
                    message: '系统错误，请刷新重试'
                });
            });
        },
        checkLiveStatus: function() {
            // check live status
            var url = this.m3u8;
            var method = 'get';
            this.$http[method](url, {}, {
                headers: {},
                emulateJSON: true
            }).then(function(response) {
                // status code 200
                if (this.liveStart == false) {
                    this.startLive();
                    this.liveStart = true;
                }
            }, function(response) {
                console.log('live not start');
                if (this.liveStart == true) {
                    this.endLive();
                    this.liveStart = false;
                }
            });
        },
        startLive: function() {
            // 开始直播动作
        },
        endLive: function() {
            // 结束直播动作
        },
        playerReadied(player) {
            var hls = player.tech({
                IWillNotUseThisInPlugins: true
            }).hls
            player.tech_.hls.xhr.beforeRequest = function(options) {
                console.log(options)
                return options
            }
        },
        beforeReady: function(player) {
            console.log(player);
        },
        onPlayerLoadeddata(player) {
            console.log('player Loadeddata!', player)
        },
        onSubmit: function() {
            if (!this.formInline.content) {
                this.$message({
                    type: 'info',
                    message: '请输出弹幕内容。'
                });
                return false;
            }
            var post_data = {};
            post_data.username = this.username;
            post_data.content = this.formInline.content; 
            try {
                this.ws_link.send(JSON.stringify(post_data));
                this.formInline.content = '';
            } catch (e) {
                console.log(e);
            }
        },
        barrageListToEnd: function() {
            // 将弹幕列表的滚动条更新到底部
            if (!this.barrage) {
                // 未开启弹幕功能
                return false;
            }
            if (this.$refs['barrage_list'] !== undefined) {
                this.$refs.barrage_list.$el.scrollTop = this.$refs.barrage_list.$el.scrollHeight;
            }
        },
        getWs: function() {
            this.messages.push({username: '系统消息', content: '正在连接弹幕服务器'});
            this.ws = 'ws://barrage.applinzi.com/' + this.channel;
            this.ws_link = new WebSocket(this.ws);
            this.ws_link.onmessage =  this.wsMessageRecieve;
            this.ws_link.onclose = this.wsMessageClose;
            this.ws_link.onopen = this.wsMessageOpen;
        },
        wsMessageRecieve: function(message) {
            // websocket recieve message
            // console.log('ws message recieved');
            if (message.data) {
                if (message.data == '1_1') {
                    return true;
                }
                this.messages.push(JSON.parse(message.data));
                this.barrageListToEnd();
            }
        },
        wsMessageOpen: function(data) {
            this.messages.push({username: '系统消息', content: '连接弹幕服务器成功'});
        },
        wsMessageClose: function() {
            this.messages.push({username: '系统消息', content: '弹幕服务器失去连接，重连中..'});
            this.getWs();
        },
        sendHeartBeat: function() {
            // 心跳包
            this.ws_link.send('_1_');
        },
    },
    mounted: function() {
        if (this.channel) {
            console.log('update m3u8 address...');
            this.playerOptions.sources[0].src = this.m3u8;
        } else {
            this.$message({
                type: 'error',
                message: '参数错误，未获取直播间参数。'
            });
            // 如果初始化参数错误，就没必要再新建定时器了。
            return false;
        }
        if (this.barrage) {
            // get ws 
            this.getWs();
            this.barrageListToEnd();
        }
        var _this = this;
        this.checkLiveStatus();
        setInterval(function() {
            _this.checkLiveStatus();
        }, 1500);
        setInterval(function() {
            _this.sendHeartBeat();
        }, 15000);
    },
}	
</script>

<style scoped>
.mt15 {
	margin-top: 15px;
}
.player {
    width: 100%;
    height: 500px;
    background-color: #333333;
    overflow: hidden;
}
.img_container {
    max-width: 889px;
}
.player_img {
    height: 500px;
}
.barrage {
    height: 500px;
    border: 1px solid #eaeefb;
    border-radius: 4px;
    transition: .2s;
}
.barrage_list {
    height: 440px;
    overflow: auto;
}
.barrage-content {
    list-style: none;
}
.barrage-content li {
    margin-left: -30px;
    margin-bottom: 5px;
}
.ml10 {
    margin-left: 10px;
}
.barrageInput {
    max-height: 54px;
}
</style>
<style >
.el-textarea__inner {
    max-height: 54px;
}
</style>