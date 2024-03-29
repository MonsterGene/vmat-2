<template>
  <v-hover>
    <v-card ma-3 tile flat
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 10 : 3}`"
      class="mx-auto"
      :color="containerColor"
      :style="containerColor"
    >
    <v-card-title text-color="white">
      <v-layout row wrap>
        <v-flex lg10 sm10 pa-0 pl-1>
          <span><a :href="'#' + container.url"><h4 class="font-weight-regular">{{ container.name }}</h4></a></span>

          <span class="black--text">{{ container.test_time }}</span><br>
          <v-divider></v-divider>
          <span class="black--text" @click="clickSerialNumber(container.display1)">{{ display1 }}</span><br>
          <v-divider></v-divider>
          <span class="black--text">{{ display2 }}</span><br>
          <v-divider></v-divider>
          <span class="black--text">{{ display3 }}</span><br>
        </v-flex>
        <v-flex lg2 sm2 pa-2>
          <span class="group pa-0">
              <v-tooltip left>
                <v-icon
                  @click="clickAction(action)"
                  :disabled="actionDisabledFlag"
                  slot="activator"
                  color="primary"
                  dark
                >{{ actionIcon }}</v-icon>
                <span>{{ action }}</span>
              </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <v-icon v-show="(container.name === questionContainer || container.question) && container.status === 'run'"
                @click="reOpenQuestion"
                slot="activator"
                color="primary"
                dark
              >live_help</v-icon>
              <span>Ask Question</span>
            </v-tooltip>
            <v-tooltip left>
              <v-icon v-show="container.status !== 'idle'"
                slot="activator"
                color="primary"
                dark
              >{{ modeIcon }}</v-icon>
              <span>{{ container.mode }}, by {{ container.username }}</span>
            </v-tooltip>
            <v-tooltip left>
              <v-icon v-show="container.stop_by_username && container.status === 'stop'"
                slot="activator"
                color="primary"
                dark
              >mood_bad</v-icon>
              <span>Stop by {{ container.stop_by_username }}</span>
            </v-tooltip>
            <v-tooltip left>
              <v-icon v-show="container.status === 'fail'"
                slot="activator"
                color="primary"
                dark
              >sentiment_very_dissatisfied</v-icon>
              <span>Failed</span>
            </v-tooltip>
            <v-tooltip left>
              <v-icon v-show="container.lock_by_user"
                slot="activator"
                color="primary"
                dark
              >lock</v-icon>
              <span>Locked, by {{ container.lock_by_user }}</span>
            </v-tooltip>
            <v-tooltip left>
                <v-icon v-show="container.in_locking === 'YES'"
                  slot="activator"
                  color="primary"
                  dark
                >screen_lock_landscape</v-icon>
                <span>In Locking</span>
              </v-tooltip>
              <v-tooltip left>
                <v-icon v-show="container.in_sync_up === 'YES'"
                  slot="activator"
                  color="primary"
                  dark
                >sync</v-icon>
                <span>In Sync Up</span>
              </v-tooltip>
              <v-tooltip left>
                <v-icon v-show="container.in_leading === 'YES'"
                  slot="activator"
                  color="primary"
                  dark
                >ring_volume</v-icon>
                <span>In Leading</span>
              </v-tooltip>
          </span>
        </v-flex>
      </v-layout>
    </v-card-title>
    <!-- ask question -->
    <ask-question
      v-bind:title="questionTitle2"
      v-bind:type="questionType2"
      v-bind:options="questionOptions2"
      v-bind:image="questionImage2"
      v-bind:visible="questionVisible2"
      v-bind:open="openQuestion2"
      v-bind:container="questionContainer2"
      @closeQuestion="closeQuestion2"
      @answerQuestion="answerQuestion2"
    ></ask-question>
    <!-- snack bar -->
    <notify-snackbar
      :title="snackTitle"
      :open="openSnack"
    ></notify-snackbar>
    <v-progress-linear class="ma-0" :value="container.progress" height="4"></v-progress-linear>
    </v-card>
  </v-hover>
</template>

<script>
import AskQuestion from './AskQuestion';
import NotifySnackbar from './NotifySnackbar';
import store from '../../vision/store';

export default {
  components: {
    AskQuestion,
    NotifySnackbar,
    store,
  },
  props: ['container', 'questionContainer'],
  data () {
    return {
      actionDisabledFlag: false,
      snackTitle: '',
      openSnack: false,
      // Question
      openQuestion2: false,   // it is for nested Ask Quesiton.
    };
  },
  computed: {
    display1 () {
      let display = this.container.display1.split(':')[0];
      if (display === 'SERNUM') {
        return this.container.display1.split(':')[1].substring(0, 22);
      } else {
        return this.container.display1.substring(0, 22);
      }
    },
    display2 () {
      let display = this.container.display2.split(':')[0];
      if (display === 'UUTTYPE') {
        return this.container.display2.split(':')[1].substring(0, 22);
      } else {
        return this.container.display2.substring(0, 22);
      }
    },
    display3 () {
      let display = this.container.display3.split(':')[0];
      if (display === 'STEP') {
        return this.container.display3.split(':')[1].substring(0, 22);
      } else {
        return this.container.display3.substring(0, 22);
      }
    },
    questionTitle2 () {
      return this.container.question;
    },
    questionType2 () {
      if (this.container.answers) {
        return 'select';
      } else { return 'text' }
    },
    questionOptions2 () { 
      if (this.container.answers) {
        return JSON.parse(this.container.answers);
      } else { return [] }
    },
    questionImage2 () { 
      // console.log(this.container.question_image);
      return this.container.question_image;
    },
    questionVisible2 () { 
      return this.container.question_visible;
    },
    questionContainer2 () { return this.container.name },
    containerColor () {
      if (this.questionContainer === this.container.name && this.container.status === 'run') { return 'info' }
      else if (this.container.question) { return 'info' }  // it is for nested Ask Quesiton.
      else if (this.container.status === 'run') { return 'background: rgb(240,184,0);' }
      // else if (this.container.status === 'pass') { return 'background: rgb(79,145,58);' }
      // else if (this.container.status === 'stop' || this.container.status === 'fail') { return 'background: rgb(216,31,40);' } 
      else if (this.container.status === 'pass') { return 'background: rgb(80,185,90);' }
      else if (this.container.status === 'stop' || this.container.status === 'fail') { return 'background: rgb(239,143,155);' } 
      else { return '' }
    },
    action () {
      if (this.container.status === 'idle') {
        if (this.container.in_disabled === 'disabled') {
          if (this.container.in_blocked) {
            return 'Unblock';
          } else {
            return 'Block';
          }
        }
        return 'Start Test';
      }
      else if (this.container.status === 'run') { return 'Stop Test' }
      else if (this.container.status === 'stop' || this.container.status === 'fail' || this.container.status === 'pass') { return 'Deposit Test' }
      else { return 'Start Test' }
    }, 
    actionIcon () {
      if (this.container.status === 'idle') {
        if (this.container.in_disabled === 'disabled') {
          if (this.container.in_blocked) {
            return 'link_off';
          } else {
            return 'link';
          }
        }
        return 'play_arrow';
      }
      else if (this.container.status === 'run') { return 'highlight_off' }
      else if (this.container.status === 'stop' || this.container.status === 'fail' || this.container.status === 'pass') { return 'delete_forever' }
      else { return 'play_arrow' }
    },
    modeIcon () {
      if (this.container.mode === 'PROD') { return 'stars' }
      else if (this.container.mode === 'DEBUG') { return 'bug_report' } 
      else { return 'stars' }
    },
  },
  methods: {
    clickAction (action) {
      if (this.container.is_locked) {
        this.snackTitle = this.container.name + ' is locked by ' + this.container.lock_by_user;
        this.openSnack = !this.openSnack;
        return false;
      }
      // 20190527, void duplicate start test
      this.actionDisabledFlag = true;
      this.$emit('clickAction', action, this.container.name);
      setTimeout(() => {
        this.actionDisabledFlag = false;
      }, 1000);
    },
    reOpenQuestion () {
      if (this.container.question) {  // it is for nested Ask Question
        this.openQuestion2 = true;
      } else {
        this.$emit('reOpenQuestion');
      }
    },
    closeQuestion2 () {
      this.openQuestion2 = false;
    },
    answerQuestion2 (userInput, container_name) {
      this.$emit('answerQuestion', userInput, container_name);
      this.closeQuestion2();
    },
    clickSerialNumber (serial_number) {
      let flag = serial_number.split(':')[0];
      let sernum = serial_number.split(':')[1];
      if (flag === 'SERNUM') {
        this.$router.push('/vision/basic');
        store.commit('changeSernum', sernum.replace(' ', ''));
      }
    }
  }
};
</script>

<style lang='stylus' scoped>
.sernum {
  marign-right: 20%;
}
a:link {
    background-color: transparent;
    text-decoration: none;
}
a:hover {
    color: red;
    background-color: transparent;
    text-decoration: underline;
}
</style>