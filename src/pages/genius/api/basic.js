function getIpAddress () {
  let hostname = window.location.hash.split('=')[1];
  if (!hostname) { 
    hostname = window.location.hostname;
  }
  // console.log(hostname);
  hostname = '10.167.219.250';
  // hostname = '10.167.219.28';
  // hostname = '10.167.16.49';
  return 'http://' + hostname + ':8000/vision';
}

export {
  getIpAddress
};
