/**
 * 报表统计
 */

'use strict';

var helper = require('../lib/helper');
var log = helper.getLogger('record');
var Record = require('../models/record');
var Resource = require('../models/resource');
var _ = helper._;

exports.show = function* () {

  try {

    var channels = yield Resource.find({type: 'channel'});

    var result = [];

    if(_.isArray(channels) && channels.length > 0 && channels[0].list) {

      result = channels[0].list;
    }

    yield this.render('chart_show', {
      page: 'chart_show',
      channels: result
    });
  } catch(err) {

    yield helper.handleError(this, err);
  };
};

exports.get = function* () {

  try {

    var param = JSON.parse(this.query.param);

    // 获取错误资源
    var errors = yield Resource.find({type: 'error'});
    var _errors = _.isArray(errors) && errors.length > 0 && errors[0].list ? errors[0].list : [];

    var result = {

      lineData: [],
      totalRatio: [],
      labels: []
    };

    var _item;
    var _param;
    var item;
    var list;
    var _lineData = {};

    for (var i = _errors.length - 1; i >= 0; i--) {

      item = _errors[i];

      // 瑕疵隐患
      _item = {};
      _param = {};

      if(!item.name) return true;

      result.labels.push(item.name);

      _item.label = item.name;

      _.assign(_param, param, {

        event: item.name
      });

      _item.value = yield Record.count(_param);

      result.totalRatio.push(_item);

      // 错误折线图
      list = yield Record.countGroupByDate(_param);

      list.forEach(function(spot) {

        if(!_lineData[spot.date]) {

          _lineData[spot.date] = {date: spot.date.replace('年', '-').replace('月', '-').replace('日', '')};
        }

        _lineData[spot.date][item.name] = spot.count;
      });
    };

    var _data;

    for(var key in _lineData) {

      _data = _lineData[key];

      _errors.forEach(function(e) {

        if(!_data[e.name]) _data[e.name] = 0;
      });

      result.lineData.push(_data);
    }

    this.body = {

      status: 1,
      data: result
    };

  } catch(err) {

    yield helper.handleError(this, err, 'json');
  }
};
