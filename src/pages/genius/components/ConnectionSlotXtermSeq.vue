<template>
    <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -11px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>

    <div class="console" :id="'seq-' + container + '-' + controller"></div>

    <v-divider></v-divider>
    <v-card-actions style="height: 40px;">
      <v-btn
        style="padding: 1; min-width: 0;"
        color="error" 
        :href="'#/genius/logs/' + connection_name" 
        target="_blank"
      >LOG</v-btn>

    </v-card-actions>
  </v-card>
</template>
<script>
import Terminal from '../api/xTerm';

export default {
  props: ['controller', 'container', 'testLog', 'controllerQty'],
  data () {
    return {
      term: null,
      terminalContainer: null,
      re: /\r\n|\n\r|\n|\r/g,
    };
  },
  computed: {
    connection_name () {
      return this.container + ':' + this.controller;
    },
  },
  watch: {
    'testLog': {
      handler: function (newLog) {
        // console.log(newLog['testLog'].replace(re, ''));
        if (newLog['testLogController'] === this.controller) {
          this.term.write(newLog['testLog'].replace(this.re, '\r\n'));
          this.term.scrollToBottom();
        }
      },
      deep: true,
    },
    'controllerQty': {
      handler: function (qty) {
        // console.log(qty);
        this.term.fit();
      },
    },
  },
  mounted () {
    this.terminalContainer = document.getElementById('seq-' + this.container + '-' + this.controller);
    this.term = new Terminal({
      cursorBlink: 0,
      scrollback: 1000,
      cursorStyle: 'bar',
      disableStdin: true,
    });
    let that = this;
    this.term.open(this.terminalContainer, true);
    this.term._initialized = true;
    this.term.fit();
    this.term.blur();
    this.term.scrollToBottom();
    this.requestInitLog();
  },
  destroyed () {
    this.term.dispose();
    this.term.destroy();
  },
  methods: {
    requestInitLog () {
      // when controller window is open, request initial test log
      this.$emit('requestInitLog', this.controller);
    },
  },
};
</script>

<style lang='stylus' scoped>
.console {
  max-height: 600px;
  min-height: 600px;
}
</style>