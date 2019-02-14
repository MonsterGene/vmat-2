import axios from 'axios';

function getAPI (sernum) {
  return axios.post('http://10.132.45.164:8000/get-record-by-sernum/', { 'sernum': sernum, 'database': '10.167.6.165' });
}

export {
  getAPI
};