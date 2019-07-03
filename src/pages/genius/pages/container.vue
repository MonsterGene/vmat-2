<template>
  <v-container grid-list-xl fluid pa-3>
    <v-layout row wrap>
      <tool-bar
        v-bind:openScreenStyle="openScreenStyle"
        v-bind:openChangeMode="openChangeMode"
        @changeScreenStyle="changeScreenStyle" 
        @changeMode="changeMode"
      ></tool-bar>
      <notify-marquee></notify-marquee>
      <v-divider></v-divider>

      <!-- Apollo Like Layout -->
      <v-flex lg3 md6 sm12 xs12 pa-1 v-if="!screenStyle">
        <v-card style="background: rgb(143,143,143);">
          <v-card-text>
            <div class="layout row align-center justify-space-between">
                <div class="subheading ml-2">IDLE Containers</div>
                <v-chip color="gray">{{ idle_qty }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
        <v-flex pa-0 mt-1 v-for="container of containerList" :key="container.id" v-show="container.status === 'idle'">
          <container-slot
            v-bind:container="container"
            v-bind:questionContainer="questionContainer"
            @clickAction="clickAction"
            @reOpenQuestion="reOpenQuestion"
            @answerQuestion="answerQuestion"
          ></container-slot>
        </v-flex>
      </v-flex>
      <v-flex lg3 md6 sm12 xs12 pa-1 v-if="!screenStyle">
        <v-card style="background: rgb(240,184,0);" v-show="run_qty">
          <v-card-text>
            <div class="layout row align-center justify-space-between">
                <div class="subheading ml-2">RUNNING Containers</div>
                <v-chip color="gray">{{ run_qty }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
        <v-flex pa-0 mt-1 v-for="container of containerList" :key="container.id" v-show="container.status === 'run'">
          <container-slot
            v-bind:container="container"
            v-bind:questionContainer="questionContainer"
            @clickAction="clickAction"
            @reOpenQuestion="reOpenQuestion"
            @answerQuestion="answerQuestion"
          ></container-slot>
        </v-flex>
      </v-flex>
      <v-flex lg3 md6 sm12 xs12 pa-1 v-if="!screenStyle">
        <v-card style="background: rgb(79,145,58);" v-show="pass_qty">
          <v-card-text>
            <div class="layout row align-center justify-space-between">
                <div class="subheading ml-2">PASSED Containers</div>
                <v-chip color="gray">{{ pass_qty }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
        <v-flex pa-0 mt-1 v-for="container of containerList" :key="container.id" v-show="container.status === 'pass'">
          <container-slot
            v-bind:container="container"
            v-bind:questionContainer="questionContainer"
            @clickAction="clickAction"
            @reOpenQuestion="reOpenQuestion"
            @answerQuestion="answerQuestion"
          ></container-slot>
        </v-flex>
      </v-flex>
      <v-flex lg3 md6 sm12 xs12 pa-1 v-if="!screenStyle">
        <v-card style="background: rgb(216,31,40);" v-show="fail_qty">
          <v-card-text>
            <div class="layout row align-center justify-space-between">
                <div class="subheading ml-2">FAILED Containers</div>
                <v-chip color="gray">{{ fail_qty }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
        <v-flex pa-0 mt-1 v-for="container of containerList" :key="container.id" v-show="container.status === 'fail' || container.status === 'stop'">
          <container-slot
            v-bind:container="container"
            v-bind:questionContainer="questionContainer"
            @clickAction="clickAction"
            @reOpenQuestion="reOpenQuestion"
            @answerQuestion="answerQuestion"
          ></container-slot>
        </v-flex>
      </v-flex>

      <!-- Autotest Like Layout -->
      <v-flex lg2 md4 sm6 v-for="container of containerList" :key="container.id" 
        style="padding-right: 2px; padding-left: 2px; padding-bottom: 3px; padding-top: 3px;">
        <container-slot2 
          v-if="screenStyle"
          v-bind:container="container"
          v-bind:questionContainer="questionContainer"
          @clickAction="clickAction"
          @reOpenQuestion="reOpenQuestion"
          @answerQuestion="answerQuestion"
        ></container-slot2>
      </v-flex>
      <!-- ask question -->
      <ask-question
        v-bind:title="questionTitle"
        v-bind:type="questionType"
        v-bind:options="questionOptions"
        v-bind:image="questionImage"
        v-bind:open="openQuestion"
        v-bind:container="questionContainer"
        @closeQuestion="closeQuestion"
        @answerQuestion="answerQuestion"
      ></ask-question>
      <!-- stop comfirmation dialogs -->
      <v-layout row justify-center>
        <v-dialog v-model="openDialogs" persistent max-width="500">
          <v-card>
            <v-card-title class="headline">{{ titleDialogs }}</v-card-title>
            <v-card-text><h4>{{ contentDialogs }}</h4></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="openDialogs = false">Cancel</v-btn>
              <v-btn color="green darken-1" flat @click="openDialogs = false; clickAction('2Stop Test', titleDialogs)">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
      <!-- #### -->
    </v-layout>
  </v-container>
</template>

<script>
import ToolBar from '../components/ToolBar';
import AskQuestion from '../components/AskQuestion';
import ContainerSlot from '../components/ContainerSlot';
import ContainerSlot2 from '../components/ContainerSlot2';
import NotifyMarquee from '../components/NotifyMarquee';

import { getIpAddress } from '../api/basic';
import { getContainerPage } from '../api/getRenderPage';
import {
  getStyle,
} from '../api/getStyle';
const WebSocketClient = require('websocket').client;

export default {
  components: {
    ToolBar,
    AskQuestion,
    ContainerSlot,
    ContainerSlot2,
    NotifyMarquee,
  },
  data () {
    return {
      username: '',
      // Question
      openQuestion: false,
      questionTitle: '',
      questionImage: '',
      questionContainer: '',
      questionOptions: [],
      questionType: 'select',  // or select
      // Stop Dialogs
      openDialogs: false,
      titleDialogs: '',
      contentDialogs: 'Do You Confirm to Stop Test ???',
      // Apollo like/Autotest like switcher
      screenStyle: false,
      openScreenStyle: true,
      // DEBUG / PROD Mode switcher
      mode: 'PROD',
      openChangeMode: true,
      // container data
      containerList: [],
      // container status qty
      idle_qty: 0,
      run_qty: 0,
      fail_qty: 0,
      pass_qty: 0,
      //
      currentUrl: '',
      hostname: '',
      websock: null,
    };
  },
  created () {
    this.username = this.$cookies.get('username');
    this.currentUrl = window.location.hash.substring(1);
    this.hostname = getIpAddress();
    this.getGeniusStyle();
    this.getContainerList();
    this.initWebSocket();
  },
  destroyed () {
    this.websock.close();
  }, 
  methods: {
    initWebSocket () {
      const wsUrl = 'ws://' + this.hostname + this.currentUrl;
      this.websock = new WebSocket(wsUrl);
      this.websock.onmessage = this.websocketonmessage;
      // this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    // websocketonopen() { //连接建立之后执行send方法发送数据
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
      // Parser containers list
      const containerList = data.payload;
      if (containerList) {
        this.containerList = containerList;
        this.calculateUnitQty();  // calc all status qty
        // console.log(this.containerList);
      }
      // Parser Question.
      const question = data.ask_question;
      // console.log(question);
      if (question) {
        if (question.question) {
          this.questionContainer = question.container;
          this.questionTitle = question.question;
          this.questionType = 'text';
          if (question.answers) {
            this.questionOptions = question.answers;
            this.questionType = 'select';
          }
          this.reOpenQuestion();
          return false;
        } else {  // if there is not question, cleanup all question related variables, and close Question to make sure.
          this.questionContainer = '';
          this.questionTitle = '';
          this.questionType = '';
          this.questionOptions = [];
          this.closeQuestion();
        }
      }
    },
    clickAction (action, container_name) {
      if (action === 'Stop Test') {  // Stop Test need double confirm.
        this.titleDialogs = container_name;
        this.openDialogs = true;
        return false;
      }
      if (action === '2Stop Test') {  // it is for double confirm.
        action = action.substring(1);
        if (this.questionContainer === container_name) {
          // if stop container, will close the question prompt if question container is same as one stopped.
          this.closeQuestion();
        }
      }
      this.websocketsend(
        { 
          'mode': this.mode,
          'name': container_name, 
          'action': action,
          'user': this.username
        }
      );
    },
    answerQuestion (userInput, container_name) {
      // console.log(userInput, container_name);
      this.websocketsend(
        { 
          'name': container_name,
          'action': 'Answer Question',
          'answer': userInput
        }
      );
      this.closeQuestion();
    },
    closeQuestion () {
      this.openQuestion = false;
    },
    reOpenQuestion () {
      this.openQuestion = true;
    },
    changeScreenStyle () {
      this.screenStyle = !this.screenStyle;
    },
    changeMode (m) {
      this.mode = m;
      // console.log(this.mode);
    },
    calculateUnitQty () {
      this.idle_qty = 0;
      this.run_qty = 0;
      this.pass_qty = 0;
      this.fail_qty = 0;
      for (const container of this.containerList) {
        if (container.status === 'idle') {
          this.idle_qty += 1;
        }
        else if (container.status === 'pass') {
          this.pass_qty += 1;
        }
        else if (container.status === 'run') {
          this.run_qty += 1;
        }
        else if (container.status === 'fail' || container.status === 'stop') {
          this.fail_qty += 1;
        }
      }
    },
    getContainerList () {
      getContainerPage(this.currentUrl)
        .then(response => {
          if (response.data.status) {
            const containerList = response.data.payload.data;
            if (containerList) {
              this.containerList = containerList;
              this.calculateUnitQty();  // calc all status qty
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getGeniusStyle () {
      getStyle()
        .then(response => {
          this.containerStyle = response.data.payload.data;
          // console.log('Get Sytle ' + this.containerStyle);
          if (this.containerStyle === 'STATIC') {
            this.screenStyle = !this.screenStyle;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
  }
};
</script>

<style lang='stylus' scoped>

</style>