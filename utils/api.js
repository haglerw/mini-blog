const resourceRequest = ({
  url,
  method = 'GET',
  data = {},
  success,
  fail,
  complete
}) => {
  let options = {
    url,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    method,
    dataType: 'json',
    success,
    fail,
    complete
  };

  if (method !== 'GET' && data) {
    options.data = typeof data === 'string' ? data : JSON.stringify(data);
  }

  my.request(options);
}

export default resourceRequest;