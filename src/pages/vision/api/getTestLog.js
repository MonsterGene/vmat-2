import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getTestLogList (time_stamp, machine, container) {
  const ipAddress = getIpAddress();
  return axios.get(ipAddress + '/get-test-log-list/?time_stamp=' + time_stamp + '&machine=' + machine + '&container=' + container + '&host=' + ipAddress.split(':')[1].split('//')[1]);
}

export {
  getTestLogList
};