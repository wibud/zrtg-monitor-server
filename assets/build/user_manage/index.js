(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
