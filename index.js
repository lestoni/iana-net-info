/**
 * Load Module Dependencies.
 */
var async     = require('async');
var _         = require('lodash');

var protocols = require('./data/protocols');
var services   = require('./data/services');

exports.protocol = function get(keyword) {

  var query = { keyword: keyword };

  return _.filter(protocols, query);

};

exports.service = function get(serviceName) {

  var query = { service_name: serviceName };

  return _.filter(services, query);

};
