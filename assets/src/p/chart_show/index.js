// 加载Global
require('../../c/global/global.js');

var Chart = {

  init: function() {

    this.initDatepicker();

    this.initSeletor();

    this.getCharts();

    this.bindEvent();
  },

  initDatepicker: function() {

    moment.locale('zh-cn');

    var date = Global.getUrlParam('date');

    var dateValue = date ? date : moment().subtract(29, 'days').format('YYYY年MM月DD日') + ' - ' + moment().format('YYYY年MM月DD日');

    $('#J_Datefield').val(dateValue);

    $('#J_Datefield').daterangepicker({
      // startDate: moment().subtract(29, 'days'),
      // endDate: moment(),
      maxDate: moment(),
      opens: 'right',
      timePicker: false,
      timePickerIncrement: 10,
      format: 'YYYY年MM月DD日',
      timePicker24Hour: true,
      ranges: {
        '今天': [moment(), moment()],
        '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        '最近7日': [moment().subtract(6, 'days'), moment()],
        '最近30日': [moment().subtract(29, 'days'), moment()],
        '本月': [moment().startOf('month'), moment().endOf('month')],
        '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    });
  },

  initSeletor: function() {

    var channel = Global.getUrlParam('channel');

    if(channel) $('#J_Channel').val(channel);

    $('#J_Channel').select2();
  },

  bindEvent: function() {

    $('#J_Search').click($.proxy(this.search, this));
  },

  search: function() {

    var date = $('#J_Datefield').val();
    var channel = $('#J_Channel').val();

    location.replace('?date=' + encodeURIComponent(date) + '&channel=' + encodeURIComponent(channel));
  },

  getCharts: function() {

    var self = this;
    var date = $('#J_Datefield').val();
    var channel = $('#J_Channel').val();
    var param = {};
    var date1;
    var date2;

    if(date && date != '无') {

      datetimes = date.split(' - ');
      date1 = datetimes[0];
      date2 = datetimes[1];

      param.date = {
        $gte: date1,
        $lte: date2
      };
    }

    if(channel && channel != '全部') param.channel = channel;

    $.ajax({
      url: '/chart/get',
      data: {
        param: JSON.stringify(param)
      },
      dataType: 'json',
      success: function(res) {

        if (res.status !== 1) {

          Global.alert(res.message);

        } else {

          self.data = res.data;

          self.chart();
        }
      },
      error: function(err) {
        Global.alert(err.message);
      }
    });
  },

  chart: function() {

    // 错误折线图
    if(this.data.lineData.length > 0) {

      this.lineChart = new Morris.Line({
          element: 'J_Line',
          resize: true,
          data: this.data.lineData,
          xkey: 'date',
          ykeys: this.data.labels,
          labels: this.data.labels,
          lineColors: ["#3c8dbc", "#f56954", "#00a65a"],
          hideHover: 'auto'
        });
    }

    // 隐患瑕疵比，饼图
    if(this.data.totalRatio.length > 0) {

      this.totalRatioChart = new Morris.Donut({
        element: 'J_TotleRatio',
        resize: true,
        colors: ["#3c8dbc", "#f56954", "#00a65a"],
        data: this.data.totalRatio,
        hideHover: 'auto'
      });
    }
  }
};

Chart.init();

module.exports = Chart;
