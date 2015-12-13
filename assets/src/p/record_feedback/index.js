// 加载Global
require('../../c/global/global.js');

var Feedback = {

  init: function() {

    this.param = {

      feedback: null
    };

    this.isFirst = true;

    this.getData(this.param, 1);

    this.bindEvent();
  },

  bindEvent: function() {

    var self = this;

    $('.J_Content').delegate('.J_FeedbackCoin', 'click', function(e) {

      var target = $(e.target);

      self.id = target.data('id');

      $('#J_Modal').modal({});
    });

    $('.J_Save').bind('click', $.proxy(this.save, this));
  },

  getData: function(param, cPage) {

    var self = this;

    $.ajax({
      url: '/record/list',
      data: {
        param: JSON.stringify(param),
        cPage: cPage,
        pageSize: 12
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
                      '<td><span class="fa fa-edit feedback J_FeedbackCoin" data-id="' + item._id + '"></span></td>' +
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

  save: function(e) {

    var param = {

      id: this.id,
      feedback: $('#J_Modal #J_Feedback').val(),
      duty: $('#J_Modal #J_Watcher').val(),
      report: $('#J_Modal #J_Report').val(),
      replay: $('#J_Modal #J_Replay').val()
    };

    $.ajax({

        type: 'POST',
        url: '/record/feedback',
        data: param,
        success: function(data) {

            if(data.status !== 1) {

                Global.alert(data.message);
                return;
            }

            location.reload();
        },
        error: function(error) {

            Global.alert(error.message);
        }
    });
  }
};

Feedback.init();

module.exports = Feedback;
