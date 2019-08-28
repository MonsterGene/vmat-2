import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getGenealogy (sernum) {
  // const hostname = window.location.hostname;
  const ipAddress = getIpAddress();
  return axios.get('https://' + ipAddress + '/get-parent-children/?parent_serial_number=' + sernum);
}

export {
  getGenealogy
};