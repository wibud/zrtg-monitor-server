// 加载Global
require('../../c/global/global.js');

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
            }

            modal.find('.has-error').removeClass('has-error');
        });

        $('#J_DelModal').on('show.bs.modal', function (event) {

            var button = $(event.relatedTarget),
                name = button.data('name') || '',
                modal = $(this);

            self.delName = name;
            if(self.delNode) self.delNode.removeClass('selected');
            self.delNode = button.parent('tr');
            self.delNode.addClass('selected');
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

                self.table.row('.selected').remove().draw();
            },
            error: function(error) {

                Global.alert(error.message);
            }
        });
    },

    save: function(e) {

        var target = $(e.target);

        if(target.hasClass('J_Add')) {

            this.add();
        }else if(target.hasClass('J_Edit')) {

            this.edit();
        }
    },

    add: function() {

        var self = this,
            name = $('#J_Modal #J_InputName').val(),
            pswd = $('#J_Modal #J_InputPswd').val(),
            role = $('#J_Modal #J_InputRole').val();

        if(!name) {

            $('#J_Modal #J_InputName').parent('.form-group').addClass('has-error');
            return;
        }

        if(!pswd) {

            $('#J_Modal #J_InputPswd').parent('.form-group').addClass('has-error');
            return;
        }

        $.post('/user/new', {

            name: name,
            password: pswd,
            role: role
        }, function(data) {

            if(data.status !== 1) {

                Global.alert(data.message);
                return;
            }

            var tr = $('<div class="btn-group" role="group"><button type="button" class="btn btn-warning" data-toggle="modal" data-target="#J_Modal" data-title="编辑用户" data-name="' + name + '" data-pswd="' + pswd + '" data-role="' + role + '" data-type="edit">编辑</button><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#J_DelModal" data-name="'+ name +'">删除</button></div>');

            self.table.row.add([name, pswd, tr]).draw();
        });

        $('#J_Modal').modal('toggle');
    },

    edit: function() {

    }
};

UserManager.init();
