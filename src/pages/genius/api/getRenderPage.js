import axios from 'axios';
import { getIpAddress } from './basic';

function getStationPage () {
  const ipAddress = getIpAddress();
  return axios.get('https://' + ipAddress + '/get-station-page/');
}

function getContainerPage (station_name) {
  const ipAddress = getIpAddress();
  return axios.get('https://' + ipAddress + '/get-container-page/?station_name=' + station_name);
}

export {
  getStationPage,
  getContainerPage
};
