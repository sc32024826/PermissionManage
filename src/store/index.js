import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // token: ''
    },
    mutations: {
        // setToken (state, token) {
        //     state.token = token
        // }
    },
    actions: {
        // setToken ({ commit }, token) {
        //     commit('setToken', token)
        // }
    },
    modules: {
        user,
        app
    }
})
