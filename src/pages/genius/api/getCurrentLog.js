import axios from 'axios';
import { getIpAddress } from './basic';

function getCurrentLog (connection_name, host) {
  const ipAddress = getIpAddress();
  return axios.get('https://' + ipAddress + '/get-current-log/?connection=' + connection_name + '&host=' + ipAddress.split(':')[0]);
}

export {
  getCurrentLog
};
