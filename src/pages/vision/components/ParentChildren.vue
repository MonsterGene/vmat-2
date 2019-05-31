<template>
  <v-widget :title="title">
    <div slot="widget-content">
      <v-layout row wrap>   
        <v-flex xl12>
          
          <v-data-table
            :headers="testData.headers"
            :pagination.sync="testData.pagination"
            :items="genealogyInfo"
            :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
            class="elevation-1"
            item-key="updated_at"
          >
            <template slot="items" slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.updated_at.replace('T', ' ') }}</td>
                <td>{{ props.item.created_at.replace('T', ' ') }}</td>
                <td>{{ props.item.parent_serial_number }}</td>
                <td>{{ props.item.parent_uut_type }}</td>
                <td><a @click="clickSerialNumber(props.item.child_serial_number)">{{ props.item.child_serial_number }}</a></td>
                <td>{{ props.item.child_uut_type }}</td>
                <td>{{ props.item.machine }}</td>
                <td>{{ props.item.container }}</td>
              </tr>
            </template>
          </v-data-table>

        </v-flex>             
      </v-layout>
    </div>
  </v-widget>
</template>

<script>
import VWidget from '@/components/VWidget';
import store from '../../vision/store';

export default {
  components: {
    VWidget,
    store,
  },
  props: ['genealogyInfo', 'title'],
  data () {
    return {
      testData: {
        pagination: {
          descending: true,
        },
        headers: [
          {
            text: 'Updated At',
            value: 'updated_at'
          },
          {
            text: 'Created At',
            value: 'created_at',
          },
          {
            text: 'Parent Serial Number',
            value: 'parent_serial_number'
          },
          {
            text: 'Parent UUTTYPE',
            value: 'parent_uut_type'
          },
          {
            text: 'Child Serial Number',
            value: 'child_serial_number'
          },
          {
            text: 'Child UUTTYPE',
            value: 'child_uut_type'
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
  methods: {
    clickSerialNumber (sernum) {
      this.$router.push('/vision/basic');
      store.commit('changeSernum', sernum.replace(' ', ''));
    },
  }
};
</script>

<style lang='stylus' scoped>
</style>