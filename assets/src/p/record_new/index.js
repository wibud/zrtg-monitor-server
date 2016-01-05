// 加载Global
require('../../c/global/global.js');

var Resource = {

  init: function() {

    this.initDatepicker();

    this.initTimepicker();

    this.initSeletor();

    this.bindEvent();

    this.changeSelector('#J_Finder', GlobalData.users[$('#J_Dept').val()]);

    var selectIndex = $('#J_Event')[0].selectedIndex;
    this.changeSelector('#J_Error', GlobalData.errors[selectIndex].children);
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

    var config = {
      showSeconds: true,
      // showInputs: false,
      showMeridian: false,
      minuteStep: 1,
      secondStep: 1
    };

    $('#J_Timefield').timepicker(config);

    $('#J_Playtime').timepicker(config);

    $('#J_Duration').timepicker(config);
  },

  initSeletor: function() {

    $('#J_Dept').select2();
    $('#J_Class').select2();
    $('#J_Finder').select2();
    $('#J_Channel').select2();
    $('#J_Program').select2();
    $('#J_Event').select2();
    $('#J_Error').select2();
    $('#J_Question').select2();
    $('#J_Duty').select2();
    $('#J_Feedbace').select2();
    $('#J_Report').select2();
    $('#J_Replay').select2();
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

    $('#J_Submit').click($.proxy(this.submit, this));
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

  submit: function(e) {

    $('.J_ErrorTip').addClass('hidden');
    $('.J_SuccessTip').addClass('hidden');

    var date = {name: '发现日期', value: $('#J_Datefield').val()};
    var time = {name: '发现时间', value: $('#J_Timefield').val()};
    var dept = {name: '科组', value: $('#J_Dept').val()};
    var finder = {name: '发现人', value: $('#J_Finder').val()};
    var clas = {name: '班次', value: $('#J_Class').val()};
    var channel = {name: '频道', value: $('#J_Channel').val()};
    var program = {name: '节目类型', value: $('#J_Program').val()};
    var section = {name: '栏目名称', value: $('#J_Section').val()};
    var playtime = {name: '时间入点', value: $('#J_Playtime').val()};
    var duration = {name: '持续时长', value: $('#J_Duration').val()};
    var event = {name: '事件性质', value: $('#J_Event').val()};
    var error = {name: '错误类别', value: $('#J_Error').val()};
    var question = {name: '具体问题', value: $('#J_Question').val()};
    var desc = {name: '描述补充', value: $('#J_Desc').val()};

    var vertifyValue = [];
    vertifyValue.push(date);
    vertifyValue.push(time);
    vertifyValue.push(dept);
    vertifyValue.push(finder);
    vertifyValue.push(clas);
    vertifyValue.push(channel);
    vertifyValue.push(program);
    vertifyValue.push(section);
    vertifyValue.push(playtime);
    vertifyValue.push(duration);
    vertifyValue.push(event);
    vertifyValue.push(error);
    vertifyValue.push(question);

    if(!this.vertify(vertifyValue)) return;

    $.ajax({
      type: 'POST',
      url: '/record/create',
      data: {
        data: JSON.stringify({
          date: date.value,
          time: time.value,
          dept: dept.value,
          finder: finder.value,
          clas: clas.value,
          channel: channel.value,
          program: program.value,
          section: section.value,
          playtime: playtime.value,
          duration: duration.value,
          event: event.value,
          error: error.value,
          question: question.value,
          desc: desc.value
        })
      },
      dataType: 'json',
      success: function(res) {

        if (res.status !== 1) {

          $('.J_Tip').text(res.message);
          $('.J_ErrorTip').removeClass('hidden');
        } else {

          $('.J_SuccessTip').removeClass('hidden');
          // 直接跳转到首页
          window.location.replace('/');
        }
      },
      error: function(err) {

        $('.J_Tip').text(err.message);
        $('.J_ErrorTip').removeClass('hidden');
      }
     });
  },

  vertify: function(values) {

    for (var i = values.length - 1; i >= 0; i--) {

      if(!values[i].value) {

        $('.J_Tip').text(values[i].name + '不能为空！');
        $('.J_ErrorTip').removeClass('hidden');
        return false;
      }
    }

    $('.J_ErrorTip').addClass('hidden');
    return true;
  }
};

Resource.init();

module.exports = Resource;
