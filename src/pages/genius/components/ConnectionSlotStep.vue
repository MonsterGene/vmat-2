<template>
  <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -11px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>

    <!-- For STEP windows only -->
    <v-card-text v-if="controller === 'STEP'">
      <div class="steps-area" :style="'max-height:' + connPageHight + 'px;min-height: 420px;'">
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
                :class="`elevation-${hover ? 10 : 3}`"
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
    <v-divider></v-divider>
    <v-card-actions style="height: 40px;">
      
    </v-card-actions>
  </v-card>
</template>

<script>
import { getContainerInfo } from '../api/getContainerInfo';

export default {
  components: {
  },
  props: ['controller', 'container', 'steps', 'connPageHight'],
  data () {
    return {
      containerInfo: '',
    };
  },
  computed: {
    connection_name () {
      return this.container + ':' + this.controller;
    },
  },
  created () {
    this.requestSteps();
  },
  methods: {
    requestSteps () {
      this.$emit('requestSteps', this.controller);
    },
  }
};
</script>

<style lang='stylus' scoped>
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
  // max-height: 600px;
  // min-height: 600px;
}
</style>