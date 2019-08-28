import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getTestLogList (time_stamp, machine, container) {
  const ipAddress = getIpAddress();
  return axios.get('https://' + ipAddress + '/get-test-log-list/?time_stamp=' + time_stamp + '&machine=' + machine + '&container=' + container + '&host=' + ipAddress.split(':')[0]);
}

export {
  getTestLogList
};