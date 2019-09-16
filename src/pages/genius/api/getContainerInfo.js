import axios from 'axios';
import { getIpAddress } from './basic';

function getContainerInfo (container) {
  const ipAddress = getIpAddress();
  return axios.get(ipAddress + '/get-container-info/?container=' + container);
}

export {
  getContainerInfo
};
