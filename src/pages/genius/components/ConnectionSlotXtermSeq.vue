<template>
    <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -11px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>

    <div :id="'seq-' + container + '-' + controller" 
    :style="'max-height:' + connPageHight + 'px;min-height:' + connPageHight + 'px;'"></div>

    <v-divider></v-divider>
    <v-card-actions style="height: 40px;">
      <v-btn
        style="padding: 1; min-width: 0;"
        color="error" 
        :href="logPath"
        target="_blank"
      >LOG</v-btn>

    </v-card-actions>
  </v-card>
</template>
<script>
import Terminal from '../api/xTerm';
import { getCurrentLog } from '../api/getCurrentLog';

export default {
  props: ['controller', 'container', 'testLog', 'controllerQty', 'connPageHight'],
  data () {
    return {
      logPath: '',
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
        if (newLog['testLogController'] === this.controller) {
          newLog['testLog'].split(this.re).forEach(element => {
            if (element) {
              // https://www.cnblogs.com/yunlongaimeng/p/9934360.html
              // F    B
              // 30  40 黑色
              // 31  41 红色
              // 32  42 绿色
              // 33  43 黄色
              // 34  44 蓝色
              // 35  45 紫红色
              // 36  46 青蓝色
              // 37  47 白色
              if (element.startsWith('ERROR')) {
                this.term.write('\u001b[01;31m\u001b[K' + element + '\r\n\u001b[m\u001b[K');
              }
              else if (element.startsWith('DEBUG')) {
                this.term.write('\u001b[00;38m\u001b[K' + element + '\r\n\u001b[m\u001b[K');
              }
              else if (element.startsWith('INFO')) {
                this.term.write('\u001b[00;33m\u001b[K' + element + '\r\n\u001b[m\u001b[K');
              }
              else {
                this.term.write(element + '\r\n');
              }
            }
          });
          // this.term.write(newLog['testLog'].replace(this.re, '\r\n'));
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
    this.getLog();
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
    getLog () {
      getCurrentLog(this.connection_name)
        .then(response => {
          this.logPath = response.data.payload.data;
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