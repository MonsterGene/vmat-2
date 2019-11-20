<template>
  <v-bottom-sheet 
    v-model="openQuestion"
    :persistent="true"
    :hide-overlay="true"
    color="primary"
  >
    <v-container grid-list-xl fluid pa-0>
      <v-layout row wrap>
        <v-flex lg12 xs12 sm12 md12>
          <v-list>
            <!-- image -->
            <v-flex lg12 xs12 sm12 md12 mt-0 pb-0 v-if="image">
              <img
                v-bind:src="image"
                v-bind:alt="'Could not display ' + image"
                style="height: 320px; width: 100%"
              />
            </v-flex>
            <!-- question -->
            <v-flex lg12 xs12 sm12 md12 mt-0 pb-0>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    @click="closeQuestion"
                    v-on="on"
                    color="primary"
                    dark
                  >clear</v-icon>
                </template>
                <span>To Close Question</span>
              </v-tooltip>
              <time-counter :start="startCounter" :stop="stopCounter"></time-counter>
              <h3>[ <span class="font-weight-regular red--text">{{ container }}</span> ]: {{ title }}</h3>
            </v-flex>
            <!-- input -->
            <v-flex lg12 xs12 sm12 md12 pt-0 pb-0 v-if="type === 'text'">
              <v-text-field v-if="visible === 'YES'"
                style="font-size:22px;"
                label="Type Your Input Here."
                autofocus
                outline
                clearable
                type="text"
                v-model="userInput"
                v-on:keyup.enter="onEnter"
              >
                <v-btn slot="append-outer" large color="primary" style="top: -16px" @click="submitUserInput">
                  <v-icon left>send</v-icon>
                  Submit
                </v-btn>
              </v-text-field>
              <!-- It is for invisible -->
              <v-text-field v-if="visible === 'NO'"
                style="font-size:22px;"
                label="Type Your Input Here."
                autofocus
                outline
                clearable
                type="password"
                v-model="userInput"
                v-on:keyup.enter="onEnter"
              >
                <v-btn slot="append-outer" large color="primary" style="top: -16px" @click="submitUserInput">
                  <v-icon left>send</v-icon>
                  Submit
                </v-btn>
              </v-text-field>
            </v-flex>
            <!-- select -->
            <v-flex lg12 xs12 sm12 md12 pt-0 pb-0 v-if="type === 'select'">
              <v-select
                :items="options"
                style="font-size:22px;"
                label="Select Your Option Here."
                outline
                clearable
                v-model="userInput"
              >
                <v-btn slot="append-outer" large color="primary" style="top: -16px" @click="submitUserInput">
                  <v-icon left>send</v-icon>
                  Submit
                </v-btn>
              </v-select>
            </v-flex>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-bottom-sheet>
</template>

<script>
import TimeCounter from '../components/TimeCounter';

export default {
  components: {
    TimeCounter,
  },
  props: ['title', 'open', 'type', 'options', 'image', 'container', 'visible'],
  data () {
    return {
      userInput: '',
      stopCounter: false,
      startCounter: false,
    };
  },
  computed: {
    openQuestion () {
      return this.open;
    }
  },
  watch: {
    title () {
      this.startCounter = !this.startCounter;
    }
  },
  methods: {
    submitUserInput () {
      // this.openQuestion = false;
      // this.stopCounter = !this.stopCounter;
      this.$emit('answerQuestion', this.userInput, this.container);
      this.userInput = '';
    },
    onEnter () {
      this.submitUserInput();
    },
    closeQuestion () {
      this.$emit('closeQuestion');
      this.userInput = '';
    }
  }
};
</script>

<style lang='stylus' scoped>
</style>