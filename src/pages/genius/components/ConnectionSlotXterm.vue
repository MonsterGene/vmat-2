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
        v-if="controller !== 'INFO' && controller !== 'SEQ_LOG' && controller !== 'STEP'"
      >CMD</v-btn>
      <v-text-field v-if="commandPromp"
        placeholder="Type Commands Here."
        clearable
        v-on:keyup.enter="onEnter"
        v-model="userInput"
      ></v-text-field>
      <!-- Special Characters -->
      <v-menu v-show="commandPromp">
        <v-btn
          slot="activator"
          color="error"
        >
          ASCII
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(ascii, index) in asciis"
            :key="index"
            @click="sendAscii(ascii)"
          >
            <v-list-tile-title>{{ ascii.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>
<script>
import Terminal from '../api/xTerm';

export default {
  props: ['controller', 'container', 'testLog'],
  data () {
    return {
      term: null,
      commandPromp: false,
      userInput: '',
      asciis: [
        {
          value: '::CTRL_C',
          name: 'CTRL_C'
        },
        {
          value: '::CTRL_X',
          name: 'CTRL_X'
        },
        {
          value: '::ESC',
          name: 'ESC'
        },
        {
          value: '::TELNET_BREAK',
          name: 'TELNET_BREAK'
        },
        {
          value: '::SSH_BREAK',
          name: 'SSH_BREAK'
        },
        {
          value: '::CTRL_CARET',
          name: 'CTRL_CARET'
        },
      ],
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
    this.term = new Terminal({
      cols: 1,
      rows: 500,
      cursorBlink: 5,
      scrollback: 500,
    });
    this.term.open(terminalContainer);
    this.term._initialized = true;
    this.term.fit();
    this.requestInitLog();
  },
  destroyed () {
    this.term.dispose();
  },
  methods: {
    openCommandPromp () {
      this.commandPromp = !this.commandPromp;
      // if (this.commandPromp) {
      //   this.term.on('data', function (data) {
      //     // this.userInput = JSON.stringify(data);
      //     this.userInput = data;
      //     // if (this.commandPromp) {
      //       // this.submitUserCommand();
      //     // }
      //   });
      // }
    },
    requestInitLog () {
      // when controller window is open, request initial test log
      this.$emit('requestInitLog', this.controller);
    },
    submitUserCommand () {
      this.$emit('submitUserCommand', this.userInput, this.controller);
      this.userInput = '';
    },
    onEnter () {
      this.submitUserCommand();
    },
    sendAscii (ascii) {
      this.userInput = ascii.value;
      // console.log(this.userInput);
      this.submitUserCommand();
    }
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