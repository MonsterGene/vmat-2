<template>
    <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -11px;"><v-icon>menu</v-icon>{{ controller }}</h4>
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
      
      <v-btn v-show="role === 'engineer'"
        style="margin-left: -5px;"
        color="primary" 
        @click="openCommandPromp" 
      >CMD</v-btn>
      <v-menu v-show="commandPromp">
        <v-btn
          slot="activator"
          color="error"
        >
          ACTION
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
      role: '',
      terminalContainer: null,
      asciis: [
        {
          value: '::CTRL_C',
          name: 'CTRL_C'
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
    this.role = this.$cookies.get('role');
    this.terminalContainer = document.getElementById('terminal-' + this.container + '-' + this.controller);
    this.term = new Terminal({
      cursorBlink: 5,
      scrollback: 1000,
    });
    let that = this;
    this.term.open(this.terminalContainer, true);
    this.term._initialized = true;
    this.term.fit();
    this.term.scrollToBottom();
    this.requestInitLog();
    // this.term.toggleFullScreen();
    this.term.on('data', function (data) {
      that.userInput = data;
      that.submitUserCommand();
    });
    this.term.on('keydown', arrayBuffer => {
      if (arrayBuffer.key === 'F1' && arrayBuffer.ctrlKey) {
        this.term.toggleFullScreen();
        this.term.fit();
      }
    });
  },
  destroyed () {
    this.term.dispose();
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
    toggleFullScreen () {
      this.term.toggleFullScreen();
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