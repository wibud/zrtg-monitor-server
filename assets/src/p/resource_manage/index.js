// 加载Global
require('../../c/global/global.js');



var resource = {

  init: function() {

    this.bindEvent();

  },

  bindEvent: function() {

    var self = this;

    $('#J_AddResourceModal').on('show.bs.modal', function (e) {

      var btn = $(e.relatedTarget);
      var type = btn.data('type');

      var modal = $(this);
      modal.find('.J_ResourceType').val(type);
      modal.find('.modal-title').html(btn.html());

    });

    var $modalSureBtn = $('.J_ModalSure');

    $modalSureBtn.on('click', function() {

      var $modal = $('#J_AddResourceModal');

      var type = $modal.find('.J_ResourceType').val().trim();
      var name = $modal.find('.J_ResourceName').val().trim();

      self.add(type, name);

    });

  },


  add: function(type, name) {

    if (!type || !name) {
      return;
    }

    $.ajax({
      url: '/resource/new',
      data: {
        type: type,
        name: name,
      },
      dataType: 'json',
      success: function(res) {

        if (res.status !== 1) {

          alert(res.message);

        } else {
           location.reload();
        }

      },
      error: function(err) {
        alert(err.message);
      }
    })


  }

};


resource.init();

module.exports = resource;
