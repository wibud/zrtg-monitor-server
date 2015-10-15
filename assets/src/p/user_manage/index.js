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

                var tr = '<div class="btn-group" role="group"><button type="button" class="btn btn-warning" data-toggle="modal" data-target="#J_Modal" data-title="编辑用户" data-name="' + name + '" data-pswd="' + pswd + '" data-role="' + role + '" data-type="edit"><i class="fa fa-edit"></i></button><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#J_DelModal" data-name="'+ name +'"><i class="fa fa-trash"></i></button></div>';

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
