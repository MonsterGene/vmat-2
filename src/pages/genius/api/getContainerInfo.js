import axios from 'axios';
import { getIpAddress } from './basic';

function getContainerInfo (container) {
  const ipAddress = getIpAddress();
  return axios.get('http://' + ipAddress + '/get-container-info/?container=' + container);
}

export {
  getContainerInfo
};
