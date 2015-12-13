// 加载Global
require('../../c/global/global.js');

var Home = {

  init: function() {

    this.param = {};

    this.isFirst = true;

    this.getData({}, 1);

    this.getCharts();
  },

  getData: function(param, cPage) {

    var self = this;

    $.ajax({
      url: '/record/list',
      data: {
        param: JSON.stringify(param),
        cPage: cPage,
        pageSize: 10
        // pageSize: 1
      },
      dataType: 'json',
      success: function(res) {

        if (res.status !== 1) {

          Global.alert(res.message);

        } else {

          self.render(res);
        }

      },
      error: function(err) {
        Global.alert(err.message);
      }
    });
  },

  render: function(data) {

    var list = data.list;
    var domString = '';

    $.each(list, function(index, item) {

      domString += '<tr>' +
                      '<td>' + item.dept + '</td>' +
                      '<td>' + item.finder + '</td>' +
                      '<td>' + item.clas + '</td>' +
                      '<td>' + item.date + '</td>' +
                      '<td>' + item.time + '</td>' +
                      '<td>' + item.channel + '</td>' +
                      '<td>' + item.program + '</td>' +
                      '<td>' + item.section + '</td>' +
                      '<td>' + item.event + '</td>' +
                      '<td>' + item.error + '</td>' +
                      '<td>' + item.question + '</td>' +
                      '<td><span class="desc-tip" data-toggle="tooltip" title="' + item.desc + '">' + (item.desc.length > 5 ? item.desc.slice(0, 5) + '...' : item.desc) + '</span></td>' +
                      '<td>' + item.playtime + '</td>' +
                      '<td>' + item.duration + '</td>' +
                      (
                        item.feedback ?
                          '<td><span class="fa fa-eye feedback" data-toggle="tooltip" data-html="true" title="<p>技术反馈：' + item.feedback + '</p><p>技术值班：' + item.duty + '</p><p>上报：' + item.report + '</p><p>重播：' + item.replay + '</p>"></span></td>' :
                          '<td><span class="fa fa-eye-slash feedback" data-toggle="tooltip" data-html="true" title="<p>还没有反馈</p>"></span></td>'
                      ) +
                    '</tr>'

    });

    $('#J_TableBody').html(domString);

    $('.J_TotalPage').html('第' + data.cPage + '页（共' + data.totalPage + '页）');

    this.setPaginator(data.cPage, data.totalPage);
  },

  setPaginator: function(currentPage, totalPages) {

    var self = this;
    var options = {

      currentPage: currentPage,
      totalPages: totalPages,
      numberOfPages: 5
    };

    if(this.isFirst) {

      options.onPageChanged = function(e, oldPage, newPage) {

        self.getData(self.param, newPage);
      };

      this.isFirst = false;
    }

    $('#pagination').bootstrapPaginator(options);
  },

  getCharts: function() {

    var self = this;
    var date = moment().subtract(29, 'days').format('YYYY年MM月DD日') + ' - ' + moment().format('YYYY年MM月DD日');
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
  }
};

Home.init();

module.exports = Home;
