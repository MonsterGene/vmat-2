import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getAdvanced (params) {
  const hostname = window.location.hostname;
  const ipAddress = getIpAddress();
  if (hostname.includes('localhost')) {
    return axios.post('http://' + ipAddress + '/get_yield_throughput/',
      { 'data_type': params.data_type, 'start_date': params.start_date, 'end_date': params.end_date, 'uuttype': params.uuttype, 'sernum': params.sernum, 'area': params.area, 'machine': params.machine, 'mode': params.mode, 'result': params.result, 'test': params.test, 'database': '192.168.200.214' });
  }

  return axios.post('http://' + ipAddress + '/get_yield_throughput/',
    { 'data_type': params.data_type, 'start_date': params.start_date, 'end_date': params.end_date, 'uuttype': params.uuttype, 'sernum': params.sernum, 'area': params.area, 'machine': params.machine, 'mode': params.mode, 'result': params.result, 'test': params.test, 'database': '192.168.200.214' });

}


function getAnalysis (params) {
  const hostname = window.location.hostname;
  const ipAddress = getIpAddress();
  if (hostname.includes('localhost')) {
    return axios.post('http://' + ipAddress + '/get-failure-analysis/',
      { 'data_type': params.data_type, 'start_date': params.start_date, 'end_date': params.end_date, 'uuttype': params.uuttype, 'sernum': params.sernum, 'area': params.area, 'machine': params.machine, 'mode': params.mode, 'result': params.result, 'test': params.test, 'database': '192.168.200.214' });
  }

  return axios.post('http://' + ipAddress + '/get-failure-analysis/',
    { 'data_type': params.data_type, 'start_date': params.start_date, 'end_date': params.end_date, 'uuttype': params.uuttype, 'sernum': params.sernum, 'area': params.area, 'machine': params.machine, 'mode': params.mode, 'result': params.result, 'test': params.test, 'database': '192.168.200.214' });
}

export {
  getAdvanced,
  getAnalysis
};