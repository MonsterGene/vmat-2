import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getAdvanced (params) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/get_yield_throughput/',
    { 'data_type': params.data_type, 'start_date': params.start_date, 'end_date': params.end_date, 'uuttype': params.uuttype, 'sernum': params.sernum, 'area': params.area, 'machine': params.machine, 'mode': params.mode, 'result': params.result, 'test': params.test, 'database': '192.168.200.214' });

}


function getAnalysis (params) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/get-failure-analysis/',
    { 'data_type': params.data_type, 'start_date': params.start_date, 'end_date': params.end_date, 'uuttype': params.uuttype, 'sernum': params.sernum, 'area': params.area, 'machine': params.machine, 'mode': params.mode, 'result': params.result, 'test': params.test, 'database': '192.168.200.214' });
}

export {
  getAdvanced,
  getAnalysis
};