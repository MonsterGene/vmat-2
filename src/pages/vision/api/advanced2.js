import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getDataSummary (params) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/get-data-summary/',
    { 'data_type': params.data_type, 'start_date': params.start_date, 'end_date': params.end_date, 'uuttype': params.uuttype, 'sernum': params.sernum, 'area': params.area, 'machine': params.machine, 'mode': params.mode, 'result': params.result, 'test': params.test });

}


function getDataDetails (time_stamp, date_stamp, data_type) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/get-data-details/',
    { 'time_stamp': time_stamp, 'date_stamp': date_stamp, 'data_type': data_type });
}

function getDataExcel (time_stamp, data_type) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/get-data-excel/',
    { 'time_stamp': time_stamp, 'data_type': data_type });
}


export {
  getDataSummary,
  getDataDetails,
  getDataExcel,
};