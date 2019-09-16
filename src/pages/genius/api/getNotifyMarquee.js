import axios from 'axios';
import { getIpAddress } from './basic';

function getNotifyMarquee () {
  const ipAddress = getIpAddress();
  return axios.get(ipAddress + '/get-notification/');
}

function setNotifyMarquee (username, notify) {
  const ipAddress = getIpAddress();
  return axios.post(ipAddress + '/set-notification/', { 'notification': notify });
}

function getHistory () {
  const ipAddress = getIpAddress();
  return axios.get(ipAddress + '/get-history/');
}

export {
  getNotifyMarquee,
  setNotifyMarquee,
  getHistory,
};
