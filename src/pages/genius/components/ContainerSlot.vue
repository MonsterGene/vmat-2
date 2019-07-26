<template>
    <v-hover>
      <v-card tile flat
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 10 : 3}`"
        class="mx-auto"
        :color="containerColor"
      >
      <v-card-title>
        <v-layout row wrap>
          <v-flex lg10 sm10 pt-0 pb-0 pl-2>
            <span><a :href="'#' + container.url"><h4 class="font-weight-light">{{ container.name }}</h4></a></span>

            <span class="black--text">{{ container.test_time }}</span><br>
            <div v-show="container.display1">
            <v-divider></v-divider>
            <span class="black--text" @click="clickSerialNumber(container.display1)">
              {{ container.display1 }}
            </span><br>
            </div>
            <div v-show="container.display2 && !showLess">
            <v-divider></v-divider>
            <span class="black--text">{{ container.display2 }}</span><br>
            </div>
            <div v-show="container.display3 && !showLess">
            <v-divider></v-divider>
            <span class="black--text">{{ container.display3 }}</span>
            </div>
          </v-flex>
          <v-flex lg2 sm2 pt-1 pl-2 pr-1>
            <span class="group pa-0">
              <v-tooltip left>
                <v-icon
                  @click="clickAction(action)"
                  :disabled="actionDisabled"
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
                <v-icon v-show="container.status === 'stop'"
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
            </span>
          </v-flex>
        </v-layout>
      </v-card-title>
          <v-progress-linear class="ma-0" :value="container.progress" height="4" v-show="container.status !== 'idle' && container.status !== 'pass'"></v-progress-linear>
      <!-- ask question -->
      <ask-question
        v-bind:title="questionTitle2"
        v-bind:type="questionType2"
        v-bind:options="questionOptions2"
        v-bind:image="''"
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
  props: ['container', 'questionContainer', 'showLess'],
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
      // console.log(this.container.symptom);
      return this.container.symptom;
    },
    questionContainer2 () { return this.container.name },
    containerColor () {
      if (this.questionContainer === this.container.name && this.container.status === 'run') { return 'info' }
      else if (this.container.question) { return 'info' }  // it is for nested Ask Quesiton.
      else { return '' }
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
    modeIcon () {
      if (this.container.mode === 'PROD') { return 'stars' }
      else if (this.container.mode === 'DEBUG') { return 'bug_report' } 
      else { return 'stars' }
    },
    actionDisabled () {
      if (this.container.user === 'disabled' && this.container.status === 'idle') { return true }
      else if (this.actionDisabledFlag) { return true }
      else { return false }
    }
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
      // console.log(action);
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