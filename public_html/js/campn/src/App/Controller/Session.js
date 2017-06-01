App.Controller.Session = function () {};

App.Controller.Session.confirmDelete = function (id, name, callback) {
  var $content = $('<div class="pn-form">Etes-vous sûr de vouloir supprimer la session \'' + name + '\' ?</div>');
  var dialog = new UI.Dialog('Supprimer la session', $content, {width: 800}, function () {
    App.Controller.Session.delete(id, callback);
    dialog.close();
  });
  dialog.open();
};

App.Controller.Session.delete = function (id, callback) {
  App.Server.Session.delete(id,
          function (data) {
            callback();
          },
          function (data) {
            console.log(data.responseText);
          }
  );
}

App.Controller.Session.disableQueryCommands = function () {
  if (App.session.exclQueryExists()) {
    App.Controller.Query.disable(App.session.exclQuery());
  }
  $.each(App.session.queries(), function (i, query) {
    App.Controller.Query.disable(query);
  });
};

App.Controller.Session.enableQueryCommands = function () {
  if (App.session.exclQueryExists()) {
    App.Controller.Query.enable(App.session.exclQuery());
  }
  $.each(App.session.queries(), function (i, query) {
    App.Controller.Query.enable(query);
  });
};

App.Controller.Session.report = function () {
  if (App.session.queries().length + (App.session.exclQuery() != null ? 1 : 0) > 0) {
    var report = function () {
      var queries = [];
      if (App.session.exclQuery() != null) {
        queries.push({label: App.session.exclQuery().label(), count: App.session.exclQuery().popcount()});
      }
      $.each(App.session.queries(), function (i, query) {
        queries.push({label: query.label(), count: query.popcount()});
      });
      $(location).attr('href', App.config.server.url + '/session/report?' + $.param({auth: App.account.auth}) + '&' + $.param({data: {session: {id: App.session.id(), name: App.session.name()}, queries: queries}}));
    };
    if (!App.session.queriesComputed()) {
      var $content = '<div class="pn-form">Le rapport nécessite que les requêtes soient calculées. Voulez-vous lancer le comptage ? Le rapport sera automatiquement téléchargé.</div>'
      var dialog = new UI.Dialog('Confirmation', $content, {width: 500},
              function () {
                dialog.close();
                App.Controller.Session.compute(function () {
                  report();
                });
              }
      );
      dialog.open();
    } else {
      report();
    }
  }
};

App.Controller.Session.openPrint = function () {
  var $content = $('<div id="print"></div>');
  var $queries = $('<div id="print-queries"></div>');
  $queries.append('<h1>Sélectionner les requêtes à imprimer</h1>');

  var queries = [];
  var queries2 = App.session.queries();
  if (App.session.exclQuery() != null) {
    queries2.unshift(App.session.exclQuery());
  }
  $.each(queries2, function (i, query) {
    queries.push(query.id());
    var $query = $('<div class="print-query">');
    var $queryCheckbox = $('<input id="print-query-' + query.id() + '" type="checkbox"/>');
    $queryCheckbox.attr('checked', true);
    $queryCheckbox.change(function () {
      if ($(this).is(':checked'))
        queries.push(query.id());
      else
        queries = queries.unset(queries.indexOf(query.id()));
    });
    $query.append($queryCheckbox).append('<label for="print-query-' + query.id() + '">' + query.label() + '</label>');
    $queries.append($query);
  });
  $content.append($queries);
  var dialog = new UI.Dialog('Imprimer', $content, {width: 1000},
          function () {
            dialog.close();
            window.print();
          }
  );
  dialog.open();
};

App.Controller.Session.print = function () {

};

App.Controller.Session.openSettings = function () {
  var $content = $('<div id="settings"></div>');
  $content.append('<ul></ul>');
  $content.children('ul').append('<li>Général</li>');
  $content.children('ul').append('<li>Requêtage</li>');
  $content.children('ul').append('<li>Export</li>');

  var $general = $('<div id="settings-general"> </div>');

  var $computing = $('<div id="settings-computing"></div>');

  var $computeOnTheFly = $('<div class="export-param" id="settings-computing-computeOnTheFly"></div>');
  var $computeOnTheFlyLabel = $('<label for="settings-computing-computeOnTheFly-input">Calculer à la volée</label>');
  var $computeOnTheFlyInput = $('<input type="checkbox" id="settings-computing-computeOnTheFly-input"/>');
  $computeOnTheFlyInput.attr('checked', App.settings.computing.computeOnTheFly);
  $computeOnTheFly.append($computeOnTheFlyLabel).append($computeOnTheFlyInput);
  $computing.append($computeOnTheFly);

  var $excludeQueries = $('<div class="export-param" id="settings-computing-excludeQueries"></div>');
  var $excludeQueriesLabel = $('<label for="settings-computing-excludeQueries-input">Exclure les requêtes entre-elles</label>');
  var $excludeQueriesInput = $('<input type="checkbox" id="settings-computing-excludeQueries-input"/>');
  $excludeQueriesInput.attr('checked', App.settings.computing.excludeQueries);
  $excludeQueries.append($excludeQueriesLabel).append($excludeQueriesInput);
  $computing.append($excludeQueries);

  var $export = $('<div id="settings-exports"></div>');
  var $delimiter = $('<div class="export-param" id="export-delimiter"></div>');
  var $delimiterLabel = $('<label for="settings-export-delimiter-input">Délimiteur</label>');
  var $delimiterInput = $('<input class="k-textbox" id="settings-export-delimiter-input" />');
  $delimiterInput.val(App.settings.export.delimiter);

  var $exportVarName = $('<div class="export-param" id="export-exportVarName"></div>');
  var $exportVarNameLabel = $('<label for="settings-export-varname-input">Exporter le nom des variables dans l\'entête du fichier</label>');
  var $exportVarNameInput = $('<input type="checkbox" id="settings-export-varname-input"/>');
  $exportVarNameInput.attr('checked', App.settings.export.exportVarName);
  $delimiter.append($delimiterLabel).append($delimiterInput);
  $exportVarName.append($exportVarNameLabel).append($exportVarNameInput);
  $export.append($delimiter).append($exportVarName);

  $content.append($general);
  $content.append($computing);
  $content.append($export);

  var tab = $content.kendoTabStrip({animation: false}).data('kendoTabStrip');
  tab.select(0);

  var dialog = new UI.Dialog('Préférences', $content, {width: 1000},
          function () {
            var settings = {
              computing: {
                computeOnTheFly: $computeOnTheFlyInput.is(':checked'),
                excludeQueries: $excludeQueriesInput.is(':checked'),
              },
              export: {
                delimiter: $delimiterInput.val(),
                exportVarName: $exportVarNameInput.is(':checked')
              }
            };
            App.UI.state().synch.working();
            App.UI.disable();
            App.Server.Session.saveSettings(
                    settings,
                    function () {
                      App.UI.state().synch.ready();
                      App.UI.enable();
                      App.loadSettings(settings);
                      App.session.computeOnTheFly(App.settings.computing.computeOnTheFly);
                      dialog.close();
                    },
                    function (data) {
                      console.log(data.responseText);
                      App.UI.state().synch.fail();
                      App.UI.enable();
                    }
            );

          }
  );
  dialog.open();
};

App.Controller.Session.openExport = function () {

  // Pas de requùête => pas d'extraction
  if (!App.session.queries().length) {
    var conf = new UI.Alert("Il n'y a pas de requête à extraire.");
    conf.open();
    return;
  }

  // On enregistre l'extraction courante dans la variable globale App.session
  var extraction = new App.Model.Extraction();

  var settings = extraction.get("settings");

  settings.get("fields").add([
    {path: '@idindividu', label: 'ID individu'},
    {path: '@clemodulo', label: 'Clé modulo'},
    {path: '@civilite', label: 'Civilité'},
    {path: '@prenom', label: 'Prénom'},
    {path: '@nom', label: 'Nom'},
    {path: '@raisonsociale', label: 'Raison sociale'},
    {path: '@v2', label: 'Adresse zone 2'},
    {path: '@v3', label: 'Adresse zone 3'},
    {path: '@v4', label: 'Adresse zone 4'},
    {path: '@v5', label: 'Adresse zone 5'},
    {path: '@cp', label: 'Code postal'},
    {path: '@acheminement', label: 'Ville'},
    {path: 'pays/@text', label: 'Pays'},
    {path: '@code_action', label: 'Code Action'}
  ]);

  // Champ
  var FieldItem = Marionette.ItemView.extend({
    tagName: "li",
    template: false,
    onRender: function () {
      var that = this;
      this.$el.text(this.model.get("label"));
      this.$el.attr("data-cid", this.model.cid);
      var remove = $("<a>", {class: "remove", html: "<i class='icon-close'></i>"}).prependTo(this.$el);
      remove.on("click", function () {
        that.trigger("remove", that.model);
      });
    }
  });

  // Liste de champs
  var FieldList = Marionette.CollectionView.extend({
    tagName: "ul",
    childView: FieldItem,
    onAddChild: function (child) {
      var that = this;
      child.on("remove", function (model) {
        that.collection.remove(model);
      });
    },
    onRender: function () {
      var that = this;
      this.$el.sortable({
        placeholder: "move-placeholder",
        update: function (e, ui) {
          var model = that.collection.get(ui.item.attr("data-cid"));
          var pos = ui.item.index();
          that.collection.remove(model);
          that.collection.add(model, {at: pos});
        }
      });
    }
  });

  var fieldList = new FieldList({collection: extraction.get("settings").get("fields")});

  function valid() {
    if (queries.length == 0 || paths.length == 0) {
      dialog.enableValid(false);
    } else {
      dialog.enableValid(true);
    }
  }

  var $wrap = $('<div>');

  var $extractionName = $('<div class="extraction-name"></div>').appendTo($wrap);
  $('<label for="extraction-name">Nom de l\'extraction / campagne</label>').appendTo($extractionName);
  $('<input type="text" id="extraction-name" class="k-textbox"/>').appendTo($extractionName).on("change", function () {
    extraction.set("name", $(this).val());
  }).on('change', function(e) {
    var val = e.target.value;
    if(!$extractionFilenameInput.val()) {
      extraction.set("filename", val + '.txt');
      $extractionFilenameInput.val(val);
    }
  });

  var $extractionFilename = $('<div class="extraction-filename"></div>').appendTo($wrap);
  $('<label for="extraction-filename">Nom du fichier</label>').appendTo($extractionFilename);
  var $extractionFilenameInput = $('<input type="text" id="extraction-filename" class="k-textbox"/>').appendTo($extractionFilename).on("change", function () {
    extraction.set("filename", $(this).val() + '.txt');
  }).after('<span>.txt</span>');

  var $limit = $('<div class="extraction-limit"></div>').appendTo($wrap);
  $('<label for="extraction-limit-label">Limiter la quantité</label>').appendTo($limit);
  $('<input id="extraction-limit-input" />').appendTo($limit).kendoNumericTextBox({min: 0, value: extraction.get("limit")}).on("change", function () {
    extraction.set("limit", $(this).val() ? $(this).val() : null);
  });

  var $content = $('<div id="export"></div>').appendTo($wrap);

  $content.append('<ul>');
  $content.children('ul').append('<li>Variables</li>');
  $content.children('ul').append('<li>Cibles</li>');
  $content.children('ul').append('<li>Paramètres</li>');

  var $variables = $('<div id="export-variables"></div>');

  var $variablesWrap = $('<div></div>').css('display', '-webkit-flex');

  var dataModel = App.DataModel;
  var $dataModel = dataModel.tree().attr('id', 'export-selection-vars').width('50%');
  dataModel._tree.height('400px');

  var $selectedVars = $('<div id="export-selected-vars"></div>').width('50%');
  $selectedVars.append('<h1>Variable(s) sélectionnée(s)</h1>');
  $selectedVars.append(fieldList.render().$el);

  $variablesWrap.append($dataModel).append($selectedVars);

  dataModel._$e.prepend('<h1>Sélectionner les variables</h1>');

  $variables.append($variablesWrap);
  $content.append($variables);

  dataModel.hideEntire();
  dataModel.kTree().insertBefore({
    text: "Nom requête / Code Action",
    element: {
      label: "Nom requête / Code Action",
      name: "code_action",
      desc: "Nom requête / Code Action",
      path: "@code_action",
      type: "special"
    }
  }, dataModel.root());

  dataModel._tree.find('.k-item').children('div').children('span').dblclick(function () {
    var variable = dataModel.kTree().dataItem(dataModel.kTree().select());
    if (variable.element.type === 'attribute' || variable.element.type === "special") {
      if (!extraction.get("settings").get("fields").find(function (f) {
        return f.get("path") === variable.element.path;
      })) {
        extraction.get("settings").get("fields").add({path: variable.element.path, label: variable.element.label});
      }
    }
  });


  var $queries = $('<div id="export-queries"></div>');
  $queries.append('<h1>Sélectionner les requêtes à exporter</h1>');

  var queryInputs = [];

  $.each(App.session.queries(), function (i, query) {
    if (!query.excl()) {
      settings.get("targets").push({
        queryId: query.id(),
        code: query.label()
      });
      var $query = $('<div class="export-query">');
      var $queryCheckbox = $('<input data-id="' + query.id() + '" id="export-query-' + query.id() + '" type="checkbox"/>');
      $queryCheckbox.attr('checked', true);
      $query.append($queryCheckbox).append('<label for="export-query-' + query.id() + '">' + query.label() + '</label>');
      $queries.append($query);
      queryInputs.push($queryCheckbox);
      $queryCheckbox.change(function () {
        settings.set("targets", _.map(_.filter(queryInputs, function (input) {
          return input.prop("checked") === true;
        }), function (input) {
          return input.attr("data-id");
        }));
        valid();
      });

    }
  });
  $content.append($queries);

  var $parameters = $('<div id="export-parameters"></div>');

  $parameters.append('<h1>Paramètres de l\'export</h1>');
  var $exportVarName = $('<div class="export-param" id="export-delimiter"></div>');
  var $exportVarNameLabel = $('<label for="export-varname-input">Exporter le nom des variables dans l\'entête du fichier</label>');
  var $exportVarNameInput = $('<input type="checkbox" id="export-varname-input"/>');
  $exportVarNameInput.prop("checked", settings.get("header"));
  $exportVarNameInput.on("change", function () {
    settings.set("enclosure", $(this).prop("checked"));
  });
  $exportVarName.append($exportVarNameLabel).append($exportVarNameInput);
  $parameters.append($exportVarName);

  var $delimiter = $('<div class="export-param" id="export-delimiter"></div>');
  var $delimiterLabel = $('<label for="export-delimiter-input">Champ délimité par</label>');
  var $delimiterInput = $('<input class="k-textbox" id="export-delimiter-input" />');
  $delimiterInput.val(settings.get("delimiter"));
  $delimiterInput.on("change", function () {
    settings.set("delimiter", $(this).val());
  });
  $delimiter.append($delimiterLabel).append($delimiterInput);
  $parameters.append($delimiter);

  var $enclosure = $('<div class="export-param" id="export-enclosure"></div>');
  var $enclosureLabel = $('<label for="export-delimiter-input">Champs entournés par</label>');
  var $enclosureInput = $('<input class="k-textbox" id="export-enclosure-input" />');
  $enclosureInput.val(settings.get("enclosure"));
  $enclosureInput.on("change", function () {
    settings.set("enclosure", $(this).val());
  });
  $enclosure.append($enclosureLabel).append($enclosureInput);
  $parameters.append($enclosure);

  $content.append($parameters);

  var tab = $content.kendoTabStrip({animation: false}).data('kendoTabStrip');
  tab.select(0);

  var $msg = $('<div id="export-message"></div>').hide();
  $content.append($msg);

  var dialog = new UI.Dialog('Export de fichier', $wrap, {width: 1000, commands: {valid: {text: 'Lancer l\'extraction', enabled: true}}}, function () {

    var errorMessage;

    if (!extraction.has("name")) {
      errorMessage = "Le nom de l'extraction est obligatoire.";
    } else if (!extraction.has("filename")) {
      errorMessage = "Le nom du fichier est obligatoire.";
    } else if (!extraction.get("settings").get("fields").length) {
      errorMessage = "Il n'y a pas de champ en sortie.";
    } else if (!extraction.get("settings").has("delimiter")) {
      errorMessage = "Le délimiteur de champ est obligatoire.";
    }

    if (errorMessage) {
      var alertError = new UI.Alert(errorMessage, "Attention");
      alertError.open();
      return;
    }

    dialog.enableValid(false);

    var confirmExtraction = function () {
      var popcount = (extraction.has("limit") && extraction.get("limit") <= App.session.popcount()) ? extraction.get("limit") : App.session.popcount();
      var continueDialog = new UI.Confirm("Vous êtes sur le point d'extraire " + popcount + " individus. Continuer et procéder à l'extraction ?",
        function () {
          if (App.session.queries().length > 0 || App.session.exclQuery()) {
            var queries = [];
            if (App.session.exclQuery() != null)
              queries.push(App.session.exclQuery().toJSON());
            $.each(App.session.queries(), function (i, query) {
              queries.push(query.toJSON());
            });
            App.UI.state().synch.working();
            App.UI.disable();
            App.session.name(extraction.get("name")),
            App.Server.Session.save(
              App.session.id(),
              App.session.name(),
              'Description',
              queries,
              function (data) {
                App.UI.session().saved(App.session.name());
                App.Controller.Session.synchInternalIds(data);
                App.UI.state().synch.ready();
                App.UI.enable();
              },
              function (data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
              }
            );
          }
          
          extraction.set("sessionId", App.session.id());
          extraction.set("description", App.session.toString());
          extraction.save().done(function () {
            App.Controller.Session.openExtractionsList({check: extraction});
          });
          console.log("extraction", extraction);
        },
        function () {}
      );

      continueDialog.open();
    };

    $msg.removeClass('message-success');
    $msg.fadeIn();
    if (!App.session.queriesComputed()) {
      dialog.close();
      var computingDialog = new UI.Alert("Calcul des requêtes...", "Extraction");
      computingDialog.displayValid(false);
      computingDialog.open();
      computingDialog.k().wrapper.find(".k-window-actions").remove();
      App.Controller.Session.compute(function () {
        computingDialog.close();
        confirmExtraction();
      });
    } else {
      dialog.close();
      confirmExtraction();
    }

  });

  dialog.open();
};

App.Controller.Session.openExtractionsList = function (options) {

  var toCheck, closed = false;

  function readableFileSize(size) {
    var units = ['o', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
    var i = 0;
    while (size >= 1024) {
      size /= 1024;
      ++i;
    }
    return size.toFixed(1) + ' ' + units[i];
  }
  ;

  var extractions = new App.Model.ExtractionCollection();
  extractions.comparator = function (model) {
    return -model.id;
  };

  function fetch() {
    if (!closed) {
      extractions.fetch().done(function () {
        _.delay(fetch, 5000);
      });
    }
  };

  fetch();

  var ItemView = Marionette.ItemView.extend({
    tagName: "tr",
    bindings: {
      "#extraction-status": {
        observe: "state",
        update: function ($el, val) {
          $el.removeClass().addClass("extraction-" + val);
        }
      },
      "#extraction-status-icon": {
        observe: "state",
        onGet: function (val) {
          var icon;
          switch (val) {
            case "edition":
              icon = "pencil";
              break;
            case "pending":
              icon = "play-3";
              break;
            case "running":
              icon = "play-3";
              break;
            case "completed":
              icon = "checkmark";
              break;
            case "failed":
              icon = "warning";
              break;
          }
          return icon;
        },
        update: function ($el, val) {
          $el.removeClass().addClass("icon-" + val);
        }
      },
      "#extraction-status-text": {
        observe: "state",
        onGet: function (val) {
          var text;
          switch (val) {
            case "edition":
              text = "en édition";
              break;
            case "pending":
              text = "extraction en attente";
              break;
            case "running":
              text = "extraction en cours";
              break;
            case "completed":
              text = "terminée";
              break;
            case "failed":
              text = "échec";
              break;
          }
          return text;
        }
      },
      "#extraction-dl-link": {
        observe: ["state", "createdAt"],
        visible: function (val) {
          return val[0] === "completed" && moment.duration(moment().diff(moment(val[1]))).asDays() <= 30;
        }
      },
      /*"#extraction-payment": {
       observe: ["paymentStatus", "state"],
       visible: function(val) {
       return val[1] === "completed";
       },
       update: function($el, val) {
       $el.removeClass().addClass("extraction-payment-" + val[0]); 
       }
       },*/

      "#extraction-payment-icon": {
        observe: "paymentStatus",
        update: function ($el, val) {
          $el.empty();
          $el.removeClass().addClass("icon-" + (val === "received" ? "checkmark" : "warning"));
        }
      },
      "#extraction-payment-text": {
        observe: "paymentStatus",
        onGet: function ($el, val) {
          return val === "received" ? "payé" : "à payer";
        }
      },
      "#extraction-quantity": {
        observe: "quantity",
        onGet: function (val) {
          return numeral(val).format("0,0").replace(/,/g, ' ');
        }
      },
      "#extraction-limit": {
        observe: "limit",
        onGet: function (val) {
          return val ? numeral(val).format("0,0").replace(/,/g, ' ') : "-";
        }
      },
      "#extraction-filename": "filename",
      "#extraction-name": "name",
      "#extraction-date": {
        observe: "createdAt",
        onGet: function (val) {
          return moment(val, "YYYY-MM-DD HH:mm:SS").format("DD/MM/YYYY HH:mm");
        }
      },
      "#extraction-filesize": {
        observe: "fileSize",
        onGet: function (val) {
          if (val) {
            return readableFileSize(this.model.get("fileSize"));
          }
        }
      }

    },
    template: function (data) {
      return _.template('\
        <td id="extraction-name"></td>\n\
        <td id="extraction-filename"></td>\n\
        <td id="extraction-date"></td>\n\
        <td id="extraction-limit" class="extraction-list-limit"></td>\n\
        <td id="extraction-quantity" class="extraction-list-quantity"></td>\n\
        <td id="extraction-status" class="extraction-status">\n\
          <i id="extraction-status-icon"></i>\n\
          <span id="extraction-status-text"></span>\n\
        </td>\n\
        <!--<td class="extraction-payment">\n\
          <i id="extraction-payment-icon"></i>\n\
          <span id="extraction-payment-text"></span>\n\
        </td>-->\n\
        <td id="extraction-dl">\n\
          <span id="extraction-dl-link"><a class="link">Télécharger le fichier (<span id="extraction-filesize"></span>)</a><br/></span>\n\
          <a id="extraction-desc-link" href="#" class="link">Voir la requête de sélection</a>\n\
          <!--<button class="k-button" id="extraction-open-session">Ouvrir</button>-->\n\
        </td>'
              )(data);
    },
    onRender: function () {
      var that = this;
      this.stickit();
      this.$("#extraction-dl-link > .link").attr("href", App.config.server.url + '/extractions/' + this.model.id + '/file?' + $.param({auth: App.account.auth}));

      this.$("#extraction-open-session").on("click", function() {
        
      });

      this.$("#extraction-desc-link").on("click", function () {
        var msgBox = new UI.Alert(that.model.get("description") || "Requête indisponible", "Requête de sélection");
        msgBox.open();
      });
    }
  });

  var ListView = Marionette.CollectionView.extend({
    tagName: "tbody",
    childView: ItemView
  });

  var WrapView = Marionette.ItemView.extend({
    tagName: "table",
    className: "extraction-list",
    template: false,
    onRender: function () {
      var header = $("<tr>").appendTo($("<thead>").appendTo(this.$el));
      var columns = [
        {name: "name", text: "Nom"},
        {name: "filename", text: "Fichier"},
        {name: "created_at", text: "Date"},
        {name: "limit", text: "Quantité demandée"},
        {name: "quantity", text: "Quantité réelle"},
        {name: "state", text: "Statut de l'extraction"},
        //{name: "payment", text: "Statut du paiement"},
        {name: "dl", text: ""}
      ];
      _.each(columns, function (col) {
        header.append($("<th>", {text: col.text, class: "extraction-list-" + col.name}));
      });
      var dlCol = header.append($("<th>", {class: "extraction-list-dl"}));
      var body = new ListView({collection: this.options.collection});
      body.render().$el.appendTo(this.$el);
    }
  });

  var wrap = new WrapView({collection: extractions});
  wrap.render();

  var dialog = new UI.Dialog(
          'Historique des extractions',
          wrap.$el,
          {
            width: 1000,
            commands: {
              valid: {text: "Fermer"},
              cancel: {display: false}
            }
          },
          function () {
            closed = true;
            dialog.close();
          }
  );
  dialog.open();

  dialog.k().bind("close", function () {
    closed = true;
  });
};


App.Controller.Session.exit = function () {
  window.location.reload();
};

App.Controller.Session.confirmExit = function () {
  var $content = '<div>Etes-vous sûr de vouloir quitter la session ?</div>';
  var dialog = new UI.Dialog(
          'Quitter',
          $content,
          {width: 800, commands: {valid: {text: 'Oui'}, cancel: {text: 'Non'}}},
          function () {
            App.Controller.Session.exit();
            dialog.close();
          }
  );
  dialog.open();
};

App.Controller.Session.confirmNew = function () {
  var $content = $('<div class="pn-form">La session en cours sera perdue, voulez-vous continuer ?</div>');
  var dialog = new UI.Dialog('Nouvelle session', $content, {width: 800}, function () {
    App.Controller.Session.new();
    dialog.close();
  });
  dialog.open();
};

App.Controller.Session.new = function (id, callback) {
  if (App.session != undefined)
    App.Controller.Session.clear();
  App.session = new Session();
  if (id != undefined) {
    App.Controller.Session.load(id, callback);
  } else {
    App.session.name('Nouvelle session');
    if (callback != undefined)
      callback();
    App.UI.session().notSaved(App.session.name());
  }
  if (App.session != undefined)
    App.Controller.Session.clear();
  App.session = new Session();
  App.session.name('Nouvelle session');
  App.session.computeOnTheFly(App.settings.computing.computeOnTheFly);
  //if (callback != undefined) callback(); 
  App.UI.session().notSaved(App.session.name());
};

App.Controller.Session.clear = function () {
  $.each(App.session.queries(), function (i, query) {
    query.remove();
  });
  if (App.session.exclQuery() != null) {
    App.session.exclQuery().remove();
  }
  App.session.resetQueries();
};

App.Controller.Session.load = function (id, callback) {
  App.UI.state().synch.working();
  App.UI.disable();
  App.Server.Session.load(id,
          function (data) {
            App.session = new Session();
            App.session.name(data.name);
            if (data.plugin.name != null) {
              App.session.plugin(data.plugin.name, data.plugin.data);
              App.Plugin.load(App.session.plugin());
            }
            App.session.saved(true).id(data.id).name(data.name);
            App.UI.session().saved(data.name);
            callback();
            $.each(data.queries, function (i, query) {
              App.Controller.Query.load(query);
            });
            if (App.session.exclQueryExists()) {
              App.session.exclQuery().select();
            } else if (App.session.queries()[0] != null) {
              App.session.queries()[0].select();
            }
            var computeOnTheFly = App.settings.computing.computeOnTheFly;
            if (computeOnTheFly) {
              var exclQuery = App.session.exclQuery();
              if (exclQuery != null) {
                if (exclQuery.nodes().length > 1) {
                  computeOnTheFly = false;
                } else if (exclQuery.nodes()[0].criteria().length > 0) {
                  computeOnTheFly = false;
                }
              }
              if (computeOnTheFly) {
                $.each(App.session.queries(), function (i, query) {
                  if (query.nodes().length > 1) {
                    computeOnTheFly = false;
                  } else if (query.nodes()[0].criteria().length > 0) {
                    computeOnTheFly = false;
                  }
                });
              }
            }
            App.session.computeOnTheFly(computeOnTheFly);
            App.UI.state().synch.ready();
            App.UI.enable();
          },
          function (data) {
            console.log(data.responseText);
            App.UI.state().synch.fail();
            App.UI.enable();
          }
  );
};

App.Controller.Session.openSaveAs = function (callback) {
  if (App.session.queries().length > 0 || App.session.exclQuery()) {
    var $content = $('<div class="pn-form"></div>');
    var $wrap = $('<div class="pn-form-input-wrap"></div>');
    var $label = $('<label for="file-save-session-name">Nom</label>');
    var $input = $('<input size="200" id="file-save-session-name" class="k-textbox" placeholder="Nom" type="text"/>');
    $wrap.append($label).append($input);
    $input.val(App.session.name());
    $input.css('width', '400px');
    var $list = App.Controller.Session.list();
    $content.append($list).append($wrap);
    var dialog = new UI.Dialog('Enregistrer sous', $content, {width: 800}, function () {
      var kList = $list.data('kendoGrid'), id = null;
      /*if (kList.select().length > 0) {
       id = kList.dataItem(kList.select()[0]).id;
       }*/
      App.session.name($input.val());
      App.Controller.Session.saveAs(id);
      dialog.close();
    });
    dialog.open();
  }
};

App.Controller.Session.open = function () {
  var $content = $('<div class="pn-form"></div>');
  var $commands = $('<div class="session-open-commands"></div>');
  var $deleteButton = $('<button id="session-delete" class="k-button"><i class="icon-close"></i> Supprimer</button>');
  var $wrap = $('<div class="pn-form-input-wrap"></div>');
  var $list = App.Controller.Session.list();
  $commands.append($deleteButton);
  $content.append($commands).append($list);
  $deleteButton.click(function () {
    var kList = $list.data('kendoGrid');
    if (kList.select().length > 0) {
      var sessionItem = kList.dataItem(kList.select()[0]);
      App.Controller.Session.confirmDelete(sessionItem.id, sessionItem.name, function () {
        var dataRow = kList.dataSource.get(sessionItem.id);
        kList.dataSource.remove(dataRow);
      });
    }
  });
  var dialog = new UI.Dialog('Ouvrir une session', $content, {width: 800}, function () {
    var kList = $list.data('kendoGrid'), id = null;
    if (kList.select().length > 0) {
      id = kList.dataItem(kList.select()[0]).id;
    }
    App.Controller.Session.confirmOpen(id);
    dialog.close();
  });
  dialog.open();
};

App.Controller.Session.synchInternalIds = function (data) {
  App.session.id(data.id);
  $.each(data.queries, function (i, query) {
    if (App.session.query(query.id) == null) {
      App.session.exclQuery().internalId(query.internalId);
    } else {
      App.session.query(query.id).internalId(query.internalId);
    }
  });
};

App.Controller.Session.confirmOpen = function (id) {
  var $content = $('<div class="pn-form">La session en cours sera perdue, voulez-vous continuer ?</div>');
  var dialog = new UI.Dialog('Ouvrir une session', $content, {width: 800}, function () {
    if (App.session != undefined)
      App.Controller.Session.clear();
    App.Controller.Session.load(id, function () {});
    dialog.close();
  });
  dialog.open();
};

App.Controller.Session.saveAs = function (id) {
  App.UI.state().synch.working();
  App.UI.disable();
  var queries = [];
  if (App.session.exclQuery() != null)
    queries.push(App.session.exclQuery().toJSON());
  $.each(App.session.queries(), function (i, query) {
    queries.push(query.toJSON());
  });
  return App.Server.Session.save(
          id,
          App.session.name(),
          'Description',
          queries,
          function (data) {
            App.session.saved(true);
            App.Controller.Session.synchInternalIds(data);
            App.UI.session().saved(App.session.name());
            App.UI.state().synch.ready();
            App.UI.enable();
          },
          function (data) {
            console.log(data.responseText);
            App.UI.state().synch.fail();
            App.UI.enable();
          }
  );
};



App.Controller.Session.save = function (done, fail) {
  if (App.session.queries().length > 0 || App.session.exclQuery()) {
    var queries = [];
    if (App.session.exclQuery() != null)
      queries.push(App.session.exclQuery().toJSON());
    $.each(App.session.queries(), function (i, query) {
      queries.push(query.toJSON());
    });
    if (App.session.isSaved()) {
      App.UI.state().synch.working();
      App.UI.disable();
      App.Server.Session.save(
        App.session.id(),
        App.session.name(),
        'Description',
        queries,
        function (data) {
          App.session.saved(true);
          App.Controller.Session.synchInternalIds(data);
          App.UI.session().saved(App.session.name());
          if (done != undefined)
            done();
          App.UI.state().synch.ready();
          App.UI.enable();
        },
        function (data) {
          console.log(data.responseText);
          if (fail != undefined)
            fail();
          App.UI.state().synch.fail();
          App.UI.enable();
        }
      );
    } else {
      App.Controller.Session.openSaveAs();
    }
  }
};

App.Controller.Session.list = function () {
  var $content = $('<div class="pn-list"></div>');
  $content.kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: App.config.server.url + '/session/list',
          data: {auth: App.account.auth}
        }
      }
    },
    sortable: {
      mode: 'single',
      allowUnsort: false
    },
    selectable: 'row',
    pageable: {
      pageSize: 5,
      messages: {
        display: '{0}/{1} sessions sur {2} au total'
      }
    },
    scrollable: true,
    resizable: true,
    columns: [
      {field: 'name', title: 'Session', width: 50},
      {field: 'createdBy', title: 'Créé par', width: 20},
      {field: 'creationDate', title: 'Créé le', width: 20},
      {field: 'lastEditionDate', title: 'Modifié le', width: 20},
    ]
  });
  return $content;
};

App.Controller.Session.compute = function (done, fail) {
  var computeFrom = function () {
    if (App.session.queries().length > 0) {
      App.Controller.Query.computeFrom(
              App.session.queries()[0],
              function () {
                App.session.computeOnTheFly(true);
                done();
              },
              fail
              );
    }
  }
  if (App.session.exclQuery() != null) {
    App.Controller.Query.compute(
            App.session.exclQuery(),
            function () {
              computeFrom();
            },
            function () {}
    );
  } else {
    computeFrom();
  }
};