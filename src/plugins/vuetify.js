import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/en'

Vue.use(Vuetify, {
  iconfont: 'md',
  lang:{
    locales: {zhHans,en},
    current: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zhHans'
  }
});
