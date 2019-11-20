<template>
  <v-app-bar
    :color="$vuetify.theme.primary"
    fixed
    dark
    app
    >
      <v-toolbar-title class="ml-0 pl-1">
        <v-app-bar-nav-icon @click.stop="handleDrawerToggle"></v-app-bar-nav-icon>
      </v-toolbar-title>
      <v-text-field
        text
        clearable
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"
        v-on:keyup.enter="onEnter"
        v-model="userInput"
      >
      </v-text-field>
      <v-spacer></v-spacer>     
      <v-btn icon @click="showToolBar()">
        <v-icon>{{ alignIcon }}</v-icon>
      </v-btn>
      <v-btn icon @click="handleFullScreen()">
        <v-icon>fullscreen</v-icon>
      </v-btn>
      <!-- <v-menu offset-y origin="center center" class="elelvation-1" :nudge-bottom="14" transition="scale-transition">
        <v-btn icon text slot="activator">
        <v-badge color="red" overlap>
          <v-icon medium>notifications</v-icon>
        </v-badge>
        </v-btn>
        <notification-list></notification-list>
      </v-menu> -->

      <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon large text slot="activator">
            <v-avatar size="30px">
              <img src="/static/logo.png" alt="Robin Wu"/>
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item v-for="(item,index) in items" :to="!item.href ? { name: item.name } : null" :href="item.href" @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="index">
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      
  </v-app-bar>
</template>
<script>
import NotificationList from '@/components/widgets/list/NotificationList';
import Util from '@/util';
import store from '../pages/vision/store';
export default {
  name: 'app-toolbar',
  components: {
    NotificationList,
    store,
  },
  data: () => ({
    items: [
      {
        icon: 'fullscreen_exit',
        href: '#',
        title: 'Logout',
        click: (e) => {
          window.getApp.$emit('APP_LOGOUT');
        }
      }
    ],
    userInput: '',
    alignIcon: 'vertical_align_top',
  }),
  computed: {
    toolbarColor () {
      return this.$vuetify.options.extra.mainNav;
    }
  },
  methods: {
    handleDrawerToggle () {
      window.getApp.$emit('APP_DRAWER_TOGGLED');
    },
    handleFullScreen () {
      Util.toggleFullScreen();
    },
    onEnter () {
      // window.location.href = '#/vision/basic/?sernum=' + this.userInput;
      this.$router.push('/vision/basic');
      store.commit('changeSernum', this.userInput);
      // this.userInput = '';
    },
    showToolBar () {
      store.commit('changeShowToolBar');
      if (store.state.showToolBar) {
        this.alignIcon = 'vertical_align_top';
      } else {
        this.alignIcon = 'vertical_align_bottom';
      }
    },
  }
};
</script>
