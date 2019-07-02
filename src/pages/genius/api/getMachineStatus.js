import axios from 'axios';
import { getIpAddress } from './basic';

function getMachineStatus () {
  const ipAddress = getIpAddress();
  return axios.get('http://' + ipAddress + '/get-machine-status/?format=json');
}

export {
  getMachineStatus,
};
