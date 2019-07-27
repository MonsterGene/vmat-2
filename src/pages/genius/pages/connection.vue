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

      <v-flex lg12 sm12 pa-1 ma-0>
        <v-card>
            <v-tooltip right>
              <v-btn style="padding: 1; min-width: 0;"
                :href="backPath"
                slot="activator"
                color="primary"
                dark
              ><v-icon>arrow_back</v-icon></v-btn>
              <span>Back</span>
            </v-tooltip>
            <v-tooltip right style="margin-left: -15px;">
                <v-btn
                  @click="clickAction(action, container.name)"
                  slot="activator"
                  :color="containerColor"
                  dark
                >{{ container.name }} <v-icon>{{ actionIcon }}</v-icon></v-btn>
                <span>{{ action }}</span>
              </v-tooltip>
            <v-divider vertical></v-divider>
            <v-btn v-for="controller of controllerList" :key="controller"
              flat
              color="error"
              style="margin-left: -10px; padding: 1; min-width: 0;"
              @click="openLogWindow(controller)"
            >{{ controller }}</v-btn>
        </v-card>
      </v-flex>

      <v-flex :class="'lg' + 12 / controllerQty + ' md12 sm12 xs12'" pa-1 v-for="controller of controllerPool" :key="controller">
        <connection-slot v-if="controller === 'STEP'"
          v-bind:steps="steps"
          v-bind:controller="controller"
          v-bind:container="container.name"
          @requestSteps="requestSteps"
        ></connection-slot>
        <connection-slot-profile v-else-if="controller === 'PROFILE'"
          v-bind:profileData="profileData"
          v-bind:controllerQty="controllerQty"
          v-bind:controller="controller"
          v-bind:container="container.name"
          @requestProfile="requestProfile"
        ></connection-slot-profile>
        <connection-slot-xterm-info v-else-if="controller === 'INFO'"
          v-bind:controllerQty="controllerQty"
          v-bind:controller="controller"
          v-bind:container="container.name"
        ></connection-slot-xterm-info>
        <connection-slot-xterm-seq v-else-if="controller === 'SEQ_LOG'"
          v-bind:controllerQty="controllerQty"
          v-bind:testLog="testLog"
          v-bind:controller="controller"
          v-bind:container="container.name"
          @requestInitLog="requestInitLog"
        ></connection-slot-xterm-seq>
        <connection-slot-xterm v-else
          v-bind:controllerQty="controllerQty"
          v-bind:testLog="testLog"
          v-bind:controller="controller"
          v-bind:container="container.name"
          @requestInitLog="requestInitLog"
          @submitUserCommand="submitUserCommand"
        ></connection-slot-xterm>
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
      <!-- snack bar -->
      <notify-snackbar
        :title="snackTitle"
        :open="openSnack"
      ></notify-snackbar>
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
import NotifyMarquee from '../components/NotifyMarquee';
import ConnectionSlot from '../components/ConnectionSlot';
import ConnectionSlotXterm from '../components/ConnectionSlotXterm';
import ConnectionSlotXtermInfo from '../components/ConnectionSlotXtermInfo';
import ConnectionSlotXtermSeq from '../components/ConnectionSlotXtermSeq';
import ConnectionSlotProfile from '../components/ConnectionSlotProfile';
import NotifySnackbar from '../components/NotifySnackbar';

import { getIpAddress } from '../api/basic';

export default {
  components: {
    ToolBar,
    AskQuestion,
    NotifyMarquee,
    ConnectionSlot,
    ConnectionSlotXterm,
    ConnectionSlotXtermInfo,
    ConnectionSlotXtermSeq,
    ConnectionSlotProfile,
    NotifySnackbar,
  },
  data () {
    return {
      snackTitle: '',
      openSnack: false,
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
      openScreenStyle: false,
      // DEBUG / PROD Mode switcher
      mode: 'PROD',
      openChangeMode: true,
      // container data
      container: {},
      controllerList: [],
      controllerPool: [],
      controllerQty: 0,
      // for test log.
      testLog: {},
      cleanTestLog: false,
      // let use could go back to Container Page
      backPath: '',
      steps: [],  // to show step windows
      profileData: [],  // profileData to show chamber chart
      //
      currentUrl: '',
      hostname: '',
      websock: null,
    };
  },
  computed: {
    containerColor () {
      if (this.questionContainer === this.container.name && this.container.status === 'run') { return 'info' }
      else if (this.container.status === 'run') { return 'orange' }
      else if (this.container.status === 'idle') { return 'primary' }
      else if (this.container.status === 'fail' || this.container.status === 'stop') { return 'error' } 
      else if (this.container.status === 'pass') { return 'success' }
      else { return 'primary' }
    },
    action () {
      if (this.container.status === 'idle') { return 'Start Test' }
      else if (this.container.status === 'run') { return 'Stop Test' }
      else if (this.container.status === 'stop' || this.container.status === 'fail' || this.container.status === 'pass') { return 'Deposit Test' } 
      else { return 'Start Test' }
    }, 
    actionIcon () {
      if (this.container.status === 'idle') { return 'play_arrow' }
      else if (this.container.status === 'run') { return 'highlight_off' }
      else if (this.container.status === 'stop' || this.container.status === 'fail' || this.container.status === 'pass') { return 'delete_forever' } 
      else { return 'play_arrow' }
    },
  },
  created () {
    this.username = this.$cookies.get('username');
    this.initWebSocket();
  },
  mounted () {
    this.backPath = window.location.hash.split('/').slice(0, 3).join('/');
    // console.log('backpath - ' + this.backPath);
    this.controllerQty = 2;
    setTimeout(() => {
    // must add some delay, since wesocket neeeds some time to connect backend.
      // this.controllerPool.push('PROFILE');
      this.controllerPool.push('SEQ_LOG');
      this.controllerPool.push('STEP');
      // this.controllerPool.push('UUT');

    }, 1000);
  },
  destroyed () {
    this.websock.close();
  }, 
  methods: {
    initWebSocket () {
      this.currentUrl = window.location.hash.substring(1);
      this.hostname = getIpAddress();
      const wsUrl = 'ws://' + this.hostname + this.currentUrl;
      this.websock = new WebSocket(wsUrl);
      this.websock.onmessage = this.websocketonmessage;
      // this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    // websocketonopen() {
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
      const content = JSON.parse(e.data);
      // console.log(content);
      // Parser containers list
      const container = content.payload;
      if (container) {
        this.container = container;
      }
      // Parser controller list
      const controllerList = content.controllerList;
      if (controllerList) {
        this.controllerList = controllerList;
        const index = this.controllerList.indexOf('CHAMBER', 0);
        if (index !== -1) {  // means found CHAMBER connection.
          this.controllerList.push('PROFILE');
        }
      }
      // Parser Question.
      const question = content.ask_question;
      // console.log(question);
      if (question) {
        if (question.question) {
          this.questionContainer = question.container;
          this.questionTitle = question.question;
          this.questionImage = question.image;
          this.questionType = 'text';
          if (question.answers) {
            this.questionOptions = question.answers;
            this.questionType = 'select';
          }
          if (this.container.name === this.questionContainer) {
            this.reOpenQuestion();
          }
        } else {  // if there is not question, cleanup all question related variables, and close Question to make sure.
          this.questionContainer = '';
          this.questionTitle = '';
          this.questionType = '';
          this.questionOptions = [];
          this.closeQuestion();
        }
      }
      // Parse real-time test log
      const controller = content.testLogController;
      if (controller) {
        // console.log('length: ' + content['testLog'].length);
        this.testLog = content;
      }
      // Get latest steps sequence
      const steps = content.steps;
      if (steps) {
        this.steps = steps;
        // console.log(this.steps);
      }
      // Get profile
      const profile = content.profile;
      if (profile) {
        this.profileData = profile;
        // console.log(this.profileData);
      }
    },
    clickAction (action, container_name) {
      if (this.container.is_locked) {
        this.snackTitle = this.container.name + ' is locked by ' + this.container.lock_by_user;
        this.openSnack = !this.openSnack;
        return false;
      }
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
      if (action === 'Deposit Test') {
        // if deposit, should clear all logs from windows, and do init for windows who is open.
        this.cleanTestLog = this.cleanTestLog;
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
    submitUserCommand (userInput, controller) {
      // send user's commands to backend
      // console.log(userInput, controller);
      this.websocketsend(
        { 
          'name': this.container.name, 
          'controller': controller,
          'cmd': userInput
        }
      );
    },
    requestInitLog (controller) {
      // controller requests the initial test log.
      // {'name': this.container_name, 'controller': this.controller_name, 'request': 'Test Log'}
      this.websocketsend(
        { 
          'name': this.container.name, 
          'controller': controller,
          'request': 'Test Log'
        }
      );
    },
    requestProfile (controller) {
      // controller requests the initial test log.
      // {'name': this.container_name, 'controller': this.controller_name, 'request': 'Profile'}
      this.websocketsend(
        { 
          'name': this.container.name, 
          'controller': controller,
          'request': 'Profile'
        }
      );
    },
    requestSteps (controller) {
      // {'name': this.container_name, 'controller': this.controller_name, 'request': 'Test Log'}
      this.websocketsend(
        { 
          'name': this.container.name, 
          'controller': controller,
          'request': 'Steps'
        }
      );
    },
    answerQuestion (userInput, container_name) {
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
    },
    openLogWindow (controller) {
      const index = this.controllerPool.indexOf(controller, 0);
      if (index !== -1) {  // means found controller in controllerPool, will close controller.
        this.controllerPool.splice(index, 1);
      } else {
        if (this.controllerQty > 2) { return false }
        this.controllerPool.push(controller);
      }
      this.controllerQty = this.controllerPool.length;
    }
  }
};
</script>

<style lang='stylus' scoped>
</style>