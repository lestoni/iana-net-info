# iana-net-info

Get [IANA](iana.org) net info on [protocol numbers](http://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml)
and [service names](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml).

## Install

```sh
  $ npm install iana-net-info --save
```

## Usage

```javascript
  var ianaNetInfo = require('iana-net-info');

  // Example: Search info on HTTP service name
  var serviceInfoArr = ianaNetInfo.service('http');

  // Example: Search info on udp protocol
  var protocoInfoArr = ianaNetInfo.protocol('udp');
```

## API

## ianaNetInfo.service(serviceName)

__serviceName__

Type: __String__

Returns an array of objects contain info on the service name.

## ianaNetInfo.protocol(keyword)

__keyword__

Type: __String__

Returns an array of objects contain info on the protocol keyword.

## License

MIT.
