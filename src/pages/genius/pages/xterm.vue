<template>
  <v-container grid-list-xl fluid pa-3>
    <v-layout row wrap>
    <tool-bar
      v-bind:openScreenStyle="openScreenStyle"
      v-bind:openChangeMode="openChangeMode"
    ></tool-bar>
    <notify-marquee></notify-marquee>

    <connection-slot-xterm></connection-slot-xterm>

    </v-layout>
  </v-container>
</template>

<script>
import ToolBar from '../components/ToolBar';
import NotifyMarquee from '../components/NotifyMarquee';
import ConnectionSlotXterm from '../components/ConnectionSlotXterm';

import { getIpAddress } from '../api/basic';

export default {
  components: {
    ToolBar,
    NotifyMarquee,
    ConnectionSlotXterm,
  },
  data () {
    return {
      openScreenStyle: false,
      openChangeMode: false,
      //
      currentUrl: '',
      hostname: '',
      websock: null,
    };
  },
  methods: {
  },
};
</script>

<style lang='stylus' scoped>
</style>