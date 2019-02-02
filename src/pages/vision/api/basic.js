import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getBasic (sernum) {
  const hostname = window.location.hostname;
  const ipAddress = getIpAddress();
  if (hostname.includes('localhost')) {
    return axios.post('http://' + ipAddress + '/get-record-by-sernum/', { 'sernum': sernum, 'database': '192.168.200.214' });  // DEBUG USE
  }
  // return axios.post('http://10.132.45.164:8000/get-record-by-sernum/', { 'sernum': sernum, 'database': '10.167.6.165' });  // fortinet
  return axios.post('http://' + ipAddress + '/get-record-by-sernum/', { 'sernum': sernum, 'database': '192.168.200.214' });  // Cisco
}

export {
  getBasic
};