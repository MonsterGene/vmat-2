<template>
  <v-card>
    <v-card-title style="height: 30px;">
      <h4 style="margin-top: -11px;"><v-icon>menu</v-icon>{{ controller }}</h4>
    </v-card-title>
    <v-divider></v-divider>
    
    <v-card-text>
      <e-chart class="profile-area"
        ref="chart"
        :path-option="[
          ['dataset.source', chartData],
          ['grid.left', '1%'],
          ['grid.right', '1%'],
          ['legend.show', true],
          ['color', [color.red.base, color.indigo.base]],
          ['toolbox.show', true],
          ['xAxis.axisLabel.show', true],
          ['xAxis.axisLabel.rotate', 40],
          ['yAxis.axisLabel.show', true],
          ['yAxis', [{'position': 'left', 'min': -50, 'max': 70, 'interval': 10, 'axisLabel': {formatter : '{value} ℃'}}]],
          
          ['series[0].type', 'line'],
          ['series[0].yAxisIndex', 0],
          ['series[0].smooth', true],
          ['series[0].label.position', 'top'],

          ['series[1].type', 'line'],
          ['series[1].yAxisIndex', 0],
          ['series[1].smooth', true],
          ['series[1].label.position', 'top'],

        ]"
        height="350px"
        width="100%"
      >
      </e-chart>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions style="height: 40px;">
    </v-card-actions>
  </v-card>
</template>

<script>
import EChart from '@/pages/vision/components/echart';
import VWidget from '@/components/VWidget';
import Material from 'vuetify/es5/util/colors';
import { getContainerInfo } from '../api/getContainerInfo';

export default {
  components: {
    EChart,
    VWidget,
  },
  props: ['controller', 'container', 'controllerQty', 'profileData'],
  data () {
    return {
      color: Material,
      chartInstance: null,
      // chartData: null,
      chartData: [],
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
        this.chartInstance.resize();
      },
    },
    'profileData': {
      handler: function (data) {
        this.chartData = this.chartData.concat(data);
        // console.log(this.chartData);
      },
    },
  },
  mounted () {
    this.chartInstance = this.$refs.chart.chartInstance;
    this.requestProfile();
  },
  methods: {
    requestProfile () {
      this.$emit('requestProfile', this.controller);
    },
  }
};
</script>

<style lang='stylus' scoped>
.profile-area {
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
</style>