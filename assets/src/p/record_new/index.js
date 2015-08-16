// 加载Global
require('../../c/global/global.js');


$(document).ready(function() {

  // 表单校验
  var $validator = $("#commentForm").validate({
    rules: {
      J_Datefield: {
        required: true
      },
      J_Timefield: {
        required: true
      },
      J_Dept: {
        required: true
      },
      J_Class: {
        required: true
      },
      J_finder: {
        required: true
      },
      J_Chanel: {
        required: true
      },
      J_Program: {
        required: true
      },
      J_Section: {
        required: true
      },
      J_Playtime: {
        required: true
      },
      J_Event: {
        required: true
      },
      J_Error: {
        required: true
      },
      J_Question: {
        required: true
      },
      J_Desc: {
        required: true
      }
    }
  });

  // 初始化流程
  $('#rootwizard').bootstrapWizard({
    'tabClass': 'nav nav-pills',
    'onNext': function(tab, navigation, index) {
      var $valid = $("#commentForm").valid();
      if(!$valid) {
        $validator.focusInvalid();
        return false;
      }
    }
  });
});
