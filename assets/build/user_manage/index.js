(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// 加载Global
require('../../c/global/global.js');

var RoleEnum = {

    'admin': '管理员',
    'monitor': '值班长',
    'watcher': '值班员',
    'tec': '技术员'
};

var UserManager = {

    init: function() {

        this.initTables();

        this.initModal();

        this.bindEvent();
    },

    initTables: function() {

        this.table = $('#J_Table').DataTable({
            responsive: true,
            pageLength: 50
        });
    },

    initModal: function() {

        var self = this;

        $('#J_Modal').on('show.bs.modal', function (event) {

            var button = $(event.relatedTarget),
                title = button.data('title'),
                name = button.data('name') || '',
                pswd = button.data('pswd') || '',
                role = button.data('role') || '',
                type = button.data('type'),
                modal = $(this);

            self.role = role;

            modal.find('.modal-title').text(title);

            modal.find('.modal-body #J_InputName').val(name);
            modal.find('.modal-body #J_InputPswd').val(pswd);
            if(role === 'admin') {

                $('.modal-body #J_InputRoleWrap', modal).hide();
            } else {

                $('.modal-body #J_InputRoleWrap', modal).show();
                modal.find('.modal-body #J_InputRole option[value="' + role + '"]').attr('selected', 'selected');
            }

            if(type == 'add') {

                modal.find('.modal-footer .J_Save').addClass('J_Add').removeClass('J_Edit');
            } else if(type == 'edit') {

                modal.find('.modal-footer .J_Save').removeClass('J_Add').addClass('J_Edit');

                self.editName = name;
                if(self.editNode) self.editNode.removeClass('editSelected');
                self.editNode = button.parents('tr');
                self.editNode.addClass('editSelected');
            }

            modal.find('.has-error').removeClass('has-error');
        });

        $('#J_DelModal').on('show.bs.modal', function (event) {

            var button = $(event.relatedTarget),
                name = button.data('name') || '',
                modal = $(this);

            self.delName = name;
            if(self.delNode) self.delNode.removeClass('delSelected');
            self.delNode = button.parents('tr');
            self.delNode.addClass('delSelected');
        });
    },

    bindEvent: function() {

        $('#J_Remove').bind('click', $.proxy(this.remove, this));

        $('.J_Save').bind('click', $.proxy(this.save, this));
    },

    remove: function() {

        if(!this.delName) return;

        var self = this;

        $.ajax({

            url: '/user/remove',
            data: {
                name: this.delName
            },
            success: function(data) {

                if(data.status !== 1) {

                    Global.alert(data.message);
                    return;
                }

                self.table.row('.delSelected').remove().draw();
            },
            error: function(error) {

                Global.alert(error.message);
            }
        });

        $('#J_DelModal').modal('toggle');
    },

    save: function(e) {

        var target = $(e.target),
            type = target.hasClass('J_Add') ? 'add' : 'edit',
            self = this,
            name = $('#J_Modal #J_InputName').val(),
            pswd = $('#J_Modal #J_InputPswd').val(),
            role = $('#J_Modal #J_InputRole').val(),
            api = type == 'add' ? '/user/new' : '/user/edit',
            param = {

                newName: name,
                newPwd: pswd
            };

        if(this.role != 'admin') param.newRole = role;

        if(type == 'edit') param.name = this.editName;

        if(!name) {

            $('#J_Modal #J_InputName').parent('.form-group').addClass('has-error');
            return;
        }

        if(!pswd) {

            $('#J_Modal #J_InputPswd').parent('.form-group').addClass('has-error');
            return;
        }

        $.ajax({

            type: type == 'add' ? 'POST' : 'GET',
            url: api,
            data: param,
            success: function(data) {

                if(data.status !== 1) {

                    Global.alert(data.message);
                    return;
                }

                var tr = '<div class="btn-group" role="group"><button type="button" class="btn btn-warning" data-toggle="modal" data-target="#J_Modal" data-title="编辑用户" data-name="' + name + '" data-pswd="' + pswd + '" data-role="' + role + '" data-type="edit">编辑</button><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#J_DelModal" data-name="'+ name +'">删除</button></div>';

                if(type == 'add') {

                    self.table.row.add([name, RoleEnum[role], tr]).draw();
                } else {

                    self.table.row('.editSelected').data([name, RoleEnum[role], tr]);
                }
            },
            error: function(error) {

                Global.alert(error.message);
            }
        });

        $('#J_Modal').modal('toggle');
    }
};

UserManager.init();

},{"../../c/global/global.js":2}],2:[function(require,module,exports){
$(function() {

    $('#side-menu').metisMenu();


    // 登出按钮
    $('.J_GoLogout').on('click', function() {
        $.ajax({
            type: 'get',
            url: '/user/logout',
            data: {},
            success: function(res) {
                if (res.status != 1) {
                    alert(res.message);
                } else {
                    location.href = '/user/login';
                }
            },
            error: function(err) {
                console.error(err);
            }
        });
    });

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});

var Global = {

    alert: function(message) {

      var $alert = $('.J_GlobalAlert');

      if ($alert.length === 0) {
        $('body').append('<p class="global-alert J_GlobalAlert"></p>');
        $alert = $('.J_GlobalAlert');
      }

      $alert.html(message);

      setTimeout(function() {

        $alert.addClass('active');

        setTimeout(function() {
          $alert.removeClass('active');
        }, 2000);

      }, 0);

    }

};

window.Global = Global;

module.exports = Global;

},{}]},{},[1]);
