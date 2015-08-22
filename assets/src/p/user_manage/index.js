// 加载Global
require('../../c/global/global.js');

var UserManager = {

    init: function() {

        this.initTables();

        this.initModal();
    },

    initTables: function() {

        $('#J_Table').DataTable({
            responsive: true,
            pageLength: 50
        });
    },

    initModal: function() {

        $('#J_Modal').on('show.bs.modal', function (event) {

            var button = $(event.relatedTarget),
                title = button.data('title'),
                name = button.data('name') || '',
                pswd = button.data('pswd') || '',
                role = button.data('role') || '',
                modal = $(this);

            modal.find('.modal-title').text(title);

            modal.find('.modal-body #J_InputName').val(name);
            modal.find('.modal-body #J_InputPswd').val(pswd);
            modal.find('.modal-body #J_InputRole option[value="' + role + '"]').attr('selected', 'selected');
        });
    }
};

UserManager.init();
