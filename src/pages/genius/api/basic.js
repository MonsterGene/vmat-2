function getIpAddress () {
  let hostname = window.location.hash.split('=')[1];
  if (!hostname) { 
    hostname = window.location.hostname;
  }
  // console.log(hostname);
  // hostname = '10.167.219.247';
  // hostname = '10.167.219.54';
  // hostname = '10.167.16.49';
  return hostname + ':8000';
}

export {
  getIpAddress
};
