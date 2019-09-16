import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getBasic (sernum) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/get-record-by-sernum/', { 'sernum': sernum, 'database': '192.168.200.214' });  // Cisco
}

export {
  getBasic
};