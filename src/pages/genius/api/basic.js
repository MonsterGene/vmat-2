function getIpAddress () {
  let hostname = window.location.hash.split('=')[1];
  if (!hostname) { 
    hostname = window.location.hostname;
  }
  // console.log(hostname);
  // hostname = '10.167.5.253';
  hostname = '10.167.219.247';
  // hostname = '10.167.16.51';
  return hostname + ':8000';
}

export {
  getIpAddress
};
