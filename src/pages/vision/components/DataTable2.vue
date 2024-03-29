<template>
  <v-widget :title="title">
    <div slot="widget-content">
      <v-layout row wrap>   
        <v-flex xl12 pa-0>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
              flat
              solo
              prepend-icon="search"
              placeholder="Filtering"
              v-model="searchFilter"
              hide-details
              class="hidden-sm-and-down"
              ></v-text-field>             
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="testData.headers"
                :pagination.sync="testData.pagination"
                :search="searchFilter"
                :items="testDataContent"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                item-key="recttime"
                >
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.recttime.replace('T', ' ').split('.')[0] }}</td>
                    <td>{{ props.item.sernum }}</td>
                    <td>{{ props.item.uuttype }}</td>
                    <td>{{ props.item.area }}</td>
                    <td>{{ props.item.mode }}</td>
                    <td>{{ props.item.result }}</td>
                    <td>{{ props.item.test }}</td>
                    <td>{{ props.item.tottime }}</td>
                    <td>{{ props.item.machine }}</td>
                    <td>{{ props.item.container }}</td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card>
                      <v-card-text>
                        <v-container grid-list-xl fluid>
                          <v-layout row wrap>
                            <v-flex lg2 sm6 xs6>
                              <v-list>PartNum: {{ props.item.partnum }}</v-list>
                              <v-list>PartNum Rev: {{ props.item.partnumrev }}</v-list>
                              <v-list>TAN: {{ props.item.tannum }}</v-list>
                              <v-list>TAN Rev: {{ props.item.tannumrev }}</v-list>
                              <v-list>PID: {{ props.item.pid }}</v-list>
                              <v-list>VID: {{ props.item.vid }}</v-list>
                              <v-list>Username: {{ props.item.username }}</v-list>
                              <v-list>Parent: <a @click="clickSerialNumber(props.item.parentsernum)">{{ props.item.parentsernum }}</a></v-list>
                            </v-flex>
                            <v-flex lg2 sm6 xs6>
                              <v-list>Order: {{ props.item.order }}</v-list>
                              <v-list>LineID: {{ props.item.lineid }}</v-list>
                              <v-list>BlackFlush: {{ props.item.bflush }}</v-list>
                              <v-list>BitMap: {{ props.item.bitmap }}</v-list>
                            </v-flex>
                            <v-flex lg3 sm6 xs6>
                              <v-list>SW Rev: {{ props.item.swrev }}</v-list>
                              <v-list>Diag Rev: {{ props.item.diagrev }}</v-list>
                              <v-list>HW Rev: {{ props.item.hwrev }}</v-list>
                              <v-list>Deviation: {{ props.item.deviation }}</v-list>
                              <v-list>Label: {{ props.item.label }}</v-list>
                              <v-list>License: {{ props.item.license }}</v-list>
                            </v-flex>
                            <v-flex lg2 sm6 xs6>
                              <v-list>Str1Name: {{ props.item.str1name }}</v-list>
                              <v-list>Str2Name: {{ props.item.str2name }}</v-list>
                              <v-list>Str3Name: {{ props.item.str3name }}</v-list>
                              <v-list>Str4Name: {{ props.item.str4name }}</v-list>
                              <v-list>Str5Name: {{ props.item.str5name }}</v-list>
                              <v-list>Str6Name: {{ props.item.str6name }}</v-list>
                            </v-flex>
                            <v-flex lg3 sm6 xs6>
                              <v-list>Str1: {{ props.item.str1 }}</v-list>
                              <v-list>Str2: {{ props.item.str2 }}</v-list>
                              <v-list>Str3: {{ props.item.str3 }}</v-list>
                              <v-list>Str4: {{ props.item.str4 }}</v-list>
                              <v-list>Str5: {{ props.item.str5 }}</v-list>
                              <v-list>Str6: {{ props.item.str6 }}</v-list>
                            </v-flex>
                            <v-flex lg12 sm12 xs12 v-show="props.item.result !== 'S'">
                              <h5><v-icon>contact_phone</v-icon> <a @click="getTestLog(props.item)">Test Log TimeStamp: {{ props.item.testtime }}</a></h5>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                  </v-card>
                </template>
              </v-data-table>
              <json-to-excel :jsonData="testDataSource"></json-to-excel>
            </v-card-text>
            <!-- Test Log List dialogs -->
            <v-layout row justify-center>
              <v-dialog v-model="openDialogs" persistent max-width="800">
                <v-card>
                  <v-card-title class="headline">{{ sernum }}: {{ message }}</v-card-title>
                  <v-card-text>
                    <h5 v-for="log of testLogs" :key="log.name">
                      <a :href="log.url" target="_blank">{{ log.name }} ({{log.size}})</a>
                    </h5>
                    </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="openDialogs = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-layout>
          </v-card>
        </v-flex>             
      </v-layout>
    </div>
  </v-widget>
</template>

<script>
import VWidget from '@/components/VWidget';
import JsonToExcel from '../components/JsonToExcel';
import { getTestLogList } from '../api/getTestLog';
import store from '../../vision/store';

export default {
  components: {
    VWidget,
    JsonToExcel,
    store,
  },
  props: ['search', 'title', 'testDataSource'],
  data () {
    return {
      sernum: '',
      message: '',
      openDialogs: false,
      testLogs: [],
      testData: {
        pagination: {
          descending: true,
        },
        headers: [
          {
            text: 'Record Time',
            value: 'recttime',
          },
          {
            text: 'Serial Number',
            value: 'sernum'
          },
          {
            text: 'UUT Type',
            value: 'uuttype'
          },
          {
            text: 'Area',
            value: 'area'
          },
          {
            text: 'Mode',
            value: 'mode'
          },
          {
            text: 'Result',
            value: 'result'
          },
          {
            text: 'Fail Name',
            value: 'test'
          },
          {
            text: 'Test Time',
            value: 'tottime'
          },
          {
            text: 'Machine',
            value: 'machine'
          },
          {
            text: 'Container',
            value: 'container'
          },
        ],
        content: []
      },
    };
  },
  computed: {
    testDataContent () {
      return this.testDataSource || [];
    },
    searchFilter () {
      return this.search;
    }
  },
  watch: {
  },   
  methods: {
    getTestLog (data) {
      const time_stamp = data.testtime;
      const machine = data.machine;
      const container = data.container;
      this.sernum = data.sernum;
      // console.log(time_stamp);
      // console.log(machine);
      // console.log(container);
      this.testLogs = [];
      getTestLogList(time_stamp, machine, container)
        .then(response => {
          // console.log(response.data);
          this.openDialogs = true;
          if (response.data['status']) {
            this.message = response.data['payload']['message'];
            this.testLogs = response.data['payload']['data'];
            // console.log(this.testLogs);
          }
          else {
            this.message = response.data['payload']['message'];
          }
        })
        .catch(e => {
          console.log(e);
          this.message = 'Service Error, Please Contact Genius Team.';
        });
    },
    clickSerialNumber (sernum) {
      this.$router.push('/vision/basic');
      store.commit('changeSernum', sernum.replace(' ', ''));
    }
  }
};
</script>

<style lang='stylus' scoped>
</style>