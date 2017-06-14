import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import "element-ui/lib/theme-default/index.css"
import VueRouter from 'vue-router'
import VueCookie from 'vue-cookie'
import Icon from 'vue-awesome/components/Icon.vue'
import 'vue-awesome/icons'
import store from './store'
import VueVideoPlayer from 'vue-video-player'

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueCookie)
Vue.component('icon', Icon)
Vue.use(VueVideoPlayer)

const Parent = {
    template: `
    <div class="parent">
      <router-view class="child"></router-view>
    </div>
  `
}

const ParentHome = {
    template: `
    <div class="parent-home">
      <router-view class="child-home"></router-view>
    </div>
  `
}
import index from './component/index.vue'

const routes = [{
    path: '/live',
    component: ParentHome,
    children: [{
        path: '',
        redirect: 'play'
    }, {
        path: 'play',
        component: index,
    }, {
        path: '*',
        redirect: 'play'
    }],
    meta: {
        title: '直播详情',
        closeleft: true
    }
}, {
    path: '*',
    redirect: '/live'
}]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})

router.beforeEach(function(route, redirect, next) {
    // 将页面定位到顶部
    window.scrollTo(0, 0);
    // 如果有定时器，销毁定时器
    if (store.state.interval_list.length) {
        for (var s in store.state.interval_list) {
            console.log('clean called');
            clearInterval(store.state.interval_list[s]);
            store.dispatch('del_interval', store.state.interval_list[s]);
        }
    }
    next()
})

new Vue({
    router: router,
    store,
    el: '#app',
    render: function(h) {
        return h(App)
    }
})