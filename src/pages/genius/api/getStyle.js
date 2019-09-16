import axios from 'axios';
import { getIpAddress } from './basic';

function getStyle () {
  const ipAddress = getIpAddress();
  return axios.get(ipAddress + '/get-container-style/');
}

function setStyle (username, style) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/set-container-style/', { 'username': username, 'style': style });
}

function lockContainer (username, container_name) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/lock-container/', { 'username': username, 'container_name': container_name });
}

function unlockContainer (username, container_name) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/unlock-container/', { 'username': username, 'container_name': container_name });
}

export {
  getStyle,
  setStyle,
  lockContainer,
  unlockContainer,
};
