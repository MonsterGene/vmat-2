<template>
  <v-toolbar
    :color="$vuetify.theme.primary"
    fixed
    dark
    app
    >
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="handleDrawerToggle"></v-toolbar-side-icon>
    </v-toolbar-title>
      <v-text-field
        flat
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
      <v-btn icon @click="handleFullScreen()">
        <v-icon>fullscreen</v-icon>
      </v-btn>
      <!-- <v-menu offset-y origin="center center" class="elelvation-1" :nudge-bottom="14" transition="scale-transition">
        <v-btn icon flat slot="activator">
        <v-badge color="red" overlap>
          <v-icon medium>notifications</v-icon>
        </v-badge>
        </v-btn>
        <notification-list></notification-list>
      </v-menu> -->

      <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
        <v-btn icon large flat slot="activator">
          <v-avatar size="30px">
            <img src="/static/logo.png" alt="Robin Wu"/>
          </v-avatar>
        </v-btn>
        <v-list class="pa-0">
          <v-list-tile v-for="(item,index) in items" :to="!item.href ? { name: item.name } : null" :href="item.href" @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="index">
            <v-list-tile-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
      
  </v-toolbar>
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
  }
};
</script>
