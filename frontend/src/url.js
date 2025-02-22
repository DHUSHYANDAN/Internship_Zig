// export const baseurl = "http://10.10.192.3:5000"





const protocol = window.location.protocol;
const hostname = window.location.hostname;
const protocolAndHostname = protocol + "//" + hostname;

export const baseurl = `${protocolAndHostname}:5000`

