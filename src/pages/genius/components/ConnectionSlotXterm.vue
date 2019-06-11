<template>
    <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -15px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>

    <div class="console" :id="'terminal-' + container + '-' + controller"></div>

    <v-divider></v-divider>
    <v-card-actions style="height: 40px;">
      <v-btn
        style="padding: 1; min-width: 0;"
        color="error" 
        :href="'#/genius/logs/' + connection_name" 
        target="_blank"
      >LOG</v-btn>
      
      <v-btn 
        style="margin-left: -5px;"
        color="primary" 
        @click="openCommandPromp" 
      >CMD</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import Terminal from '../api/xTerm';

export default {
  props: ['websock', 'controller', 'container', 'testLog'],
  data () {
    return {
      term: null,
      commandPromp: false,
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
        if (newLog['testLogController'] === this.controller) {
          this.term.write(newLog['testLog']);
        }
      },
      deep: true,
    },
  },
  mounted () {
    let terminalContainer = document.getElementById('terminal-' + this.container + '-' + this.controller);
    this.term = new Terminal();
    this.term.open(terminalContainer);
    this.term._initialized = true;
    this.term.fit();
    this.requestInitLog();
    this.term.on('data', function (data) {
      this.userInput = JSON.stringify(data);
      this.userInput = data;
      console.log(this.websock);
      this.websock.send(JSON.stringify(data));
    });
  },
  methods: {
    openCommandPromp () {
      this.commandPromp = !this.commandPromp;
    },
    requestInitLog () {
      // when controller window is open, request initial test log
      this.$emit('requestInitLog', this.controller);
    },
  },
};
</script>

<style lang='stylus' scoped>
.console {
  // color: rgb(225, 225, 225);
  // background-color: black;
  // resize: none;
  // overflow: auto;
  // width: 102%;
  // margin-top: -15px;
  // margin-bottom: -20px;
  // margin-left: -14px;
  // padding-left: 5px;
  // padding-right: 5px;
  // overflow-y: scroll; 
  // overflow-x: hidden; 
  max-height: 500px;
  min-height: 500px;
}
</style>