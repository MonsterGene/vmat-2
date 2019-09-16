import axios from 'axios';
import { getIpAddress } from './basic';

function getCurrentLog (connection_name, host) {
  const ipAddress = getIpAddress();
  return axios.get(ipAddress + '/get-current-log/?connection=' + connection_name + '&host=' + ipAddress.split(':')[1].split('//')[1]);
}

export {
  getCurrentLog
};
