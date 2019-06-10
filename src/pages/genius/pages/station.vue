<template>
  <v-container grid-list-xl fluid pa-3>
    <v-layout row wrap>
    <tool-bar
      v-bind:openScreenStyle="openScreenStyle"
      v-bind:openChangeMode="openChangeMode"
    ></tool-bar>
    <notify-marquee></notify-marquee>
        <station-slot v-for="station of stationList" :key="station.id"
          v-bind:station="station"
        ></station-slot>
        <!-- <h2><p>Could not find Station List</p></h2> -->
    </v-layout>
  </v-container>
</template>

<script>
import ToolBar from '../components/ToolBar';
import NotifyMarquee from '../components/NotifyMarquee';
import StationSlot from '../components/StationSlot';

import { getIpAddress } from '../api/basic';
import { getStationPage } from '../api/getRenderPage';
const WebSocketClient = require('websocket').client;

export default {
  components: {
    ToolBar,
    NotifyMarquee,
    StationSlot,
  },
  data () {
    return {
      openScreenStyle: false,
      openChangeMode: false,
      stationList: [],
      //
      currentUrl: '',
      hostname: '',
      websock: null,
    };
  },
  created () {
    this.getStationList();
    this.initWebSocket();
  },
  destroyed () {
    this.websock.close();
  },
  methods: {
    initWebSocket () {
      this.currentUrl = window.location.hash.substring(1);
      this.hostname = getIpAddress();
      const wsUrl = 'ws://' + this.hostname + this.currentUrl;
      this.websock = new WebSocket(wsUrl);
      this.websock.onmessage = this.websocketonmessage;
      // this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    // websocketonopen() {
    //   let actions = {"test":"12345"};
    //   this.websocketsend(JSON.stringify(actions));
    // },
    websocketonerror (e) {
      console.log('Connection lost', e);
      window.getApp.$emit('WEB_SOCKET_RECONNECT');
      setTimeout(() => {
        this.initWebSocket();
      }, 3000);
    },
    websocketsend (Data) {
      this.websock.send(JSON.stringify(Data));
    },
    websocketclose (e) {
      console.log('Connection Closed');
    },
    websocketonmessage (e) {
      const data = JSON.parse(e.data);
      // console.log(data);
      const stationList = data.payload;
      if (stationList) {
        this.stationList = stationList;
      // console.log(this.stationList);
      } else {
        this.stationList = [];
      }
    },
    getStationList () {
      getStationPage(this.currentUrl)
        .then(response => {
          if (response.data.status) {
            const stationList = response.data.payload.data;
            // console.log(stationList);
            if (stationList) {
              this.stationList = stationList;
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
  },
};
</script>

<style lang='stylus' scoped>
</style>