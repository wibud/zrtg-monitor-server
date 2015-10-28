// 加载Global
require('../../c/global/global.js');

var Record = {

  init: function() {

    this.isFirst = true;

    this.getData({}, 1);

    // this.initPaginator();
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

        self.getData({}, newPage);
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
                      '<td>' + item.date + '</td>' +
                      '<td>' + item.time + '</td>' +
                      '<td>' + item.channel + '</td>' +
                      '<td>' + item.program + '</td>' +
                      '<td>' + item.section + '</td>' +
                      '<td>' + item.event + '</td>' +
                      '<td>' + item.error + '</td>' +
                      '<td>' + item.question + '</td>' +
                      '<td><span class="desc-tip" data-toggle="tooltip" title="' + item.desc + '">' + (item.desc.length > 10 ? item.desc.slice(0, 10) + '...' : item.desc) + '</span></td>' +
                      '<td>' + item.playtime + '</td>' +
                      '<td>' + item.duration + '</td>' +
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
