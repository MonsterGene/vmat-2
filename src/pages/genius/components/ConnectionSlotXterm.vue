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
      <!-- <v-text-field v-if="commandPromp"
        placeholder="Type Commands Here."
        clearable
        v-on:keyup.enter="onEnter"
        v-model="userInput"
      ></v-text-field> -->
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
  props: ['controller', 'container', 'testLog', 'controllerQty'],
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
          value: '::OPEN',
          name: 'OPEN CONN'
        },
        {
          value: '::CLOSE',
          name: 'CLOSE CONN'
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
        // console.log(newLog['testLog']);
        if (newLog['testLogController'] === this.controller) {
          this.term.write(newLog['testLog']);
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
    let terminalContainer = document.getElementById('terminal-' + this.container + '-' + this.controller);
    this.term = new Terminal({
      cols: 1,
      rows: 500,
      cursorBlink: 5,
      scrollback: 500,
    });
    let that = this;
    this.term.open(terminalContainer, true);
    this.term._initialized = true;
    this.term.fit();
    this.term.scrollToBottom();
    this.requestInitLog();
    this.term.on('data', function (data) {
      // console.log('data xterm=>', data);
      that.userInput = data;
      that.submitUserCommand();
    });
    // this.term.textarea.onkeydown = function (e) {
    //   console.log(e);
    // };
    // console.log('cols:', this.term.cols);
  },
  destroyed () {
    this.term.dispose();
    this.term.destroy();
  },
  methods: {
    openCommandPromp () {
      this.commandPromp = !this.commandPromp;
    },
    requestInitLog () {
      // when controller window is open, request initial test log
      this.$emit('requestInitLog', this.controller);
    },
    submitUserCommand () {
      if (this.commandPromp) {
        this.$emit('submitUserCommand', this.userInput, this.controller);
        this.userInput = '';
      }
    },
    onEnter () {
      this.userInput = this.userInput + '\r';
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
  max-height: 600px;
  min-height: 600px;
}
</style>