// 加载Global
require('../../c/global/global.js');

var Record = {

  param: {},

  init: function() {

    this.param = {};

    this.isFirst = true;

    this.getData({}, 1);

    this.initDatepicker();

    this.initSeletor();

    this.bindEvent();

    this.changeSelector('#J_Finder', GlobalData.users[$('#J_Dept').val()]);

    var selectIndex = $('#J_Event')[0].selectedIndex;
    this.changeSelector('#J_Error', GlobalData.errors[selectIndex].children);
  },

  bindEvent: function() {

    var self = this;

    $('#J_Dept').change(function() {

      self.changeSelector('#J_Finder', GlobalData.users[$('#J_Dept').val()]);
    });

    $('#J_Event').change(function() {

      var selectIndex = $('#J_Event')[0].selectedIndex;
      self.changeSelector('#J_Error', GlobalData.errors[selectIndex].children);
    });

    $('#J_Error').change(function() {

      var eventIndex = $('#J_Event')[0].selectedIndex;
      var errorIndex = $('#J_Error')[0].selectedIndex;
      self.changeSelector('#J_Question', GlobalData.errors[eventIndex].children[errorIndex].children);
    });

    $('#J_Reset').click($.proxy(this.reset, this));

    $('#J_Search').click($.proxy(this.search, this));

    $('#J_Export').click($.proxy(this.export, this));
  },

  export: function() {

    var type = $('#optionsRadios1').is(':checked') ? 0 : 1;

    $.ajax({
      url: '/record/export',
      data: {
        param: JSON.stringify(this.param)
      },
      dataType: 'json',
      success: function(res) {

      },
      error: function(err) {
        Global.alert(err.message);
      }
    });
  },

  reset: function() {

    $('#J_Datefield').val('');
    $('#J_Dept').select2('val', '无');
    $('#J_Feedback').select2('val', '无');
    $('#J_Channel').select2('val', '无');
    $('#J_Program').select2('val', '无');
    $('#J_Section').val('');
    $('#J_Report').select2('val', '无');
    $('#J_Event').select2('val', '无');
    $('#J_Replay').select2('val', '无');
  },

  search: function() {

    var date = $('#J_Datefield').val();
    var dept = $('#J_Dept').val();
    var finder = $('#J_Finder').val();
    var feedback = $('#J_Feedback').val();
    var channel = $('#J_Channel').val();
    var program = $('#J_Program').val();
    var section = $('#J_Section').val();
    var report = $('#J_Report').val();
    var event = $('#J_Event').val();
    var error = $('#J_Error').val();
    var question = $('#J_Question').val();
    var replay = $('#J_Replay').val();
    var param = {};
    var date1;
    var date2;
    var time1;
    var time2;
    var datetimes;

    if(date && date != '无') {

      datetimes = date.split(' - ');
      date1 = datetimes[0].split(' ')[0];
      time1 = datetimes[0].split(' ')[1] + ':00';
      date2 = datetimes[1].split(' ')[0];
      time2 = datetimes[1].split(' ')[1] + ':00';
      param.date = {
        $gte: date1,
        $lte: date2
      };
      param.time =  {
        $gte: time1,
        $lte: time2
      };
    }

    if(dept && dept != '无') param.dept = dept;

    if(finder && finder != '无') param.finder = finder;

    if(feedback && feedback != '无') param.feedback = feedback;

    if(channel && channel != '无') param.channel = channel;

    if(program && program != '无') param.program = program;

    if(section && section != '无') param.section = section;

    if(report && report != '无') param.report = report;

    if(event && event != '无') param.event = event;

    if(error && error != '无') param.error = error;

    if(question && question != '无') param.question = question;

    if(replay && replay != '无') param.replay = replay;

    this.param = param;

    this.getData(param, 1);
  },

  changeSelector: function(node, data) {

    // 先清空
    $(node).empty();

    var fragment = document.createDocumentFragment();

    $.each(data, function(index, item) {

      $(fragment).append('<option value="' + item.name + '">' + item.name + '</option>');
    });

    $(node).append(fragment);

    var value = $.isArray(data) && data.length > 0 ? data[0].name : '';

    $(node).select2('val', value);
  },

  initDatepicker: function() {

    moment.locale('zh-cn');

    $('#J_Datefield').daterangepicker({
      opens: 'right',
      timePicker: true,
      timePickerIncrement: 10,
      format: 'YYYY年MM月DD日 HH:mm',
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

    $('#J_Dept').select2();
    $('#J_Finder').select2();
    $('#J_Channel').select2();
    $('#J_Program').select2();
    $('#J_Event').select2();
    $('#J_Error').select2();
    $('#J_Question').select2();
    $('#J_Feedback').select2();
    $('#J_Report').select2();
    $('#J_Replay').select2();
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
                      '<td><span class="desc-tip" data-toggle="tooltip" title="' + item.desc + '">' + (item.desc.length > 8 ? item.desc.slice(0, 8) + '...' : item.desc) + '</span></td>' +
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
  }
};

Record.init();

module.exports = Record;

// $('#J_Table').DataTable({
//     language: {
//         processing:     "Traitement en cours...",
//         search:         "Rechercher&nbsp;:",
//         lengthMenu:    "Afficher _MENU_ &eacute;l&eacute;ments",
//         info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
//         infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
//         infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
//         infoPostFix:    "",
//         loadingRecords: "Chargement en cours...",
//         zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
//         emptyTable:     "Aucune donnée disponible dans le tableau",
//         paginate: {
//             first:      "Premier",
//             previous:   "Pr&eacute;c&eacute;dent",
//             next:       "Suivant",
//             last:       "Dernier"
//         },
//         aria: {
//             sortAscending:  ": activer pour trier la colonne par ordre croissant",
//             sortDescending: ": activer pour trier la colonne par ordre décroissant"
//         }
//     },
//     responsive: true,
//     pageLength: 50
// });
