import axios from 'axios';
import { getIpAddress } from './getIpAddress';

function getTestLogList (time_stamp, machine, container) {
  // const hostname = window.location.hostname;
  // const ipAddress = getIpAddress();
  return axios.get('http://10.167.219.252:8000/genius/get-test-log/?time_stamp=' + time_stamp + '&machine=' + machine + '&container=' + container);
}

export {
  getTestLogList
};