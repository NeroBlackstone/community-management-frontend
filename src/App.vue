<template>
  <v-app :dark="darkTheme">
    <navbar @change-theme="darkTheme=!darkTheme"></navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
  import Navbar from './components/Navbar'
  import AppFooter from "./components/AppFooter";
export default {
  name: 'App',
  components: {
    AppFooter,
    Navbar,
  },
  data () {
    return {
      darkTheme:false,
    }
  }
}
</script>
