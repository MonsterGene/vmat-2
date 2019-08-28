import axios from 'axios';
import { getIpAddress } from './basic';

function getStyle () {
  const ipAddress = getIpAddress();
  return axios.get('http://' + ipAddress + '/get-container-style/');
}

function setStyle (username, style) {
  const ipAddress = getIpAddress();
  return axios.post('http://' + ipAddress + '/set-container-style/', { 'username': username, 'style': style });
}

function lockContainer (username, container_name) {
  const ipAddress = getIpAddress();
  return axios.post('https://' + ipAddress + '/lock-container/', { 'username': username, 'container_name': container_name });
}

function unlockContainer (username, container_name) {
  const ipAddress = getIpAddress();
  return axios.post('https://' + ipAddress + '/unlock-container/', { 'username': username, 'container_name': container_name });
}

export {
  getStyle,
  setStyle,
  lockContainer,
  unlockContainer,
};
