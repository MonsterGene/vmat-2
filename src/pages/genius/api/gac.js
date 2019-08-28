import axios from 'axios';
import { getIpAddress } from './basic';


function validateUsernameApi (username) {
  const ipAddress = getIpAddress();
  return axios.post('https://' + ipAddress + '/validate-gac-username/', 
    { 'username': username },
  );
}

function validatePasswordApi (username, password) {
  const ipAddress = getIpAddress();
  return axios.post('https://' + ipAddress + '/get-gac-authentication2/', 
    { 'username': username, 'password': password },
  );
}

export {
  validateUsernameApi,
  validatePasswordApi,
};
