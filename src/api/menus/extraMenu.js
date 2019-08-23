let hostname = window.location.hash.split('=')[1];
if (!hostname) { 
  hostname = window.location.hostname;
}

export default [
  {
    title: 'Local Logs',
    icon: 'view_compact',
    target: '_blank',
    href: 'http://' + hostname + '/logs',
  },
  {
    title: 'Local Config',
    icon: 'view_compact',
    target: '_blank',
    href: 'http://' + hostname + '/config',
  },
  {
    title: 'Local Prod Code',
    icon: 'view_compact',
    target: '_blank',
    href: 'http://' + hostname + '/prod',
  },
  {
    title: 'Local te Code',
    icon: 'view_compact',
    target: '_blank',
    href: 'http://' + hostname + '/te',
  },
  {
    title: 'Git Lab',
    icon: 'filter_vintage',
    target: '_blank',
    href: 'http://10.132.45.143',
  }
];