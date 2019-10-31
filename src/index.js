/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */


import "babel-polyfill";

import Vue from "vue";
/*import VueMaterial from "vue-material";*/
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'

// import VueBootstrap from "bootstrap-vue";
// import VueInsProgressBar from "vue-ins-progress-bar";

// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css";

// import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

import App from "./app.vue";
// import VueSidebarMenu from 'vue-sidebar-menu/src/index'

// Vue.use(VueSidebarMenu);import vu

//import Vuesax from "vuesax";
//import "vuesax/dist/vuesax.css";

Vue.use(Vuetify);
//Vue.use(Vuesax);
/*Vue.use(VueMaterial);*/

new Vue(App).$mount("#app");