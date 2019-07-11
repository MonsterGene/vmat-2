<template>
  <v-app id="gac-logout" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md8 lg8>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <!-- <img src="/static/logo.png" alt="Vue Material Admin" width="120" height="120"> -->
                  <h1 class="flex my-4 primary--text">Thank You!</h1>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Vue from 'vue';
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

export default {
  data: () => ({
  }),
  mounted () {
    this.LogoutGac();
  },
  methods: {
    LogoutGac () {
      this.$cookies.remove('username');
      this.$cookies.remove('role');
      this.$cookies.remove('pid');
      setTimeout(() => {
        this.$router.push('/genius/login');
      }, 3000);
    }
  }

};
</script>
<style scoped lang="css">
  #gac-logout {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
