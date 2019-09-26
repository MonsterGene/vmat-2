<template>
    <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -11px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>

    <div class="console" :id="'info-' + container + '-' + controller"></div>

    <v-divider></v-divider>
    <v-card-actions style="height: 40px;">
      
    </v-card-actions>
  </v-card>
</template>
<script>
import Terminal from '../api/xTerm';
import { getContainerInfo } from '../api/getContainerInfo';

export default {
  props: ['controller', 'container', 'controllerQty'],
  data () {
    return {
      term: null,
      terminalContainer: null,
      containerInfo: [],
    };
  },
  computed: {
    connection_name () {
      return this.container + ':' + this.controller;
    },
  },
  watch: {
    'controllerQty': {
      handler: function (qty) {
        // console.log(qty);
        this.term.fit();
      },
    },
  },
  mounted () {
    this.terminalContainer = document.getElementById('info-' + this.container + '-' + this.controller);
    this.term = new Terminal({
      cursorBlink: 0,
      scrollback: 1000,
      cursorStyle: 'bar',
      disableStdin: true,
    });
    this.term.open(this.terminalContainer, true);
    this.term._initialized = true;
    this.term.fit();
    this.term.scrollToBottom();
    this.term.blur();
    this.getInformation();
  },
  destroyed () {
    this.term.dispose();
  },
  methods: {
    getInformation () {
      getContainerInfo(this.container)
        .then(response => {
          this.containerInfo = response.data.payload.data;
          // console.log(this.containerInfo);
          this.term.write(this.containerInfo);
          this.term.scrollToBottom();
        })
        .catch(e => {
          console.log(e);
        });
    },
    clickGenLink () {
      console.log('hello');
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