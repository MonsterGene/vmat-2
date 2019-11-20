function getIpAddress () {
  let hostname = window.location.hash.split('=')[1];
  if (!hostname) { 
    hostname = window.location.hostname;
  }
  // console.log(hostname);
  hostname = '10.167.219.247';
  // hostname = '10.167.219.100';
  // hostname = '10.167.16.57';
  return 'http://' + hostname + ':8000';
  // return 'https://' + hostname + ':8000/api';
}

export {
  getIpAddress
};
