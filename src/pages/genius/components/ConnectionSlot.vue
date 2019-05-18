<template>
  <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -15px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>
    
    <v-card-text v-if="controller !== 'STEP' && controller !== 'INFO'">
      <textarea :id="controller"
        class="test-log-area"
        :rows="logRows"
        autofocus
        readonly
        v-model.lazy="logs"
      ></textarea>
    </v-card-text>

    <!-- For STEP windows only -->
    <v-card-text v-if="controller === 'STEP'">
      <div class="steps-area">
      <v-layout row wrap pa-0>
        <v-flex>
        </v-flex>
        <v-flex lg12 md12 sm12 xs12 pa-0 ma-0 v-for="(step, index) in steps" :key="step.name">
            <v-hover :class="
            step.status === 'running' && 'yellow' || 
            step.status === 'passed' && 'green' ||
            step.status === 'pending' && 'gray' ||
            step.status === 'failed' && 'red'
            ">
              <v-card
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 20 : 1}`"
                style="height: 95%; margin-top: -10px;"
              >
                <v-card-text class="">
                  <div class="row mb-0 align-center justify-space-between">
                    <div class="text-box" style="margin-top: -5px;">
                      <div class="text-md-center" style="margin-top: -8px;"><h5 class="font-weight-regular">{{ index + 1 }}. {{ step.name }}</h5></div>
                    </div>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
      </div>
    </v-card-text>

    <!-- For INFO windows only -->
    <v-card-text v-if="controller === 'INFO'">
      <textarea
        :rows="logRows"
        class="test-log-area"
        readonly
        v-model.lazy="containerInfo"
      ></textarea>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions style="height: 40px;">
      <v-btn
        style="padding: 1; min-width: 0;"
        color="error" 
        :href="'#/genius/logs/' + connection_name" 
        target="_blank"
        v-if="controller !== 'STEP' && controller !== 'INFO'"
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
      <v-btn 
        v-if="commandPromp" 
        @click="submitUserCommand" 
      ><v-icon left>send</v-icon>send</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import store from '../store';
import { getContainerInfo } from '../api/getContainerInfo';

export default {
  components: {
  },
  props: ['controller', 'container', 'testLog', 'cleanTestLog', 'steps'],
  data () {
    return {
      containerInfo: '',
      commandPromp: false,
      userInput: '',
      logs: '',
      logRows: 22,
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
          this.logs += newLog['testLog'];
          const logLength = this.logs.length;
          if (logLength > 3000) {  // Limit test log length
            this.logs = this.logs.substring(logLength - 3000, logLength);
          }
          // Make sure the scroll is update to date.
          const container = this.$el.querySelector('#' + this.controller);
          container.scrollTop = container.scrollHeight + 10;
        }
      },
      deep: true,
    },
    'cleanTestLog' () {
      this.logs = '';
    },
    // 'steps' () {
    //   console.log(this.steps);
    // }
  },
  mounted () {
    if (this.controller === 'INFO') {
      // here need to get INFO controller info from backend.
      this.getInformation();
    } else if (this.controller === 'STEP') {
      this.requestSteps();
    } else {
      this.requestInitLog();
    }
    // dynamically change logs Rows
    const height = document.documentElement.scrollHeight;
    if (height < 700) {
      this.logRows = 22;
    }
  },
  methods: {
    openCommandPromp () {
      this.commandPromp = !this.commandPromp;
    },
    submitUserCommand () {
      this.$emit('submitUserCommand', this.userInput, this.controller);
      this.userInput = '';
    },
    onEnter () {
      this.submitUserCommand();
    },
    requestInitLog () {
      // when controller window is open, request initial test log
      this.$emit('requestInitLog', this.controller);
    },
    requestSteps () {
      this.$emit('requestSteps', this.controller);
    },
    getInformation () {
      getContainerInfo(this.container)
        .then(response => {
          // console.log(response.data);
          this.containerInfo = response.data.payload.data;
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style lang='stylus' scoped>
.test-log-area {
  color: rgb(225, 225, 225);
  background-color: black;
  resize: none;
  overflow: auto;
  width: 102%;
  margin-top: -15px;
  margin-bottom: -20px;
  margin-left: -14px;
  padding-left: 5px;
  padding-right: 5px;
  // overflow-y: scroll; 
  max-height: 600px;
  min-height: 600px;
}

.steps-area {
  // color: rgb(225, 225, 225);
  // background-color: black;
  resize: none;
  overflow: auto;
  width: 102%;
  margin-top: -15px;
  margin-bottom: -20px;
  margin-left: -14px;
  padding-left: 5px;
  padding-right: 5px;
  overflow-y: scroll; 
  overflow-x: hidden; 
  max-height: 600px;
  min-height: 600px;
}
</style>