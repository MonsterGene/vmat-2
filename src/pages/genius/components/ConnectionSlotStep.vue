<template>
  <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -11px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>

    <!-- For STEP windows only -->
    <v-card-text v-if="controller === 'STEP'">
      <div class="steps-area" :style="'max-height:' + connPageHight + 'px;min-height:' + connPageHight + 'px;'">
      <v-layout row wrap pa-0 ma-0>
        <v-flex lg12 md12 sm12 xs12 pa-0 ma-0 v-for="(step1, index1) in steps" :key="index1">
        <v-layout row wrap pa-0 ma-0 :align-center="true">
        <v-flex :class="'lg' + 12 / calcLength(step1) + ' md' + 12 / calcLength(step1)" pa-0 v-for="(step2, index2) in step1" :key="index2">

        <v-flex lg12 md12 sm12 xs12 pa-0 ma-0 mt-2 v-for="(step, index) in step2" :key="index">
            <v-hover :class="
            step.status === 'running' && 'yellow' ||
            step.status === 'passed' && 'green' ||
            step.status === 'pending' && 'gray' ||
            step.status === 'failed' && 'red'
            ">
              <v-card
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 10 : 3}`"
                style="height: 95%; margin-top: -5px;"
              >
                <v-card-text class="">
                  <div class="row mb-0 align-center justify-space-between">
                    <div class="text-box" style="max-height: 13px;">
                      <div class="text-md-center" style="margin-top: -8px;"><h5 class="font-weight-regular">{{ (step.name || '') + ' ' }} {{ step.time || '' }}</h5></div>
                    </div>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
        </v-flex>
        </v-layout>
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
  props: ['controller', 'container', 'steps', 'connPageHight', 'controllerQty'],
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
    calcLength (steps) {
      return steps.length;
    }
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