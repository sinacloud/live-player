import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    api_base_url: '',
    http_request: 'jsonp',
    interval_list: [],
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    add_interval(state, interval_id) {
        state.interval_list.push(interval_id);
    },
    del_interval(state, interval_id) {
        state.interval_list.pop(interval_id);
    }
}

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
    add_interval({
        commit
    }, interval_id) {
        commit('add_interval', interval_id);
    },
    del_interval({
        commit
    }, interval_id) {
        commit('del_interval', interval_id);
    },
}

// getters are functions
const getters = {
    evenOrOdd: function(state) {
        return state.count % 2 === 0 ? 'even' : 'odd'
    },
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})