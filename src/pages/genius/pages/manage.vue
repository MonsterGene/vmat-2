<template>
  <v-container grid-list-xl fluid pa-3>
    <v-layout row wrap>
    <tool-bar
      v-bind:openScreenStyle="openScreenStyle"
      v-bind:openChangeMode="openChangeMode"
    ></tool-bar>
    <notify-marquee :notify="currentNotification"></notify-marquee>
    <v-flex lg7 md7 sm12 xs12>
      <h3><v-icon>menu</v-icon>Notification:</h3>
      <v-layout row>
        <v-flex>
          <v-text-field
            name="notify"
            label="Input new Notification Here."
            value=""
            v-model="notification"
            color="primary"
            class="input-group--focused"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-btn large
            color="primary"
            @click="setNotification"
          >
            Update
          </v-btn>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>
      <h3><v-icon>menu</v-icon>Container Style:</h3>
      <v-layout row>
        <v-flex>
          <v-select
            v-model="containerStyle"
            :items="options"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-btn large
            color="primary"
            @click="setGeniusStyle"
          >
            Update
          </v-btn>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>
      <h3><v-icon>menu</v-icon>Lock/Unlock Container:</h3>
      <v-layout row>
        <v-flex>
          <v-text-field
            label="Input Container Name Here."
            v-model="selectContainer"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-btn large
            color="primary"
            @click="handleGeniusContainer('Lock Container', 'first')"
          >
            Lock
          </v-btn>
          <v-btn large
            color="primary"
            @click="handleGeniusContainer('Unlock Container', 'first')"
          >
            Unlock
          </v-btn>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>

      <!-- Training & Relase -->
      <h3><v-icon>menu</v-icon>Training & Relase:</h3>
      <v-layout row>
        <v-btn large
          color="primary" 
          :href="'http://10.132.45.143/robinwu/FII_FG_BEACON_GENIUS'" 
          target="_blank"
        >Training Materials & Release Notes</v-btn>
      </v-layout>
    </v-flex>

    <!-- <v-divider vertical></v-divider> -->
    <!-- <v-spacer></v-spacer> -->
    <v-flex lg5 md5 sm12 xs12>
      <h3><v-icon>menu</v-icon>Action History:</h3>
      <pre v-for="h of history" :key="h">{{ h }}<v-divider></v-divider></pre>
      <v-divider></v-divider>
      <h3><v-icon>menu</v-icon>Message: time cost - <time-counter :start="startCounter" :stop="stopCounter"></time-counter></h3>
      <pre>{{ message }}</pre>
    </v-flex>
    </v-layout>
    <!-- stop comfirmation dialogs -->
      <v-layout row justify-center>
        <v-dialog v-model="openDialogs" persistent max-width="500">
          <v-card>
            <v-card-title class="headline">{{ titleDialogs }}</v-card-title>
            <v-card-text><h4>{{ contentDialogs }}</h4></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="openDialogs = false">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="openDialogs = false; handleGeniusContainer(titleDialogs, 'second')">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
  </v-container>
</template>

<script>
import ToolBar from '../components/ToolBar';
import NotifyMarquee from '../components/NotifyMarquee';
import TimeCounter from '../components/TimeCounter';

import { getIpAddress } from '../api/basic';
import {
  getNotifyMarquee,
  setNotifyMarquee,
  getHistory,
} from '../api/getNotifyMarquee';
import {
  getStyle,
  setStyle,
  lockContainer,
  unlockContainer,
} from '../api/getStyle';

export default {
  components: {
    ToolBar,
    NotifyMarquee,
    // StationSlot,
    TimeCounter,
  },
  data () {
    return {
      stopCounter: false,
      startCounter: false,
      //
      username: '',
      openScreenStyle: false,
      openChangeMode: false,
      // msg from backend
      message: '',
      notification: '',
      currentNotification: '',
      history: '',
      // Stop Dialogs
      openDialogs: false,
      titleDialogs: '',
      contentDialogs: 'Please Double Confirm ???',
      // Choose container to be lock/unlock.
      selectContainer: '',
      // Choose the Genius to update.
      version: '',
      all_version: [],
      containerStyle: 'DYNAMIC',
      options: ['DYNAMIC', 'STATIC'],
    };
  },
  created () {
    this.username = this.$cookies.get('username');
    this.getGeniusHistory();
    this.getNotification();
    this.getGeniusStyle();
  },
  methods: {
    getGeniusHistory () {
      getHistory()
        .then(response => {
          this.history = response.data.payload.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    setNotification () {
      setNotifyMarquee(this.username, this.notification)
        .then(response => {
          // console.log('Notification: ' + response.data.notification);
          // this.currentNotification = response.data.notification;
        })
        .catch(e => {
          console.log(e);
        });
      setTimeout(() => {
        // must add some delay, since wesocket neeeds some time to connect backend.
        this.getNotification();
        this.getGeniusHistory();
      }, 1000);
    },
    getNotification () {
      getNotifyMarquee()
        .then(response => {
          this.currentNotification = response.data.payload.data.notification;
          // console.log('Notification: ' + this.currentNotification);
        })
        .catch(e => {
          console.log(e);
        });
    },
    setGeniusStyle () {
      setStyle(this.username, this.containerStyle)
        .then(response => {
          // console.log('Set Genius Style to ' + this.containerStyle);
          // this.currentNotification = response.data.status;
        })
        .catch(e => {
          console.log(e);
        });
      setTimeout(() => {
        // this.getGeniusStyle();
        this.getGeniusHistory();
      }, 1500);
    },
    getGeniusStyle () {
      getStyle()
        .then(response => {
          this.containerStyle = response.data.payload.data;
          // console.log('Get Sytle ' + this.containerStyle);
        })
        .catch(e => {
          console.log(e);
        });
    },
    lockGeniusContainer () {
      lockContainer(this.username, this.selectContainer)
        .then(response => {
          // console.log('Lock Container ');
          this.message = response.data.payload.message;
          this.getGeniusHistory();
        })
        .catch(e => {
          console.log(e);
        });
    },
    unlockGeniusContainer () {
      unlockContainer(this.username, this.selectContainer)
        .then(response => {
          // console.log('unLock Container ');
          this.message = response.data.payload.message;
          this.getGeniusHistory();
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleGeniusContainer (action, seq) {
      if (seq === 'first') {
        this.titleDialogs = action;
        this.openDialogs = true;
        return false;
      }
      if (action === 'Lock Container') {
        this.lockGeniusContainer();
      }
      if (action === 'Unlock Container') {
        this.unlockGeniusContainer();
      }
    },
  },
};
</script>

<style lang='stylus' scoped>
pre {
  white-space: pre-wrap;
}
</style>