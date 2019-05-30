import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getTestLogList (time_stamp, machine, container) {
  // const hostname = window.location.hostname;
  const ipAddress = getIpAddress();
  return axios.get('http://' + ipAddress + '/get-test-log-list/?time_stamp=' + time_stamp + '&machine=' + machine + '&container=' + container);
}

export {
  getTestLogList
};