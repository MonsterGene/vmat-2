<template>
  <div id="test-data-dashboard">
    <v-layout row wrap>
      <v-flex sm12>
        <v-widget title="Advanced 2.0 Test Data Search">
          <div slot="widget-content">
            <v-flex>
              <v-alert
                v-model="alert"
                dismissible
                :color="alert_color"
              >
                {{ alert_message }}
              </v-alert>
            </v-flex>
            <v-container fluid>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex d-flex sm4 lg4>
                    <v-layout row wrap>
                      <v-flex sm6 lg6 d-flex>
                        <v-textarea outline rows="2" label="UUT Type" v-model="uuttype">
                        </v-textarea>
                      </v-flex> 
                      <v-flex sm6 lg6 d-flex>
                        <v-textarea outline rows="2" label="Area" v-model="area">
                        </v-textarea>
                      </v-flex> 
                      <v-flex sm6 lg6 d-flex>
                        <v-textarea outline rows="2" label="Machine" v-model="machine">
                        </v-textarea>
                      </v-flex> 
                      <v-flex sm6 lg6 d-flex>
                        <v-textarea outline rows="2" label="Serial Number" v-model="sernum">
                        </v-textarea>
                      </v-flex> 
                    </v-layout>
                  </v-flex> 

                  <v-flex d-flex sm1 lg1>
                  </v-flex>
                  <v-flex d-flex sm7 lg7>
                    <v-layout row wrap>
                      <v-flex sm6 lg6>
                        <v-menu
                          class="pr-2"
                          ref="setStatDate"
                          lazy
                          :close-on-content-click="false"
                          v-model="startDateMenu"
                          transition="scale-transition"
                          offset-y
                          full-width
                          :nudge-bottom="-22"
                          max-width="290px"
                          :return-value.sync="startDate"
                        >
                          <v-text-field
                            slot="activator"
                            label="Start Date"
                            v-model="startDate"
                            append-icon="event"
                            readonly
                          ></v-text-field>
                          <v-date-picker v-model="startDate" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.setStatDate.save(startDate)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-flex> 
                      <v-flex sm6 lg6>
                        <v-menu
                          ref="setEndDate"
                          lazy
                          class="pr-2"
                          :close-on-content-click="false"
                          v-model="endDateMenu"
                          transition="scale-transition"
                          offset-y
                          full-width
                          :nudge-bottom="-22"
                          min-width="290px"
                          :return-value.sync="endDate"
                        >
                          <v-text-field
                            slot="activator"
                            label="End Date"
                            v-model="endDate"
                            append-icon="event"
                            readonly
                          ></v-text-field>
                          <v-date-picker v-model="endDate" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="endDateMenu = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.setEndDate.save(endDate)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-flex>

                      <v-flex>
                        <v-checkbox
                          :label="`Fail `"
                          color="purple"
                          :disabled="true"
                          v-model="fail_box"
                        ></v-checkbox>
                      </v-flex>
                      <v-flex>
                        <v-checkbox
                          :label="`Pass `"
                          color="purple"
                          :disabled="true"
                          v-model="pass_box"
                        ></v-checkbox>
                      </v-flex>
                      <!-- <v-flex>
                        <v-checkbox
                          :label="`Start `"
                          color="purple"
                          v-model="start_box"
                        ></v-checkbox>
                      </v-flex> -->
                      <v-flex>
                        <v-checkbox
                          :label="`Abort `"
                          color="purple"
                          v-model="abort_box"
                        ></v-checkbox>
                      </v-flex>
                      <v-flex>
                        <v-checkbox
                          :label="`DEBUG `"
                          color="purple"
                          v-model="debug_box"
                        ></v-checkbox>
                      </v-flex>
                      <v-flex xl4>
                        <v-btn large
                          color="primary"
                          :loading="loading"
                          @click.native="loading = true; dialog = true"
                          @click="getDataSummaryMethod"
                          :disabled="loading"
                        >
                          Search
                          <span slot="loader">Loading...</span>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex> 
                  <v-flex>
                    <div class="text-xs-center">
                      <v-dialog
                        v-model="dialog"
                        hide-overlay
                        persistent
                        width="300"
                      >
                        <v-card
                          color="primary"
                          dark
                        >
                          <v-card-text>
                            Loading data, please wait...
                            <v-progress-linear
                              indeterminate
                              color="white"
                              class="mb-0"
                            ></v-progress-linear>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </div>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </div>
        </v-widget>
      </v-flex>
    </v-layout>
    
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg4 md4 sm12 xs12 pt-0 pb-0 pl-0 pr-1>
          <v-card>
            <v-card-text>
              <div class="layout row ma-0 align-center justify-space-between">
                <div class="text-box">
                  <div class="subheading" @click="freshDataSummary('first_data')"><a>First Yield</a></div>
                  <span class="red--text">{{ firstDataSummary }}</span>
                </div>
                <div class="details">
                  <v-layout row>
                  <v-tooltip top>
                    <v-btn flat icon color="error" slot="activator" @click="downloadDataExcel('first')">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                    <span>Download Raw First Data</span>
                  </v-tooltip>
                  </v-layout>
                </div>
              </div>
            </v-card-text>
          </v-card> 
        </v-flex>
        <!-- mini panel -->
        <v-flex lg4 md4 sm12 xs12 pt-0 pb-0 pl-0 pr-1>
          <v-card>
            <v-card-text>
              <div class="layout row ma-0 align-center justify-space-between">
                <div class="text-box">
                  <div class="subheading" @click="freshDataSummary('test_data')"><a>Test Yield</a></div>
                  <span class="red--text">{{ testDataSummary }}</span>
                </div>
                <div class="details">
                  <v-layout row>
                  <v-tooltip top>
                    <v-btn flat icon color="error" slot="activator" @click="downloadDataExcel('test')">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                    <span>Download Raw Test Data</span>
                  </v-tooltip>

                  </v-layout>
                </div>
              </div>
            </v-card-text>
          </v-card> 
        </v-flex>
        <v-flex lg4 md4 sm12 xs12 pt-0 pb-0 pl-1 pr-0>
          <v-card>
            <v-card-text>
              <div class="layout row ma-0 align-center justify-space-between">
                <div class="text-box">
                  <div class="subheading" @click="freshDataSummary('board_data')"><a>Board Yield</a></div>
                  <span class="red--text">{{ boardDataSummary }}</span>
                </div>
                <div class="details">
                  <v-layout row>
                  <v-tooltip top>
                    <v-btn flat icon color="error" slot="activator" @click="downloadDataExcel('board')">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                    <span>Download Raw Board Data</span>
                  </v-tooltip>
                  </v-layout>
                </div>
              </div>
            </v-card-text>
          </v-card> 
        </v-flex>

        <!-- first data -->
        <v-layout row wrap>
          <v-flex lg6 md6 sm12 xs12 pr-1>
          <yield-chart :title="dataCategory + ' Yield/Throughput'" :chart-data="yieldThroughput" ref="yieldThroughput">
            </yield-chart>
          </v-flex>
          <v-flex lg6 md6 sm12 xs12 pl-0>
            <plato-chart :title="dataCategory + ' Analysis ' + timeCategory" :chart-data="yieldAnalysis" ref="yieldAnalysis">
            </plato-chart>
          </v-flex>

        <v-flex lg6 sm12 xs12 pr-1>
          <fail-pie-chart 
            :title="dataCategory + ' By Area ' + timeCategory" 
            name="Daily" 
            :chart-data="failureAnalysisByArea" 
            ref="failureAnalysisByArea"
          >
          </fail-pie-chart>             
        </v-flex>
        <v-flex lg6 sm12 xs12 pl-0>
          <plato-chart :title="dataCategory + ' Analysis ' + areaSelect" :chart-data="yieldAnalysisByArea" ref="yieldAnalysisByArea">
          </plato-chart>
        </v-flex>

        <v-flex lg6 sm12 xs12 pr-1>
          <fail-pie-chart 
            :title="dataCategory + ' By UUTTYPE ' + timeCategory" 
            name="Daily" 
            :chart-data="failureAnalysisByUuttype"
            ref="failureAnalysisByUuttype"
          >
          </fail-pie-chart>             
        </v-flex>

        <v-flex lg6 sm12 xs12 pl-0>
          <plato-chart :title="dataCategory + ' Analysis ' + uuttypeSelect" :chart-data="yieldAnalysisByUuttype" ref="yieldAnalysisByUuttype">
          </plato-chart>
        </v-flex>

        <v-flex lg6 sm12 xs12 pr-1>
          <fail-pie-chart 
            :title="dataCategory + ' By Machine ' + timeCategory" 
            name="Daily" 
            :chart-data="failureAnalysisByMachine"
            ref="failureAnalysisByMachine"
          >
          </fail-pie-chart>             
        </v-flex>

        <v-flex lg6 sm12 xs12 pl-0>
          <plato-chart :title="dataCategory + ' Analysis ' + machineSelect" :chart-data="yieldAnalysisByMachine" ref="yieldAnalysisByMachine">
          </plato-chart>
        </v-flex>

        <v-flex lg12 sm12 xs12>
          <plato-chart :title="dataCategory + ' Analysis ' + machineSelect" :chart-data="yieldAnalysisByContainer" ref="yieldAnalysisByContainer">
          </plato-chart>
        </v-flex>
        </v-layout>

        <v-flex lg12 sm12 xs12 id="test-data-table" pa-0>
          <data-table
            :search="dataSearch"
            :title="'Raw Test Data ' + timeCategory"
            :testDataSource="tableSource"
          ></data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import EChart from '@/components/chart/echart';
import { getDataSummary, getDataDetails, getDataExcel } from '../api/advanced2';
import Material from 'vuetify/es5/util/colors';
import MiniChart from '@/components/widgets/chart/MiniChart';
import BoxChart from '@/components/widgets/chart/BoxChart';
import VWidget from '@/components/VWidget';
import YieldChart from '../components/YieldChart';
import PlatoChart from '../components/PlatoChart';
import FailPieChart from '../components/FailPieChart';
import DataTable from '../components/DataTable2';

export default {
  components: {
    BoxChart,
    MiniChart,
    EChart,
    VWidget,
    YieldChart,
    PlatoChart,
    FailPieChart,
    DataTable,
  },
  data () {
    return {
      // for alert
      alert: false,
      alert_color: 'warning',
      alert_message: 'it is error',
      valid: true,
      // for date picker
      startDateMenu: false,
      endDateMenu: false,
      startDate: this.getCurrentDate(6),
      endDate: this.getCurrentDate(),
      uuttype: '',
      area: '',
      machine: '',
      sernum: '',
      mode: '',
      result: '', 
      test: '', 
      // for search button
      loading: false,
      // for progress
      dialog: false,
      // for check box
      start_box: false,
      abort_box: false,
      fail_box: true,
      pass_box: true,
      debug_box: false,

      responseData: {},
      // for user input
      model: {
        start_date: '',
        end_date: '',
        uuttype: '',
        area: '',
        machine: '',
        sernum: '',
        mode: '',
        result: '', 
        test: '', 
      },
      yieldThroughput: [],
      failureAnalysis: [],
      failureAnalysisByArea: [],
      failureAnalysisByUuttype: [],
      failureAnalysisByMachine: [],
      yieldAnalysis: [],
      yieldAnalysisByArea: [],
      yieldAnalysisByUuttype: [],
      yieldAnalysisByMachine: [],
      yieldAnalysisByContainer: [],

      dataSelect: 'first_data',  // first_data,test_data,board_data
      indexSelect: 100,  // 
      dataCategory: 'First',  // First, Test, Board
      timeCategory: 'Overall',  // Overall, 20190909
      //
      areaSelect: '',
      machineSelect: '',
      uuttypeSelect: '',
      
      tableSource: [],
      dataSearch: '',
      color: Material,
      //
      time_stamp: '',
      firstDataSummary: '',
      testDataSummary: '',
      boardDataSummary: '',
    };
  },
  watch: {
  },  
  created () {
    const params = this.$route.query;
    if (params.machine) { this.machine = params.machine }
    if (params.uuttype) { this.uuttype = params.uuttype }
    if (params.area) { this.area = params.area }
    if (params.sernum) { this.sernum = params.sernum }
    if (params.test) { this.test = params.test }
    if (params.startDate) { this.startDate = params.startDate }
    if (params.endDate) { this.endDate = params.endDate }
  }, 
  destroyed () {
    console.log('It is destroyed');
  },
  beforeDestroy () {
    console.log('It is beforeDestroy');
  },
  mounted () {
    this.$refs.yieldThroughput.chartInstance.on('click', evt => {
      const name = evt.name;
      this.dataSearch = '';
      // console.log(name);
      // console.log(this.responseData[this.dataSelect].daily);
      let indexSelect = 0;
      this.responseData[this.dataSelect].daily.forEach(function (element, index, self) {
        if (element.name === name) {
          indexSelect = index;
        }
      });
      this.indexSelect = indexSelect;
      // console.log(this.indexSelect);
      this.timeCategory = name;
      this.failureAnalysisByArea = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.area;
      this.failureAnalysisByUuttype = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.uuttype;
      this.failureAnalysisByMachine = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.machine;
      this.yieldAnalysis = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.overall;
      this.getDataDetailsMethod(name);
    });
    // top fail chart.
    this.$refs.yieldAnalysis.chartInstance.on('click', evt => {
      const name = evt.name;
      this.dataSearch = name;
    });
    // for by area chart / by machine chart
    this.$refs.failureAnalysisByArea.chartInstance.on('click', evt => {
      const name = evt.name;
      this.areaSelect = name;
      this.dataSearch = name;
      if (this.indexSelect === 1000) {
        this.yieldAnalysisByArea = this.responseData[this.dataSelect].analysis.by_area[name];
      } else {
        this.yieldAnalysisByArea = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_area[name];
      }
    });
    this.$refs.failureAnalysisByMachine.chartInstance.on('click', evt => {
      const name = evt.name;
      this.machineSelect = name;
      this.dataSearch = name;
      if (this.indexSelect === 1000) { 
        this.yieldAnalysisByMachine = this.responseData[this.dataSelect].analysis.by_machine[name];
        this.yieldAnalysisByContainer = this.responseData[this.dataSelect].analysis.by_container[name];
      } else {
        this.yieldAnalysisByMachine = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_machine[name];
        this.yieldAnalysisByContainer = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_container[name];
      }
    });
    this.$refs.failureAnalysisByUuttype.chartInstance.on('click', evt => {
      const name = evt.name;
      this.uuttypeSelect = name;
      this.dataSearch = name;
      if (this.indexSelect === 1000) {
        this.yieldAnalysisByUuttype = this.responseData[this.dataSelect].analysis.by_uuttype[name];
      } else {
        this.yieldAnalysisByUuttype = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_uuttype[name];
      }
    });
    this.$refs.yieldAnalysisByArea.chartInstance.on('click', evt => { 
      this.dataSearch = evt.name;
    });
    this.$refs.yieldAnalysisByUuttype.chartInstance.on('click', evt => { 
      this.dataSearch = evt.name;
    });
    this.$refs.yieldAnalysisByMachine.chartInstance.on('click', evt => { 
      this.dataSearch = evt.name;
    });
    this.$refs.yieldAnalysisByContainer.chartInstance.on('click', evt => { 
      this.dataSearch = evt.name;

    });
    
  },
  methods: {
    getCurrentDate (delta = 0) {
      const d = new Date();
      d.setDate(d.getDate() - delta);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return year + '-' + month + '-' + day;
    },
    handleTabChange (val, e) {
      // make sure the chart resized while parent from hidden to show
      window.dispatchEvent(new Event('resize'));
    },
    getDataSummaryMethod () {
      this.model.start_date = this.startDate + ' 00:00:00';
      this.model.end_date = this.endDate + ' 23:59:59';
      if (!this.debug_box) { this.model.mode = 'PROD' } else { this.model.mode = 'PROD,DEBUG' }
      if (this.pass_box) { this.model.result += 'P' }
      if (this.fail_box) { this.model.result += ' F' }
      if (this.start_box) { this.model.result += ' S' }
      if (this.abort_box) { this.model.result += ' A' }
      this.model.uuttype = this.uuttype;
      this.model.sernum = this.sernum;
      this.model.area = this.area;
      this.model.machine = this.machine;

      const params = {
        'start_date': this.model.start_date,
        'end_date': this.model.end_date,
        'uuttype': this.model.uuttype,
        'sernum': this.model.sernum,
        'area': this.model.area,
        'machine': this.model.machine,
        'result': this.model.result,
        'mode': this.model.mode,
        'test': this.model.test,
      };
      this.loading = true;
      this.dialog = true;
      // console.log(params);
      getDataSummary(params)
        .then(response => {
          // console.log(response.data);
          this.alert = true;
          if (!response.data.status) {
            this.alert_color = 'warning';
            this.alert_message = response.data.payload.message;
          }
          else {
            this.alert_color = 'success';
            this.responseData = response.data.payload.data;
            this.time_stamp = this.responseData.time_stamp;
            this.firstDataSummary = this.responseData.first_data.yield;
            this.testDataSummary = this.responseData.test_data.yield;
            this.boardDataSummary = this.responseData.board_data.yield;
            this.freshDataSummary('first_data');
            this.alert_message = response.data.payload.message + ',' + response.data.payload.time;
          }
          this.model.result = '';
          this.model.mode = '';
          
          setTimeout(() => {  // set time out to make sure all charts are inited.
            this.loading = false;  // for search button
            this.dialog = false;  // for loading window
          }, 1000);
        })
        .catch(e => {
          console.log(e);
          this.alert = true;
          this.alert_color = 'red';
          this.alert_message = 'Service Error, Please Contact Genius Team.';
          this.dialog = false;
          this.model.result = '';
          this.model.mode = '';
        });
    },
    freshDataSummary (dataSelect) {
      this.dataSelect = dataSelect;
      this.dataSearch = '';
      // console.log(this.dataSelect);
      if (!this.responseData) {
        return false;
      }
      if (this.dataSelect === 'first_data') { this.dataCategory = 'First' }
      if (this.dataSelect === 'test_data') { this.dataCategory = 'Test' }
      if (this.dataSelect === 'board_data') { this.dataCategory = 'Board' }
      this.timeCategory = 'Overall';
      this.indexSelect = 1000;
      this.yieldThroughput = this.responseData[this.dataSelect].daily;
      this.failureAnalysisByArea = this.responseData[this.dataSelect].analysis.area;
      this.failureAnalysisByUuttype = this.responseData[this.dataSelect].analysis.uuttype;
      this.failureAnalysisByMachine = this.responseData[this.dataSelect].analysis.machine;
      //
      this.yieldAnalysis = this.responseData[this.dataSelect].analysis.overall;

      this.getDataDetailsMethod('overall');
    },
    //
    getDataDetailsMethod (dateStamp) {
      // this.dialog = true;
      let data_type = 'first';
      if (this.dataSelect === 'first_data') { data_type = 'first' }
      if (this.dataSelect === 'test_data') { data_type = 'test' }
      if (this.dataSelect === 'board_data') { data_type = 'board' }
      getDataDetails(this.time_stamp, dateStamp, data_type)
        .then(response => {
          if (!response.data['status']) {
            this.alert = true;
            this.alert_color = 'warning';
            this.alert_message = response.data.payload.message;
          }
          else {
            this.tableSource = response.data.payload.data;
            // console.log(this.tableSource);
          }
          this.dialog = false;  // for loading window
          this.model.result = '';
          this.model.mode = '';
        })
        .catch(e => {
          console.log(e);
          this.alert = true;
          this.alert_color = 'red';
          this.alert_message = 'Service Error, Please Contact Genius Team.';
          this.dialog = false;
          this.model.result = '';
          this.model.mode = '';
        });
    },
    downloadDataExcel (date_type) {
      let dataType = date_type;
      // console.log(dataType);
      // console.log(this.time_stamp);
      if (!this.time_stamp) { return false }
      this.dialog = true;
      getDataExcel(this.time_stamp, dataType)
        .then(response => {
          if (!response.data['status']) {
            this.alert = true;
            this.alert_color = 'warning';
            this.alert_message = response.data.payload.message;
          }
          else {
            let url = response.data.payload.data.url;
            console.log(url);
            window.location.href = url;
          }
          this.dialog = false;  // for loading window
          this.model.result = '';
          this.model.mode = '';
        })
        .catch(e => {
          console.log(e);
          this.alert = true;
          this.alert_color = 'red';
          this.alert_message = 'Service Error, Please Contact Genius Team.';
          this.dialog = false;
          this.model.result = '';
          this.model.mode = '';
        });
    }
  },

};
</script>