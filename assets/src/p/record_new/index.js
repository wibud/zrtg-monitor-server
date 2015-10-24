// 加载Global
require('../../c/global/global.js');

var Resource = {

  init: function() {

    this.initDatepicker();

    this.initTimepicker();

    this.initSeletor();
  },

  initDatepicker: function() {

    $('#J_Datefield').datepicker({
      autoclose: true,
      language: 'zh-CN',
      endDate: '0d',
      todayBtn: 'linked',
      todayHighlight: true
    });
  },

  initTimepicker: function() {

    $('#J_Timefield').timepicker({

      showSeconds: true,
      // showInputs: false,
      showMeridian: false,
      minuteStep: 1,
      secondStep: 1
    });
  },

  initSeletor: function() {

    $('#J_Dept').select2();
    $('#J_Class').select2();
    $('#J_Finder').select2();
  }
};

Resource.init();

module.exports = Resource;
