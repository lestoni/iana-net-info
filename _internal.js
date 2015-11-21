/**
 * Load Module Dependencies.
 */
var path    = require('path');
var exec    = require('child_process').exec;
var fs      = require('fs');

var parse   = require('csv-parse');
var request = require('request');
var mkdirp  = require('mkdirp');
var async   = require('async');
var transform = require('stream-transform');

var DATA_DIR = path.join(__dirname, '../data');
var URLS = {
  protocol_numbers: 'https://www.iana.org/assignments/protocol-numbers/protocol-numbers-1.csv',
  service_ports: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.csv'
};

async.series([
  cleanUp,
  createDataDir,
  storeProtocolData,
  storeServicesData,
], function complete(err) {
  if(err) {
    return console.error(err);
  }

  console.log('Complete');
});

/**
 * Remove current IANA JSON data.
 */
function cleanUp(done) {
  var command = 'rm -rf ' + DATA_DIR;

  exec(command, done);
}

/**
 * Create IANA JSON data directory.
 */
function createDataDir(done) {
  mkdirp(DATA_DIR, done);
}

/**
 * Retrieve Protocol Number CSV, parse it and store
 */
function storeProtocolData(done) {
  var opts = {
    uri: URLS.protocol_numbers,
    method: 'GET'
  };
  var parser      = parse({ delimiter: ',', trim: true });
  var filename   = DATA_DIR + '/protocols.json';
  var cache = [];
  var transformer = transform(function (record, callback) {
    var item;

    if(record[0] === 'Decimal') {
      return callback(null);
    } else {
      item = {
        keyword: record[1].toLowerCase(),
        protocol: record[2],
        ipv6_extention_header: record[3]
      };
      cache.push(item);
      callback(null);
      return;
    }
  }, { parallel: 10 });

  request(opts)
    .pipe(parser)
    .pipe(transformer);

  transformer.on('finish', function write() {
    try {
      fs.writeFileSync(filename, JSON.stringify(cache));
      done(null);
    } catch(ex) {
      done(ex);
    }
  });
}

/**
 * Retrieve Service Names and Ports CSV, parse it and store
 */
function storeServicesData(done) {
  var opts = {
    uri: URLS.service_ports,
    method: 'GET'
  };
  var parser      = parse({ delimiter: ',', trim: true });
  var filename    = DATA_DIR + '/services.json';
  var cache       = [];
  var transformer = transform(function (record, callback) {
    var item;

    if(record[0] === 'Service Name') {
      return callback(null);
    } else {
      item = {
        service_name: record[0],
        port_number: record[1],
        transport_protocol: record[2],
        description: record[3]
      };
      cache.push(item);
      return callback(null);
    }
  }, { parallel: 10 });

  request(opts)
    .pipe(parser)
    .pipe(transformer);

  transformer.on('finish', function write() {
    try {
      fs.writeFileSync(filename, JSON.stringify(cache));
      done(null);
    } catch(ex) {
      done(ex);
    }
  });
}
