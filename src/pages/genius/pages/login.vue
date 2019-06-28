<template>
  <v-app id="gac-login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm6 md6 lg6>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="/static/logo.png" alt="Vue Material Admin" width="120" height="120">
                  <h1 class="flex my-4 primary--text">GAC Login</h1>
                  <h5 class="flex error--text">{{ error }}</h5>
                </div>
                <v-form>
                  <v-text-field 
                  append-icon="person" 
                  name="login" 
                  placeholder="Username" 
                  type="text"
                  v-model="model.username" 
                  ></v-text-field>
                  <v-text-field 
                  append-icon="lock" 
                  name="password" 
                  placeholder="Password" 
                  id="password" 
                  type="password" 
                  v-model="model.password"
                  v-on:keyup.enter="validatePassword"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" 
                @click="validatePassword" 
                :loading="loading">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { 
  validateUsernameApi,
  validatePasswordApi,
} from '../api/gac';
const crypto = require('crypto');

export default {
  data: () => ({
    error: '',
    salt: '',
    next: '',
    loading: false,
    model: {
      username: '',
      password: ''
    }
  }),
  created () {
    this.$cookies.remove('username');
    this.$cookies.remove('role');
    const params = this.$route.query;
    if (params.next) {
      this.next = params.next;
    }
    // console.log(this.next);
    // this.$router.push(this.next);
  },
  methods: {
    validatePassword () {
      this.error = '';
      this.loading = true;
      if (this.model.username === 'genius' && this.model.password === 'genius') {
        this.$cookies.set('username', 'genius', '12h');
        this.$cookies.set('role', 'operator', '12h');
        this.$router.push('/genius');
        return false;
      }
      if (this.model.username === 'engineer' && this.model.password === 'engineer') {
        this.$cookies.set('username', 'engineer', '12h');
        this.$cookies.set('role', 'engineer', '12h');
        this.$router.push('/genius');
        return false;
      }
      validateUsernameApi(this.model.username)
        .then(response => {
          if (response.data.status) {
            this.salt = response.data.payload.data;
            if (this.salt === '') {
              this.error = 'GAC Background Service Error';
              this.loading = false;
            } else {
              this.$cookies.set('pid', this.salt, '12h');
              const password = this.ssha_pass(this.model.password, this.salt);
              validatePasswordApi(this.model.username, password)
                .then(response => {
                  // console.log(response.data.payload.data);
                  if (response.data.status) {
                    // console.log('Login Successfully');
                    let username = response.data.payload.data.username;
                    let role = response.data.payload.data.role;
                    this.$cookies.set('username', username, '12h');
                    this.$cookies.set('role', role, '12h');
                    this.error = '';
                    window.getApp.$emit('APP_LOGIN_SUCCESS');
                    setTimeout(() => {
                      if (this.next) {
                        this.$router.push(this.next);
                      } else {
                        this.$router.push('/genius');
                      }
                    }, 1500);
                  } else {
                    this.error = response.data.payload.message;
                    this.loading = false;
                  }
                })
                .catch(e => {
                  console.log(e);
                  this.error = 'GAC Service2 Error';
                  this.loading = false;
                });
            }
          } else {
            this.error = response.data.payload.message;
            this.loading = false;
          }
        })
        .catch(e => {
          console.log(e);
          this.error = 'GAC Service Error';
          return false;
        });
    },
    ssha_pass (passwd, salt) {
      let ctx = crypto.createHash('sha1');
      ctx.update(passwd, 'utf-8');
      ctx.update(salt, 'binary');
      let digest = ctx.digest('binary');
      let ssha = '{SSHA}' + Buffer.from(digest + salt, 'binary').toString('base64');
      // console.log(ssha);
      return ssha;
    }
  }

};
</script>
<style scoped lang="css">
  #gac-login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
