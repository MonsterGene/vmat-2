import axios from 'axios';
import { getIpAddress } from './basic';

function getProdVersion () {
  const ipAddress = getIpAddress();
  return axios.get(ipAddress + '/get-prod-version/?format=json');
}

export {
  getProdVersion
};
