<template>
  <v-toolbar :color="toolBarColor" pa-0 ma-0 height="50px">
    <a href="#/genius"><span :class="titleColor"><h4>Genius Solution</h4></span></a>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :color="toolBarColor"
          :class="titleColor"
          @click="goManagePage"
        >
          {{ genius_version || 'v0.0.0_xxxxxxxx' }}
          <v-icon v-if="new_version_visible" color="error">error</v-icon>
        </v-btn>
      </template>
      <span>
        <pre v-for="d of details" :key="d">{{ d }}<v-divider></v-divider></pre>
      </span>
    </v-tooltip>

    <v-spacer></v-spacer>
    <span>{{ username }}</span>
    <!-- PROD / DEBUG switcher -->
    <v-menu offset-y v-if="openChangeMode">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          color="error"
        >
          {{ mode }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(mode, index) in modes"
          :key="index"
          @click="changeMode(mode.name)"
        >
          <v-list-item-title>{{ mode.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- Apollo like / Autotest like switcher -->
    <v-btn icon v-if="openScreenStyle">
      <v-switch label="" @click.native="changeScreenStyle"></v-switch>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { getMachineStatus } from '../api/getMachineStatus';
import { getProdVersion } from '../api/getProdVersion';
import { getServerName } from '../api/getServerName';

export default {
  components: {
  },
  props: ['openScreenStyle', 'openChangeMode'],
  data () {
    return {
      serverName: 'Genius',
      username: '',
      role: '',
      manageUrl: '#/genius/manage',
      mode: 'PROD',
      toolBarColor: 'purple',
      titleColor: 'white--text',
      screenStyle: true,
      modes: [
        {
          index: 1,
          name: 'PROD'
        },
        {
          index: 2,
          name: 'DEBUG'
        }
      ],
      // for code version
      genius_version: '',
      details: [],
      new_version: '',
      new_version_visible: false,
      containerStyle: 'DYNAMIC',
    };
  },
  mounted () {
    this.toggleFullScreen();
    this.username = this.$cookies.get('username');
    this.role = this.$cookies.get('role');
    if (!this.username) {
      this.$router.replace('/genius/login');
    }
    if (this.role === 'operator') {
      this.modes = [
        {
          index: 1,
          name: 'PROD'
        },
      ];
    }
    // change title here
    this.getCurrentServerName();
    this.getCurrentVersion();
    this.getCurrentMachineStatus();
  },
  methods: {
    getCurrentServerName () {
      getServerName()
        .then(response => {
          this.serverName = response.data.payload.data;
          document.title = this.serverName + ' | Genius';
          // console.log(this.serverName);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getCurrentVersion () {
      getProdVersion()
        .then(response => {
          // console.log(response.data);
          this.genius_version = response.data.genius_version;
          this.details = this.details.concat(response.data.details);
          this.new_version = response.data.new_version;
          if (this.new_version) {
            this.new_version_visible = !this.new_version_visible;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getCurrentMachineStatus () {
      getMachineStatus()
        .then(response => {
          // console.log(response.data);
          if (response.data.status) {
            this.details.push(response.data.payload.data.cpu_usage);
            this.details.push(response.data.payload.data.ram_usage);
            this.details.push(response.data.payload.data.hdd_usage);
            this.details.push('------');
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    changeMode (m) {
      this.mode = m;
      if (m === 'PROD') {
        this.toolBarColor = 'purple';
        this.titleColor = 'white--text';
        this.$emit('changeMode', 'PROD');
      } else {
        this.toolBarColor = 'yellow';
        this.titleColor = 'black--text';
        this.$emit('changeMode', 'DEBUG');
      }
    },
    changeScreenStyle () {
      this.screenStyle = !this.screenStyle;
      this.$emit('changeScreenStyle');
    },
    toggleFullScreen () {
      let doc = window.document;
      let docEl = doc.documentElement;
      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      }
    },
    goManagePage () {
      // console.log(this.manageUrl.substring(1));
      if (this.role === 'operator') { return false }
      this.$router.push(this.manageUrl.substring(1));
    },
  }
};
</script>

<style lang='stylus' scoped>
a{ text-decoration: none}
</style>