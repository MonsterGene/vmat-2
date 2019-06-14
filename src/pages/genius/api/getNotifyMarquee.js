import axios from 'axios';
import { getIpAddress } from './basic';

function getNotifyMarquee () {
  const ipAddress = getIpAddress();
  return axios.get('http://' + ipAddress + '/get-notification/');
}

function setNotifyMarquee (username, notify) {
  const ipAddress = getIpAddress();
  return axios.post('http://' + ipAddress + '/set-notification/', { 'notification': notify });
}

function getHistory () {
  const ipAddress = getIpAddress();
  return axios.get('http://' + ipAddress + '/get-history/');
}

export {
  getNotifyMarquee,
  setNotifyMarquee,
  getHistory,
};
