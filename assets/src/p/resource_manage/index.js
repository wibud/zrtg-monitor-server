// 加载Global
require('../../c/global/global.js');
// 加载easytree
require('../../c/easytree/index.js');

var resource = {

  init: function() {

    // this.modal = $('#J_AddResourceModal');
    this.bindEvent();

    $('.J_Error').EasyTree({
        addable: true,
        editable: true,
        deletable: true
    });
  },

  bindEvent: function() {

    var self = this;

    // this.modal.on('show.bs.modal', function (e) {

    //   var btn = $(e.relatedTarget);
    //   var type = btn.data('type');

    //   var modal = $(this);
    //   modal.find('.J_ResourceType').val(type);
    //   modal.find('.modal-title').html(btn.html());

    // });

    // $('.J_ModalSure').on('click', function() {

    //   var $modal = $('#J_AddResourceModal');

    //   var type = $modal.find('.J_ResourceType').val().trim();
    //   var name = $modal.find('.J_ResourceName').val().trim();

    //   self.action('new', type, name, function() {

    //     var $panel = $('.resource-item.' + type);
    //     var itemHTML = '<span class="label label-primary">'
    //             + name
    //             + '<i class="fa fa-close remove-btn J_ResourceRemove" data-name="'
    //             + name
    //             + '"></i></span>';

    //     $panel.find('.box-body .alert-danger').remove();
    //     $panel.find('.box-body').append(itemHTML);

    //     self.modal.modal('hide');
    //   });

    // });

    $('.resource-item').on('click', function(e) {

      var $target = $(e.target);

      if ($target.hasClass('J_ResourceRemove')) {

        var type = $target.parents('.resource-item').attr('data-type');
        var name = $target.attr('data-name');

        self.action('remove', type, name, function() {
          $target.parent('.label').fadeOut();
        });
      }

      if($target.hasClass('J_AddResource')) {

        var type = $target.parents('.resource-item').attr('data-type');
        var name = $target.parents('.resource-item').find('.J_Input').val().trim();

        self.action('new', type, name, function() {

          var $panel = $('.resource-item.' + type);
          var itemHTML = '<span class="label label-default">'
                  + name
                  + '<i class="fa fa-close remove-btn J_ResourceRemove" data-name="'
                  + name
                  + '"></i></span>';

          $panel.find('.box-body .alert-danger').remove();
          $panel.find('.box-body').append(itemHTML);
        });
      }

    });

    $('.J_ModifyErrors').on('click', function(e) {

      // 拼凑数据格式
      var data = [];
      parse('.J_Error', data);

      function parse(node, data){

        $(node).find('> ul > li').each(function(index, item) {

          var obj = {};
          obj.name = $(item).find('> span > a').text().trim();
          obj.children = [];

          parse(item, obj.children);

          data.push(obj);
        });
      }

       // 提交
      $.ajax({
        type: 'POST',
        url: '/resource/replace',
        data: {
          type: 'error',
          data: JSON.stringify(data)
        },
        dataType: 'json',
        success: function(res) {

          if (res.status !== 1) {

            Global.alert(res.message);
          } else {

            Global.alert('配置成功！');
          }
        },
        error: function(err) {

          Global.alert(err.message);
        }
       });
    });
  },


  action: function(action, type, name, callback) {

    var self = this;

    if (!type || !name) {
      return;
    }

    $.ajax({
      url: '/resource/' + action,
      data: {
        type: type,
        name: name,
      },
      dataType: 'json',
      success: function(res) {

        if (res.status !== 1) {

          Global.alert(res.message);

        } else {
          callback(null);
        }

      },
      error: function(err) {
        Global.alert(err.message);
      }
    })
  },

};


resource.init();

module.exports = resource;
