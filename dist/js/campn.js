function uid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

function clone(srcInstance) {
  
    if(typeof(srcInstance) != 'object' || srcInstance == null){
        return srcInstance;
    }
    var newInstance = new srcInstance.constructor();
    for(var i in srcInstance) {
        newInstance[i] = clone(srcInstance[i]);
    }
    return newInstance;
}

$.fn.exists = function() {
    return this.length > 0;
}

$.fn.pos = function(w, px) {
    if (this.exists()) {
        if (px == null) {
            return parseInt($(this).css(w).toString().replace('px',''));
        } else {
            $(this).css(w, parseInt(px)+'px');    
            return this;
        }
    } else {
        return this;
    }
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
};

Array.prototype.unset = function(index){
    var output = this.slice(0,index);
    for (var i=index+1; i<this.length; i++) {
        output.push(this[i]);
    }
    return output;
}

Array.prototype.insert = function(index, value) {          
    var output = this.slice(0,index+1);
    output.push(value);
    /*output = output.concat(this.slice(index+1,this.length));
    return output;*/
    return output.concat(this.slice(index+1,this.length));
}

var UI = function() {};
UI.Dialog = function(title, $content, options, onValid, onCancel) {
        
    this._defaultOptions = {
        width: 500,
        actions: ['Close'],
        commands : {
            valid: {
                text: 'OK',
                icon: 'checkmark',
                enabled: true,
                display: true
            },
            cancel: {
                text: 'Annuler',
                icon: 'undo',
                enabled: true,
                display: true
            }
        }
    };
    
    var that = this;
    
    this._defaultOnCancel = function() {
        this.k().close();
    }
    
    this._title = title;
    this._$content = $content;
    this._onValid = onValid == undefined ? function(){} : onValid;
    this._onCancel = function() {
        if (onCancel != undefined) onCancel();
        that._defaultOnCancel();
    }
    
    
    this._options = options == undefined ? this._defaultOptions : options;
    
    this.getDefaultOption = function(name) {
        return this._options[name] == undefined ? this._defaultOptions[name] : options[name];
    }
    
    this._options['actions'] = this.getDefaultOption('actions');
    this._options['width'] = this.getDefaultOption('width');
    this._options['commands'] = this.getDefaultOption('commands');
    
    this.getCommandDefaultOption = function(command, name) {
        if (name == null) {
            return this._options.commands[command] == undefined
                   ? this._defaultOptions.commands[command]
                   : this._options.commands[command];
        } else {
            return this._options.commands[command][name] == undefined 
                   ? this._defaultOptions.commands[command][name]
                   : this._options.commands[command][name];
        }
    }
    
    this._options.commands.valid = this.getCommandDefaultOption('valid');
    this._options.commands.valid.text = this.getCommandDefaultOption('valid','text');
    this._options.commands.valid.icon = this.getCommandDefaultOption('valid','icon');
    this._options.commands.valid.enabled = this.getCommandDefaultOption('valid','enabled');
    this._options.commands.valid.display = this.getCommandDefaultOption('valid','display');
    
    this._options.commands.cancel = this.getCommandDefaultOption('cancel');
    this._options.commands.cancel.text = this.getCommandDefaultOption('cancel','text');
    this._options.commands.cancel.icon = this.getCommandDefaultOption('cancel','icon');
    this._options.commands.cancel.enabled = this.getCommandDefaultOption('cancel','enabled');
    this._options.commands.cancel.display = this.getCommandDefaultOption('cancel','display');
    
    this.$initValid = function(text, icon) {
        return $('<button id="pn-dialog-valid" class="k-button pn-button-valid"><i class="icon-'+icon+'"></i> '+text+'</button>');
    }
    
    this.$initCancel = function(text, icon) {
        return $('<button id="pn-dialog-cancel" class="k-button pn-button-cancel"><i class="icon-'+icon+'"></i> '+text+'</button>');
    }
    
    this._$e = $('<div class="pn-dialog"></div>');   
    
    var $content = $('<div class="pn-dialog-content"></div>');
    $content.append(this._$content);
    
    var $commands = $('<div class="pn-dialog-commands"></div>');
    var $valid = this.$initValid(this._options.commands.valid.text, this._options.commands.valid.icon);
    $valid.click(this._onValid);
    var $cancel = this.$initCancel(this._options.commands.cancel.text, this._options.commands.cancel.icon);
    $cancel.click(this._onCancel);
    $commands.append($valid).append($cancel);
        
    this._$e.append($content).append($commands);
    
       
    this._$e.kendoWindow({
        width: this._options.width+'px',
        title: this._title,
        visible: false,
        modal: true,
        close: function() { that.$e().parent().remove(); },
        actions: this._options.actions
    }).data('kendoWindow').center();    
    
    this.$e = function() {
        return this._$e;
    }
    
    this.k = function() {
        return this.$e().data('kendoWindow');
    }
    
    this.open = function() {
        this.k().open();
    };
    
    this.close = function() {
        this.k().close();
    };
    
    this.title = function(title) {
        if (title != null) {
            this._title = title;
            this.k().title(title);
            return this;
        } else {
            return this._title;
        }
    }
    
    this.$content = function() {
        return this.$e().children('.pn-dialog-content');
    }
    
    this.$commands = function() {
        return this.$e().children('.pn-dialog-commands');
    }
    
    this.$valid = function() {
        return this.$commands().children('#pn-dialog-valid');
    }
    
    this.$cancel = function() {
        return this.$commands().children('#pn-dialog-cancel');
    }
    
    this.enableButton = function(button, enable) {
        if (enable) button.removeAttr('disabled').removeClass('k-state-disabled');
               else button.attr('disabled', 'disabled').addClass('k-state-disabled');
    }
    
    this.enableValid = function(enable) {
        this.enableButton(this.$valid(), enable);
    }
    
    this.enableCancel = function(enable) {
        this.enableButton(this.$cancel(), enable);
    }
    
    this.displayButton = function(button, display) {
        button.css('display', display ? 'inline-block' : 'none');
    }
    
    this.displayValid = function(display) {
        this.displayButton(this.$valid(), display);
    }
    
    this.displayCancel = function(display) {
        this.displayButton(this.$cancel(), display);
    }
    
    this.onValid = function(onValid) {
        this._onValid = onValid;
        this.$valid().click(onValid);
    }
    
    this.onCancel = function(onCancel) {
        this._onCancel = onCancel;
        this.$cancel().click(onCancel);
    }
    
    this.displayValid(this._options.commands.valid.display);
    this.displayCancel(this._options.commands.cancel.display);
    
    this.enableValid(this._options.commands.valid.enabled);
    this.enableCancel(this._options.commands.cancel.enabled);
        
    this.valid = function(options) {
        var $valid = this.$initValid(options.text, options.icon);
        this.$valid().replaceWith($valid);
    }  
    
    this.cancel = function(options) {
        var $cancel = this.$initCancel(options.text, options.icon);
        this.$cancel().replaceWith($cancel);
        $cancel.click(this._onCancel);
    }
    
}



UI.Confirm = function(message, onValid, onCancel) {
    var confirm = new UI.Dialog(
        'Confirmation',
        $('<div class="pn-confirm-message">'+message+'</div>'),
        { commands : { valid:  { text: 'Oui' },
                       cancel: { text: 'Non' }
                     }
        }
    );
    confirm.onValid (function() {
        onValid();
        confirm.close();
    });
    confirm.onCancel (function() {
      (onCancel||function(){})();
    });
    return confirm;
};
UI.Alert = function(message, title) {
    var alert = new UI.Dialog(
      title || "Alerte",
      $('<div class="pn-confirm-message">'+message+'</div>'),
      {commands: {cancel: {display: false}, valid: {text: 'OK'}}}
    );
    alert.onValid (function() {
        alert.close();
    });
    return alert;
};
var App = function() {};

App.version = '0.1'; 
App.settings = {};

App.config = {
    server : {}    
};

App.loadSettings = function(settings) {   
    $.each (settings, function(group, value) {
       App.settings[group] = {};
       $.each (value, function(name, value) {
           App.settings[group][name] = (value == 'true' ? true : (value == 'false' ? false : value)); 
       });
    });
}

App.loadConfig = function(done) {
   $.getJSON('config.json', function(data) {
       App.config.server.url = data.server.url;
       App.config.server.port = data.server.port;
       done();
   });
}

App.login = function(auth, encrypted, done, fail) {
    App.Server.Auth.login (
        auth,
        encrypted,
        function(data) {
            App.account = { 
                username: data.username,
                company: data.company,
                auth: {}
            };
            App.loadSettings(data.settings);
            if (encrypted) App.account.auth.str = auth;
                      else App.account.auth = auth;
            App.account.auth.encrypted = encrypted;
            done(data);
        },
        function(data) {
            fail(data);
        }
    );
};

App.openAbout = function() {
    var $content = $('<div>campPN version 0.10<br/>Version du serveur : 0.12<br/>Copyright PNdata&reg; SAS 2013. Tous droits réservés.</div>');
    var dialog = new UI.Dialog('A propos de camPN', $content, { width: 400,
            commands: {
                valid: { text: 'Fermer' },
                cancel: { display: false }
            }
        }
    ,function() {
            dialog.close();
    });
    dialog.open();
};

App.css = function(page) {
    $('head').find('link.pn-css').each(function() {
        $(this).remove(); 
    });
    $('head').append('<link type="text/css" rel="stylesheet" class="pn-css" href="css/'+page+'.css"/>');
    //$('head').append('<link type="text/css" rel="stylesheet" media="print" class="pn-css" href="css/'+page+'-print.css"/>');       
};

App.render = function(page, done) {
    $('#'+page).load(page+'.html', function() {        
        done();
    });
};

App.start = function() {   
    App.loadConfig (function() {
        function start() {
            if (App.account == undefined) {
                $("body").addClass("login");
                App.render('login', function(){});
            } else {
                App.render('app', function() {
                    $('#login-button').text('Chargement...');
                    $('#account-username').text(App.account.username);
                    $('#account-company').text(App.account.company.name);
                    $('header').addClass('flex');
                    $('#content').addClass('flex');
                    App.DataModel.load(function() {                    
                        App.DataModel.init(function() {                
                            App.Controller.Session.new (
                                sessionId != '' ? sessionId : undefined,
                                function() {            
                                    App.UI.buildMenu();
                                    App.UI.buildShortcuts();
                                    $('#query-list').show().append('<li class="empty"><span class="query-label">Pas de requête</span></li>');
                                    App.UI.state().synch.ready();
                                    $('#query-list').sortable({
                                        placeholder: 'query-item-drag',
                                        items: '> li:not(.query-item-excl)',
                                        cursor: 'move',
                                        update: function(e,ui) {
                                            var id = ui.item.attr('data-id');
                                            var query = App.session.query(id);                                    
                                            var next = query.next();
                                            var initialIndex = App.session.queries().indexOf(App.session.query(id));
                                            var newQueries = [];
                                            $.each ($('#query-list').children('li').not('join'), function(i, item) {
                                                if (App.session.exclQuery() != null) {
                                                    if (App.session.exclQuery().id() != $(item).attr('data-id')) {
                                                        newQueries.push(App.session.query($(item).attr('data-id')));
                                                    }
                                                } else {
                                                    newQueries.push(App.session.query($(item).attr('data-id')));
                                                }
                                            });
                                            App.session._queries = newQueries;
                                            var currentIndex = App.session.queries().indexOf(App.session.query(id));
                                            if (App.session.computeOnTheFly()) {
                                                var queryToCompute = null ;
                                                if (currentIndex > initialIndex) { 
                                                    queryToCompute = next;
                                                } else if (currentIndex < initialIndex) {
                                                    queryToCompute = query;
                                                }
                                                if (queryToCompute != null) App.Controller.Query.computeFrom(queryToCompute, function(){}, function(){});
                                            }
                                        }
                                    }); 
                                    App.UI.loaded();
                                    $("body").removeClass("login");
                                    $('#login').fadeOut();
                                    $('#app').fadeIn();
                                }
                            );
                        });
                    });
                });
            }
        }    
        var url = $(location).attr('href');    
        var urlData = (url.indexOf('?') > 0 ? url.substr(url.indexOf('?')+1) : '').replace('#','');   
        if (urlData != '') {
            var tUrlData = urlData.split('.');
            var sessionId = tUrlData[0];
            var auth = tUrlData[1];
            App.login (
                auth,
                true,
                function() {
                    start();
                },
                function(){        
                }
            );
        } else {
            start();
        }
    
    });
    
}

App.UI = {
    loading: function() {
        $('body').append('<div id="app-loading">Chargement</div>');
    },
    loaded: function() {
        $('#app-loading').fadeOut('slow', function() {
            this.remove();
        });
        $('#app').show();
    }
}

App.UI.node = {
    save: { enabled: true, icon: 'upload-3', tooltip: 'Enregistrer en tant que modèle' },
    load: { enabled: true, icon: 'download-3', tooltip: 'Charger un modèle' },
    addCriterion : { enabled: true, icon: 'filter-2', tooltip: 'Ajouter un critère' },
    remove: { enabled: true, icon: 'minus', tooltip: 'Supprimer' },
    addNode: { enabled: true, icon: 'plus', tooltip: 'Ajouter un niveau' }
};

App.UI.query = {
    edit: { enabled: true, excl: true, icon: 'pencil', tooltip: 'Modifier', event: function() {
        App.Controller.Query.dialog(that); 
    }},
    remove: { enabled: true, excl: true, icon: 'minus', tooltip: 'Supprimer', event: function() {
        App.Controller.Query.remove(that);
    }},
    load: { enabled: true, excl: true, icon: 'download-3', tooltip: 'Charger un modèle', event: function() {
        that.openDialogLoad();
    }},
    save: { enabled: true, excl: true, icon: 'upload-3', tooltip: 'Enregistrer en tant que modèle', event: function() {
        App.Controller.Query.openSaveModel(that);
    }}
};

App.UI.shortcuts = [
    { value: 'save', text: 'Enregistrer', icon: 'disk', event: function() { App.Controller.Session.save(); } },
    { value: 'open', text: 'Ouvrir', icon: 'folder-open', event: function() { App.Controller.Session.open(); } },
    { value: 'new', text: 'Nouveau', icon: 'file-2', event: function() { App.Controller.Session.confirmNew(); }}
];
      

App.UI.buildShortcuts = function() {
    var $shortcuts = $("#shortcuts");
    $.each(App.UI.shortcuts, function(i, item) {
        var $item = $('<li><a href="#"><i class="icon-'+item.icon+'"></i></a></li>');
        $shortcuts.append($item);
        $item.on('click', item.event);
    });
    $('#exit').click(function() {
       App.Controller.Session.confirmExit(); 
    });
}

App.UI.menu = {
    file       : { isDefault: true, text: "Fichier", items: [
        { enabled: true, value: "new"         , text: "Nouveau"              , icon: "file-4"     , event: function() { App.Controller.Session.confirmNew(); }  },
        { enabled: true, value: "open"        , text: "Ouvrir"               , icon: "folder-open", event: function() { App.Controller.Session.open(); }        },
        { enabled: true, value: "save"        , text: "Enregistrer"          , icon: "upload-3"   , event: function() { App.Controller.Session.save(); }        },
        { enabled: true, value: "saveas"      , text: "Enregistrer sous"     , icon: "upload-3"   , event: function() { App.Controller.Session.openSaveAs(); }  },
        { enabled: true, value: "print"       , text: "Imprimer"             , icon: "print"      , event: function() { App.Controller.Session.openPrint(); }   },
        { enabled: true, value: "exit"        , text: "Quitter"              , icon: "switch"     , event: function() { App.Controller.Session.confirmExit(); } },
    ]}/*,
    edition    : { text: "Edition", items: [
        { enabled: true, value: "undo" , text: "Annuler" , icon: "undo-2" },  
        { enabled: true, value: "redo" , text: "Rétablir", icon: "redo"   }, 
        { enabled: true, value: "copy" , text: "Copier"  , icon: "copy-2" }, 
        { enabled: true, value: "cut"  , text: "Couper"  , icon: "cut"    }, 
        { enabled: true, value: "paste", text: "Coller"  , icon: "paste"  } 
    ]}*/,
    query      : { text: "Requêtage", items: [
        { enabled: true, value: "add"    , text: "Ajouter" , icon: "plus"  , event: function() {App.Controller.Query.dialog();} },
        { enabled: true, value: "play"   , text: "Lecture" , icon: "play-2"  , event: function() {
            App.Controller.Session.compute(function(){}, function(){});  
        }},  
        { enabled: true, value: "stop"   , text: "Arrêt"   , icon: "stop"  },
        //{ enabled: true, value: "report" , text: "Rapport Excel", icon: "file-excel", event: function() { App.Controller.Session.report();}},
        { enabled: true, value: 'createNodeModel', text: 'Modèles de noeud', icon: 'file', event: function() { App.Controller.Node.openCreateNodeModel(); } }
    ]},
    tools      : { text: "Outils", items: [
        { enabled: true, value: "database", text: "Dictionnaire de données", icon: "books"   , event: function() {
            App.DataModel.dialog('Base de données', function(){}, {
              commands:{
                valid: {display: false},
                cancel:{display:false}
              }});
          } },  
        { enabled: true, value: "settings", text: "Préférences"    , icon: "settings", event: function() { App.Controller.Session.openSettings();}   }
    ]},
    
    extraction: {
      text: "Extraction",
      items: [
        { enabled: true, value: "extract"  , text: "Extraire"  , icon: "upload-3"   , event: function() { App.Controller.Session.openExport(); } } ,  
        { enabled: true, value: "list"  , text: "Historique"  , icon: "history"   , event: function() { App.Controller.Session.openExtractionsList(); } } ,  
      ]
    }
  
  /*,
    nodenav    : { text: "Navigation", items: [
        { enabled: true, value: "parent"        , text: "Parent"               , icon: "arrow-left-3"       },  
        { enabled: true, value: "child"         , text: "Enfant"               , icon: "arrow-right-3"      },  
        { enabled: true, value: "olderBrother"  , text: "Frère aîné"           , icon: "arrow-up-3"         },  
        { enabled: true, value: "youngerBrother", text: "Frère cadet"          , icon: "arrow-down-3"       },  
        { enabled: true, value: "uncle"         , text: "Oncle"                , icon: "arrow-down-left-2"  },  
        { enabled: true, value: "olderChild"    , text: "Fils cadet"           , icon: "arrow-down-right-2" },  
        { enabled: true, value: "youngerChild"  , text: "Fils aîné"            , icon: "arrow-up-right-2"   },  
        { enabled: true, value: "uncle"         , text: "Oncle"                , icon: "arrow-up-left-2"    },  
        { enabled: true, value: "last"          , text: "Dernier de la branche", icon: "tab"                }
    ]},   
    display    : { text: "Affichage", items: [
        { enabled: true, value: "diagramMode", text: "Mode diagramme", icon: "share"    },  
        { enabled: true, value: "tableMode"  , text: "Mode tableau"  , icon: "table-2"  },  
        { enabled: true, value: "zoomOut"    , text: "Zoom -"        , icon: "zoomout"  },  
        { enabled: true, value: "zoomIn"     , text: "Zoom +"        , icon: "zoomin"   },  
        { enabled: true, value: "contrast"   , text: "Constraste"    , icon: "contrast" } 
    ]},  
    sendTo     : { text: "Envoyer vers", items: [
        { enabled: true, value: "email"   , text: "Email"       , icon: "mail-9"       }, 
        { enabled: true, value: "gdrive"  , text: "Google Drive", icon: "google-drive" }, 
        { enabled: true, value: "skydrive", text: "Skydrive"    , icon: "cloud-15"     }
    ]}*/,  
    help       : { text: "?", items: [
        { enabled: true, value: "help"    , text: "Aide"       , icon: "notebook"  }, 
        { enabled: true, value: "about"   , text: "A propos de", icon: "info"      , event: function() { App.openAbout() }}, 
        { enabled: true, value: "tutorial", text: "Tutorial"   , icon: "road" }
    ]}/*,  
    monitoring : { text: "Administration", items: [
        { value: "sessions", text: "Sessions"          , icon: "ftpsession"    },
        { value: "accounts", text: "Comptes"           , icon: "users-6"       }, 
        { value: "server"  , text: "Monitoring serveur", icon: "servers"       },
        { value: "config"  , text: "Configuration"     , icon: "cogs"          },
        { value: "logs"    , text: "Logs"              , icon: "rawaccesslogs" }
    ]}*/
}

App.UI.disable = function() {
    if (!$('#disable').exists()) {
        $('body').prepend('<div id="disable"></div>');   
    } 
}

App.UI.enable = function() {
    $('#disable').remove();
}

App.UI.error = function(message, details) {   
    var $content = message;
    var dialog = new UI.Dialog ('Erreur', $content, {width: 500}, function() {});
    dialog.open();
};

App.UI.state = function() {
    return {
        synch: {
            $e: $('#state-synch'),
            working: function() {
                this.$e.removeClass('state-error');
                this.$e.addClass('state-working');
                this.$e.children('.state-text').text('Synchronisation avec le serveur...');  
            },
            ready: function() {
                this.$e.removeClass('state-error').removeClass('state-working');  
                this.$e.children('.state-text').text('Prêt');  
            },
            fail: function() {
                this.$e.removeClass('state-ready');
                this.$e.removeClass('state-working');
                this.$e.addClass('state-error');          
                this.$e.children('.state-text').text('Echec de la synchronisation');
            }
        },
        save: {
            $e: $('#state-save'),
            saved: function(datetime) {
                this.$e.children('.state-text').text('Dernière sauvegarde le '+datetime);
            }
        }
    }
}

App.UI.buildMenu = function() {
    var $menu = $("#menu").addClass('flex');
    $.each(App.UI.menu, function(i, item) {
        //App.UI.menu[i] = {};
        var $item = $('<li '+(item.isDefault?'class="selected"':'')+'><a data-role="'+i+'" href="#">'+item.text+'</a></li>');
        $menu.append($item);
        var $submenu = $('<ul id="menu-'+i+'" class="submenu"></ul>').addClass('hide');
        $(item.items).each(function(j, subitem) {
            if (subitem.enabled) {
                var $subitem = $('<li><a href="#"><i class="icon-'+subitem.icon+'"></i><br/><span class="submenu-text">'+subitem.text+'</span></a></li>');
                $submenu.append($subitem);
                $subitem.on('click', subitem.event);
                //App.UI.menu[i][subitem.value] = $subitem;
            }
        });
        if (item.isDefault) $submenu.removeClass('hide').addClass('flex');
        $item.click(function() {
            $("#menu li").removeClass("selected");
            $(this).addClass("selected");
            $(".submenu").removeClass('flex').addClass('hide');
            $("#menu-"+i).removeClass('hide').addClass('flex');
        });
        $menu.after($submenu);
    });
}

App.UI.session = function() {
    return {
        $e: $('#session-name'),
        saved: function(name) {
            this.$e.text(name);
            this.$e.css('font-weight','bold');
            //App.UI.state().save.saved(datetime);
        },
        notSaved: function(name) {
            this.$e.text(name+'*');
            this.$e.css('font-weight','normal');
        }
    };
};

App.UI.error = function(message, details) {
    /*var $content = $('<p>'+message+'</p>');    
    $content.after('<p>'+details+'</p>');
    var dialog = new UI.Dialog('Erreur', $content, {
            width: 500,
            commands: {
                valid: { display: false },
                cancel: { text: 'Fermer' }
            }
        }, function(){}, function() {dialog.close()} );
    dialog.open();
    console.log(dialog.$e().closest('.k-window-titlebar'));*/
};
App.DataModel = function () {};

App.DataModel = {
  _mode: "default",
  _source: [],
  _attributes: [],
  _referentials: [],
  _requests: [],
  _links: [],
  _tree: null,
  _kTree: null,
  _key: null,
  _$e: null,
  schema: function () {
    return this._source;
  },
  _schemas: [],
  _mainSchema: null,
  _icons: {
    integer: 'calculator2', float: 'calculator2', amount: 'euro2', percent: 'percent',
    date: 'calendar-2', datetime: 'calendar-2', string: 'spell-check', boolean: 'checked-2'
  },
  hideEntire: function () {
    var kTree = this.kTree();
    kTree.items().each(function () {
      if (kTree.dataItem(this).element.dataType === "entiere") {
        $(this).hide();
        return false;
      }
    });
    return this;
  },
  root: function () {
    var kTree = this.kTree();
    var root;
    kTree.items().each(function () {
      if (kTree.dataItem(this).element.path === "") {
        root = $(this);
        return false;
      }
    });
    return root;
  },
  readElement: function (element, parentPath, cardinality) {
    var node = {text: null, encoded: false, element: {}}, i = 0, that = this;
    switch (element[0].nodeName) {
      case 'group':
        node.text = '<i class="icon-folder-open"></i> ' + element.attr('label');
        node.element.label = element.attr('label');
        node.element.desc = 'Groupe de variable \'' + node.element.label + '\'';
        node.element.type = 'group';
        node.element.name = element.attr('name');
        break;
      case 'link':
        node = that.read(element.attr('schema'), false, function () {}, element.attr('label'),
                parentPath + ((parentPath == '') ? '' : '/') + element.attr('name'), element.attr('cardinality'));
        node.element = {
          desc: 'Lien vers \'' + element.attr('label') + '\'',
          label: element.attr('label'),
          type: 'link',
          name: element.attr('name'),
          schema: element.attr('schema'),
          referential: element.attr('type') == undefined ? false : element.attr('type') == 'referential' ? true : false,
          hugeData: element.attr('hugeData') == undefined ? false : element.attr('hugeData') == 'true' ? true : false,
          /*path: parentPath+((parentPath=='')?'':'/')+element.attr('name'),*/
          keyName: element.children('join').attr('target'),
          linkCardinality: element.attr('cardinality')
        };
        if (node.element.referential) {
          var referentialAlreadyLoaded = false;
          $.each(that._referentials, function (i, schema) {
            if (schema.schema() == node.element.schema) {
              referentialAlreadyLoaded = true;
              return false;
            }
          });
          if (!referentialAlreadyLoaded) {
            var referential = new DataReferential(node.element.schema, node.element.keyName);
            //that._requests.push(referential.load());
            that._referentials.push(referential);
          }
          node.element['path'] = parentPath + ((parentPath == '') ? '' : '/') + '@' + element.children('join').attr('source');
        } else {
          node.element['path'] = parentPath + ((parentPath == '') ? '' : '/') + element.attr('name');
        }
        this._attributes.push(new Attribute(node.element));
        break;
      case 'attribute':
        var enums = [];
        node.element = {
          dataType: element.attr('type'),
          format: element.attr('format') == undefined ? null : element.attr('format'),
          label: element.attr('label'),
          path: parentPath + ((parentPath == '') ? '' : '/') + '@' + element.attr('name'),
          type: 'attribute',
          name: element.attr('name'),
          linkCardinality: cardinality,
          query: element.attr("query") === "false" ? false : true
        };
        node.element.desc = 'Variable \'' + node.element.label + '\' (' + node.element.path + ') de type \'' + node.element.dataType + '\'' + (node.element.format != null ? ' (format \'' + node.element.format + '\')' : '')
        node.text = element.attr('label');
        if (element.children("enum").length) {
          element.children("enum").children().each(function (i, v) {
            enums.push({value: $(v).attr("value"), label: $(v).attr("label") + " (" + $(v).attr("value") + ")"});
          });
          node.element.enum = enums;
        }
        var attr = new Attribute(node.element);
        this._attributes.push(attr);
        break;
    }
    if (element.children().not('join, enum').length > 0) {
      node.items = [];
      element.children().not('join').each(function () {
        if ($(this).attr('advanced') != 'true') {
          node.items[i] = that.readElement($(this), parentPath);
          i++;
        }
      });
    }
    return node;
  },
  load: function (done, fail) {
    var that = this;
    that._requests.push(App.Server.DataModel.load(
            function (data) {
              var schemas = $(data).find('schema');
              var root = $(data).find('schemas');
              that._mainSchema = root.attr('main');
              schemas.each(function (i, schema) {
                that._schemas[$(schema).attr('name')] = schema;
              });
              done();
            },
            function (data) {
            }
    ));
  },
  read: function (name, async, callback, label, path, cardinality) {
    var node, that = this;
    var schema = $(that._schemas[name]), i = 0;
    node = {
      text: '<i class="icon-' + (cardinality == 'multiple' ? 'tree' : 'books') + '"></i> ' + (label == undefined ? schema.attr('label') : label),
      encoded: false,
      expanded: path == undefined,
      items: [],
      element: {
        path: path == undefined ? '' : path,
        cardinality: cardinality == undefined ? null : cardinality,
        key: null
      }
    };
    schema.children().not('key').each(function () {
      if (!$(this).attr('advanced')) {
        node.items[i] = that.readElement($(this), node.element.path, node.element.cardinality);
        i++;
      }
      if ((i + 1) == schema.children().not('key').length) {
        if (callback != undefined)
          callback();
      }
    });
    node.element.key = schema.children('key').children('keyfield').attr('path');
    return node;
  },
  key: function () {
    return this._key;
  },
  init: function (callback) {
    var that = this;
    var main = this.read(this._mainSchema, true, function () {});
    this._key = main.element.key;
    var full = {
      text: '<i class="icon-stackoverflow"></i> Toute la base',
      encoded: false,
      element: {
        type: 'attribute',
        dataType: 'entiere',
        format: null,
        label: 'Toute la base',
        path: '@' + this.key(),
        name: 'entiere',
        linkCardinality: '????'
      }
    };
    this._attributes.push(new Attribute(full.element));
    this._source.push(full);
    this._source.push(main);
    var refData = [];
    $.each(this._referentials, function (i, referential) {
      refData.push({schema: referential.schema(), keyName: referential.keyName()});
    });
    App.Server.DataModel.data(
            refData,
            function (data) {
              $.each(data, function (name, ref) {
                that.referential(name).data(ref);
              });
              callback();
            },
            function (data) {
              console.log(data.responseText);
            }
    )
  },
  tree: function (options) {
    var options = _.defaults(options || {}, {
      dragAndDrop: false,
      hideQueryAttrs: false
    });
    var $content = $('<div class="datamodel"></div>');
    var $elementInfo = $('<div class="datamodel-element-info"><i class="icon-info-2"></i> <span class="datamodel-element-info-text"><span></div>');
    $content.append($elementInfo);
    var $tree = $('<div class="datamodel-tree"></div>');
    $tree.kendoTooltip({
      filter: 'a.info',
      width: 120,
      position: 'top'
    });
    this._tree = $tree.kendoTreeView({
      dragAndDrop: options.dragAndDrop,
      dataSource: this._source,
      dataBound: function(e) {
        $tree.find(".k-item").each(function(i, item) {
          var dataItem = $tree.data("kendoTreeView").dataItem(item);
          if(dataItem.element.type === "attribute") {
            if(options.hideQueryAttrs) {
              $(item).toggle(dataItem.element.query);
            }
          }
        });
      },
      select: function (e) {
        var element = this.dataItem(e.node).element;
        $elementInfo.children('.datamodel-element-info-text').text(element.desc);
      }
    });
    this._kTree = $tree.data('kendoTreeView');
    $content.append($tree);
    this._$e = $content;
    return $content;
  },
  kTree: function () {
    return this._kTree;
  },
  dialog: function (title, callback, options) {
    var that = this;
    var dialog = new UI.Dialog('Modèle de données', this.tree(options), _.extend({width: 600}, options), function () {
      if(that.kTree().select().length) {
        callback(new Attribute(that.kTree().dataItem(that.kTree().select()).element));
      }
      //if(dialog) dialog.close();
    });
    dialog.title(title);
    dialog.open();
    this._tree.find('.k-item').children('div').children('span').dblclick(function () {
      callback(new Attribute(that.kTree().dataItem(that.kTree().select()).element));
      //dialog.close();
    });
    return dialog;
  },
  attribute: function (path) {
    var attribute = null;
    //if (path.indexOf('/') == -1) {
    $.each(this._attributes, function (i, attr) {
      if (attr.path() == path) {
        attribute = attr;
        return false;
      }
    });
    //}
    return attribute;
  },
  attributeByName: function (name) {
    var attribute = null;
    //if (path.indexOf('/') == -1) {
    $.each(this._attributes, function (i, attr) {
      if (attr.name() == name) {
        attribute = attr;
        return false;
      }
    });
    //}
    return attribute;
  },
  link: function (path) {
    var link = null;
    $.each(this._links, function (i, link2) {
      if (link2.path == path) {
        link = link2;
        return false;
      }
    });
    return link;
  },
  referential: function (name) {
    var referential = null;
    $.each(this._referentials, function (i, ref) {
      if (ref.schema() == name) {
        referential = ref;
        return false;
      }
    });
    return referential;
  }

};

function DataReferential(schema, keyName) {

    this._schema = schema;
    this._keyName = keyName;
    this._data = [];
    this._loaded = false;
    
    this.schema = function(schema) {
        if (schema != null) { this._schema = schema; return this; }
        else { return this._schema; }
    };
    
    this.keyName = function(keyName) {
        if (keyName != null) { this._keyName = keyName; return this; }
        else { return this._keyName; }
    };
    
    this.data = function(data) {
        if (data != null) { this._data = data; return this; }
        else { return this._data; }
    };
    
    this.loaded = function(loaded) {
        if (loaded != null) { this._loaded = loaded; return this; }
        else { return this._loaded; }
    };
    
    this.load = function() {
        var that = this;
        return App.Server.get(
            '/schema/'+this.schema()+'/data',
            {data: { keyName: keyName }},
            function(data) {
                that.loaded(true);
                that.data(data);
            }
        );        
    };
    
    this.row = function(id) {
        var that = this;
        var value = null;
        $.each (this.data(), function(i, row) {
            if (row.v == id) {
                value = row
                return false;
            }
        });        
        return value;
    }
    
};
App.Plugin = function() {};

App.Plugin.load = function(plugin) {
    
    var theParent = parent;
        
    if (plugin.data.mode != 'free') {
        
        var disabledMenuItems = {
            file: ['new', 'open', 'save', 'saveas', 'close', 'exit'],
            query: ['add']
        };    

        var addedMenuItems = {
            file: []
        };

        var disabledQueryCommands = ['copy', 'save', 'edit', 'remove'];
        var disabledNodeCommands = ['save'];

        //$('#query-list').sortable('disable');

        switch (plugin.data.mode) {   
            
            case 'targetEdition':
                addedMenuItems.file.push({
                    enabled: true,
                    value: 'finished',
                    text: 'Enregistrer',
                    icon: 'checkmark',
                    event: function() {
                        App.Controller.Session.save (function(){}, function(){});
                        App.Plugin.Pnmanager.saveTarget(function(){}, function(){});
                    }
                });
                break;
            
            case 'targetModelEdition':
                addedMenuItems.file.push({
                    enabled: true,
                    value: 'finished',
                    text: 'Enregistrer',
                    icon: 'checkmark',
                    event: function() {
                        App.Controller.Session.save (function(){}, function(){});
                        App.Plugin.Pnmanager.saveTargetModel(function(){}, function(){});
                    }
                });
                break;    
            
            case 'campaignExclusionEdition':
                addedMenuItems.file.push({
                    enabled: true,
                    value: 'finished',
                    text: 'Enregistrer',
                    icon: 'checkmark',
                    event: function() {
                        App.Controller.Session.save (function() {
                            App.Plugin.Pnmanager.saveCampaign(function(){});
                        },
                        function(){});
                    }
                });
                break;     
            
            case 'campaignExtraction':
                addedMenuItems.file.push({
                    enabled: true,
                    value: "extraction",
                    text: "Lancer l'extraction",
                    icon: "box-remove",
                    event: function() {
                        App.Plugin.Pnmanager.openExtraction();
                    }
                });
                disabledQueryCommands = disabledQueryCommands.concat(['load']);
                disabledNodeCommands = disabledNodeCommands.concat(['copy', 'load', 'addCriterion', 'edit', 'remove', 'addNode']);
                break; 
            
        }     

        $.each (App.UI.menu.file.items, function(i, item) {
           if ($.inArray(item.value, disabledMenuItems.file) > -1) {
               item.enabled = false;
           }
        });

        $.each (App.UI.menu.query.items, function(i, item) {
           if ($.inArray(item.value, disabledMenuItems.query) > -1) {
               item.enabled = false;
           }
        });

        $.each (App.UI.query, function(name, command) {
           if ($.inArray(name, disabledQueryCommands) > -1) {
               command.enabled = false;
           }
        });

        $.each (App.UI.node, function(name, command) {
           if ($.inArray(name, disabledNodeCommands) > -1) {
               command.enabled = false;
           }
        });

        $.each (addedMenuItems.file, function(i, item) {
           App.UI.menu.file.items.push(item);
        });
        
    }
    
};

App.Plugin.Pnmanager = function() {};

App.Plugin.Pnmanager.openExtraction = function() {
    var $content = $('<div class="pnmanager-extract"></div>');
    var $setlimit = $('<div class="pnmanager-extract-text">Saisir la quantité voulue pour chaque cible :</div>').hide();
    var $inputs = [];
    var $gettable = function() {
        var $table = $('<table class="pnmanager-query-list"></table>').hide();
        $.each (App.session.queries(), function(i, query) {
            if (!query.excl()) {
                var $input = $('<input class="pnmanager-extract-limit" id="pnmanager-extract-limit-'+query.id()+'" data-id="'+query.id()+'"/>');
                var $row = $('<tr></tr>');
                var $cellQuery = $('<td></td>');  
                var $cellInput = $('<td></td>');  
                var $query = query.$listItem().children('.query-details').clone();
                $query.children('.query-progressbar').remove();
                $query.children('.query-popcount').children('span')
                        .text($.formatNumber(query.popcount(),{format:"#,##0",locale:"fr"}))
                        .removeAttr('style').removeClass();
                $cellQuery.append($query);
                $cellInput.append($input);
                $row.append($cellQuery).append($cellInput);
                $table.append($row);
                query.limit(query.popcount());
                $input.kendoNumericTextBox({
                    format: '#',
                    step: 1,
                    min: 1,
                    max: query.popcount(),
                    decimals: 0,
                    value: query.popcount(),
                    change: function(e) {
                        query.limit($input.data('kendoNumericTextBox').value());
                    }
                });
                $inputs.push($input);
            } 
        });
        return $table;
    };
    if (!App.session.queriesComputed()) {
        var $text = $('<div class="pnmanager-extract-text"><div class="loading"></div>Calcul des requêtes...</div>');
        $content.append($text);
        App.Controller.Session.compute(
            function() {
                $text.fadeOut(function() {
                    var $table = $gettable();
                    $(this).replaceWith($table);
                    $table.before($setlimit.show());
                    $table.fadeIn();
                    dialog.enableValid(true);
                });                
           },
           function() {
           }
        );
    } else {
        var $table = $gettable();
        $table.before($setlimit.show());
        $content.append($setlimit.show()).append($gettable().show());
    }
    var dialog = new UI.Dialog(
        'Extraction',
        $content,
        {
            width: 500,
            commands: {
                valid: {
                    enabled: false
                }
            }
        },
        function() {
            dialog.enableValid(false);
            $($inputs).each(function(i) {
                $(this).data('kendoNumericTextBox').enable(false);
            });
            $content.find('.pnmanager-extract-text').html('<div class="loading"></div>Extraction en cours... <span id="pnmanager-extraction-progress">0%</span>');
            App.Plugin.Pnmanager.clearExtraction (
                function() {
                    App.Plugin.Pnmanager.extract (
                        function() {
                            $content.find('.pnmanager-extract-text').html('<i class="icon-checkmark"></i> Extraction terminée')
                                                                    .addClass('message-success');
                            $('#pnmanager-extraction-progress').remove();
                            clearTimeout(checkId);
                            dialog.displayValid(false);
                            dialog.cancel({ text: 'Fermer', icon:'close' });
                        },
                        function(data) {
                        }
                    );
                    var checkId = null;
                    var check = function() {
                        App.Plugin.Pnmanager.checkExtraction (
                            function(data) {
                                var $progress = $('#pnmanager-extraction-progress');
                                $progress.text(data+'%');
                                checkId = setTimeout(check, 5000);
                            },
                            function(data) {
                            }
                        );
                    }
                    check();
                },
                function(){}
            );
        },
        function() {
        }
    );            
    if (App.session.queriesComputed()) {
        dialog.enableValid(true);
    }
    dialog.open();
};


App.Plugin.Pnmanager.saveCampaign = function(done, fail) {
    var data = {
        id: App.session.exclQuery().internalId(),
        campaignId: App.session.plugin().data.campaign.id
    };
    App.Server.get('/pnmanager/campaign/save', {data: data}, done, fail);
};

App.Plugin.Pnmanager.saveTarget = function(done, fail) {
    var data = {
        id: App.session.queries()[0].internalId(),
        targetId: App.session.plugin().data.campaign.targets[0].id,
        campaignId: App.session.plugin().data.campaign.id
    };
    App.Server.get('/pnmanager/target/save', {data: data}, done, fail);    
};

App.Plugin.Pnmanager.saveTargetModel = function(done, fail) {
    var data = {
        id: App.session.queries()[0].internalId(),
        targetId: App.session.plugin().data.campaign.targets[0].id
    };
    App.Server.get('/pnmanager/targetModel/save', {data: data}, done, fail);
};

App.Plugin.Pnmanager.checkExtraction = function(done, fail) {
    var data = { id: App.session.id(), targets: [] };
    $.each (App.session.queries(), function(i, query) {
        data.targets.push({
            internalId: query.internalId(),
            id: query.id(),
            limit: query.limit()
        });
    });
    App.Server.get('/pnmanager/campaign/checkExtraction', {data: data}, 
        function(data) {
            done(data);
        },
        function(data) {
            fail(data);
        }
    );
};

App.Plugin.Pnmanager.clearExtraction = function(done, fail) {    
    var data = { id: App.session.id() };
    App.Server.get('/pnmanager/campaign/clearExtraction', {data: data}, 
        function() {
            done();
        },
        function() {
            fail();
        }
    );
};

App.Plugin.Pnmanager.extract = function(done, fail) {    
    var data = { id: App.session.id(), targets: [] };
    $.each (App.session.queries(), function(i, query) {
        data.targets.push({
            internalId: query.internalId(),
            id: query.id(),
            limit: query.limit()
        });
    });
    App.Server.get('/pnmanager/campaign/extract', {data: data}, 
        function() {
            done();
        },
        function() {
            fail();
        }
    );
};
App.Server = function() {};
    
App.Server.get = function(command, data, done, fail) {
    if (App.account != undefined) data['auth'] = App.account.auth;
    return $.get(App.config.server.url + command, data, null, 'json').done(done).fail(fail);
}
    
App.Server.post = function(command, data, done, fail) {   
    if (App.account != undefined) data['auth'] = App.account.auth;
    return $.post(App.config.server.url + command, data, null, 'json').done(done).fail(fail);
}


App.Server.Session = function() {};

App.Server.Session.init = function(username, password, mode, callback) {
  return App.Server.post('/session/init', {username: username, password: password, mode: mode}, callback);
};

App.Server.Session.load = function(id, done, fail) {
  return App.Server.get('/session/load', { data: { id: id }}, done, fail);
};

App.Server.Session.save = function(id, name, desc, queries, done, fail) {
  return App.Server.post('/session/save', { id: id, name: name, desc: desc, queries: queries }, done, fail);
};

App.Server.Session.delete = function(id, done, fail) {
  return App.Server.post('/session/delete', { id: id }, done, fail);
};

App.Server.Session.list = function(session, status, done, fail) {
  return App.Server.get('/session/list', { data: { token: session.token(), status: status } }, done, fail);
};

App.Server.Session.export = function(params, paths, queries, done, fail) {
  return App.Server.get('/export/execute', { data: { params: params, paths: paths, queries: queries } }, done, fail);
};

App.Server.Session.exportDl = function(file, done, fail) {
  return App.Server.get('/export.txt', { data: { file: file } }, done, fail);
};

App.Server.Session.saveSettings = function(settings, done, fail) {
  return App.Server.post('/settings/save', { data: settings }, done, fail);
};

App.Server.Session.loadSettings = function(done, fail) {
  return App.Server.get('/settings/load', { data: {} }, done, fail);
};
App.Server.Query = function() {};

App.Server.Query.create = function(session, query, done, fail) {
    App.Server.post('/query/create', { token: session.token(), label: query.label() }, done, fail);
};

App.Server.Query.compute = function(query, includeNodes, excludeQueries, done, fail) {
    App.Server.post('/query/compute', { data:{
        query: query,
        includeNodes: includeNodes,
        excludeQueries: excludeQueries
    }}, done, fail);
};

App.Server.Query.saveModel = function(id, label, excl, nodes, done, fail) {
    App.Server.post('/query/model/save', { id: id, label: label, excl: excl, nodes: nodes }, done, fail);
};

App.Server.Query.loadModel = function(id, done, fail) {
    App.Server.get('/query/model/load', { id: id }, done, fail);
};
App.Server.Node = function() {};

App.Server.Node.deleteModel = function(id, done, fail) {
    App.Server.post('/node/model/delete', { id: id }, done, fail);
};

App.Server.Node.saveModel = function(id, label, criteria, done, fail) {
    App.Server.post('/node/model/save', { id: id, label: label, criteria: criteria }, done, fail);
};

App.Server.Node.loadModel = function(id, done, fail) {
    App.Server.get('/node/model/load', { id: id }, done, fail);
};

App.Server.Node.compute = function(node, includeNodes, excludeNodes, done, fail) {
    App.Server.post('/node/compute', { data: {
            node: node,
            includeNodes: includeNodes,
            excludeNodes: excludeNodes
    }}, done, fail);
};
App.Server.Criterion = {
  
  file: function (data, done, fail) {
    data.append("auth", JSON.stringify(App.account.auth));
    return $.ajax({
      url: App.config.server.url + "/criterion/file",
      type: 'POST',
      processData: false,
      contentType: false,
      dataType: 'json',
      data: data
    });
  },
  
  compute: function (criterion, done, fail) {
    App.Server.get("/criterion/compute", {data: criterion}, done, fail);
  }

};

App.Server.DataModel = function() {};

/*App.Server.DataModel.load = function(session, name, done) {
    App.Server.get('/schema/'+name+'/load', null, done);
}*/

App.Server.DataModel.row = function(schema, id, done) {
    App.Server.get('/schema/'+schema+'/row', {id: id}, done);
}

App.Server.DataModel.load = function(done, fail) {
    return $.ajax({
        url: App.config.server.url+'/schema/load',
        data: {auth: App.account.auth }
    }).done(done).fail(fail);
}

App.Server.DataModel.data = function(data, done, fail) {
    return $.ajax({
        url: App.config.server.url+'/schema/data',
        data: {auth: App.account.auth, data: data }
    }).done(done).fail(fail);
}
App.Server.Auth = {};

App.Server.Auth.login = function(auth, encrypted, done, fail) {
    App.Server.get('/login', { data: {
        auth: auth,
        encrypted: encrypted
    }}, done, fail);
}
App.Controller = function() {};

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
          if(val === null) {
            return '?';
          } else {
            return numeral(val).format("0,0").replace(/,/g, ' ');
          }
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
        var msgBox = new UI.Alert(that.model.get("description") || "Toute la base", "Requête de sélection");
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
App.Controller.Query = function() {};

App.Controller.Query.disable = function(query) {
    query.disableCommands();
    $.each(query.nodes(), function(i, node) {
        node.disableCommands(); 
    });
};

App.Controller.Query.enable = function(query) {
    query.enableCommands();
    $.each(query.nodes(), function(i, node) {
        node.enableCommands(); 
    });
};

App.Controller.Query.confirmLoadModel = function(title, callback) {
    var $content = '<div>Le contenu de la cible sera perdu, êtes-vous sûr de vouloir continuer ?</div>';
    var dialog = new UI.Dialog(title, $content, {
            width: 800,
            commands: {
                valid: { text: 'Oui' },
                cancel: { text: 'Non' }
            }
        },
        function() {
            dialog.close();
            callback();
        }
    );
    dialog.open();
};     

App.Controller.Query.modelsList = function(callback) {
    var $content = $('<div class="pn-list"></div>');   
    $content.kendoGrid({
        change: function(e) {
            if (callback != undefined) callback(e);
        },
        dataSource: { transport: { read: { url: App.config.server.url + '/query/model/list',
                                   data: { auth: App.account.auth } } }
        },
        sortable: { mode: 'single', allowUnsort: false },
        selectable: 'row', scrollable: true, resizable: true,
        /*pageable: {
          pageSize: 5,
          messages: {
            display: '{0}/{1} sessions sur {2} au total'
          }
        },*/
        columns: [
            { field: 'label', title: 'Modèle', width: 50 },
            { field: 'excl', title: 'Exclusion', width: 15 },
            { field: 'createdBy', title: 'Créé par', width: 15 },
            { field: 'creationDate', title: 'Créé le', width: 30 },
            { field: 'lastEditionDate', title: 'Modifié le', width: 30 },
        ]
    });
    return $content;
};

App.Controller.Query.openModelList = function(title, callback) {
    var $content = $('<div class="pn-form"></div>');
    var $list = App.Controller.Query.modelsList();
    $content.append($list);
    var dialog = new UI.Dialog(title, $content, { width: 800 }, function() {
        var kGrid = $list.data('kendoGrid');
        var item = kGrid.dataItem(kGrid.select());     
        callback(item);
        dialog.close();
    });
    dialog.open();
};

App.Controller.Query.openLoadModel = function(query) {var load = function(data) {
        App.UI.state().synch.working();
        App.UI.disable();
        App.Server.Query.loadModel (
            data.id,
            function(data) {   
                var nodes = JSON.parse(data.nodes);
                $.each(nodes, function(j, node_data) {
                    var parent = node_data.parent == '' ? null : node_data.parent;
                    var children = node_data.children == '' ? null : node_data.children;
                    var criteria = node_data.criteria == '' ? null : node_data.criteria;
                    node_data.parent = null;
                    node_data.children = [];   
                    node_data.criteria = [];
                    var node = query.addNode(new Node(node_data));
                    node.query(query);
                    if (parent != null) {
                        node.parent(query.node(parent)); 
                        query.node(parent).children().push(node);
                    }            
                    node.render();  
                    if (criteria != null) {
                        $.each(criteria, function(k, criterion) {
                            var crit_data = {
                                id: criterion.id,
                                operator: criterion.operator != '' ? new Operator(criterion.operator) : null,
                                operation: criterion.operation != '' ? new Operation(criterion.operation) : null,
                                typeFunction: criterion.typeFunction != '' ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                                attribute: App.DataModel.attribute(criterion.path),
                                value: criterion.value != '' ? criterion.value : null,
                                entiere: criterion.entiere == 'true' ? true : false
                            };
                            var criterion = new Criterion(crit_data);
                            node.addCriterion(criterion);
                            criterion.render();
                        });
                    }
                });                
                if (App.session.computeOnTheFly()) {
                    App.Controller.Query.computeFrom (query, function(){}, function(){});  
                }
            },
            function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
            }
        );
    };
    
    App.Controller.Query.openModelList ('Charger un modèle', function(data) {  
        if (query.nodes().length > 0) {
            App.Controller.Query.confirmLoadModel('Confirmation du chargement du modèle', function() {
                query.$tree().empty();
                query._nodes = [];
                load(data);
            });
        } else {
            load(data);
        }        
    });
    
};


App.Controller.Query.saveModel = function(query, done, fail) {
    var nodes = [];
    $.each (query.nodes(), function(i, node) {
        nodes.push(node.toJSON());
    });
    App.Server.Query.saveModel (
        query.internalId(),
        query.label(),
        query.excl(),
        nodes,
        function(data) {
            done(data);
        },
        function(data) {
            fail(data);
        }        
    );
};

App.Controller.Query.openSaveModel = function(query) {
    var $content = $('<div class="pn-form"></div>');
    var $wrap = $('<div class="pn-form-input-wrap"></div>');
    var $label = $('<label for="query-model-name">Nom</label>');
    var $input = $('<input id="query-model-name" class="k-textbox"/>');
    $input.val(query.label());
    $wrap.append($label).append($input);
    $content.append($wrap);
     var dialog = new UI.Dialog('Enregistrer en tant que modèle', $content, { width: 500 }, function() {   
         query.label($input.val());
         App.UI.state().synch.working();
         App.UI.disable();
         App.Controller.Query.saveModel(
             query,
             function() {
                App.UI.state().synch.ready();        
                App.UI.enable();
             },
             function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
             }
         );
         dialog.close();
    });
    dialog.$valid().text('Enregistrer');
    dialog.open();
};

App.Controller.Query.load = function(data) {
    var query = new Query({
        id: uid(),
        internalId: data.id,
        label:data.label,
        excl:data.excl,
        exclusivity: data.exclusivity,
        useExclusion: data.useExclusion,
        nodes:[]
    });
    if (data.excl) {
        App.session.exclQuery(query);
    } else {      
        App.session.addQuery(query);
    }    
    query.render(false);
    if (data.data == null) {
        App.Controller.Node.add(query, null);          
    } else {
        var nodes = JSON.parse(data.data);
        $.each(nodes, function(j, node_data) {
            var parent = node_data.parent == '' ? null : node_data.parent;
            var children = node_data.children == '' ? null : node_data.children;
            var criteria = node_data.criteria == '' ? null : node_data.criteria;
            node_data.parent = null;
            node_data.children = [];   
            node_data.criteria = [];
            var node = query.addNode(new Node(node_data));
            node.query(query);
            if (parent != null) {
                node.parent(query.node(parent)); 
                query.node(parent).children().push(node);
            }            
            node.render();  
            if (criteria != null) {
                $.each(criteria, function(k, criterion) {
                    var crit_data = {
                        id: criterion.id,
                        operator: criterion.operator != '' ? new Operator(criterion.operator) : null,
                        operation: criterion.operation != '' ? new Operation(criterion.operation) : null,
                        typeFunction: criterion.typeFunction != '' ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                        attribute: App.DataModel.attribute(criterion.path),
                        value: criterion.value != '' ? criterion.value : null,
                        entiere: criterion.entiere == 'true' ? true : false
                    };
                    var criterion = new Criterion(crit_data);
                    node.addCriterion(criterion);
                    criterion.render();
                });
            }
        });
    }
};

App.Controller.Query.dialog = function(query) {    
    var previousName = null;    
    var $content = $('<div class="pn-form"></div>');
    var $nameWrap = $('<div class="pn-form-input-wrap"></div>');
    var $nameLabel = $('<label for="query-name">Nom / Code Action</label>');
    var $nameInput= $('<input id="query-name" class="k-textbox"/>').val(query != null ? query.label() : 'Cible '+(App.session.queries().length+1));
    var $descWrap = $('<div class="pn-form-input-wrap"></div>');
    var $descLabel = $('<label for="query-desc">Description</label>');
    var $descInput= $('<textarea rows="10" id="query-desc" class="k-textbox"></textarea>');
    
    var $exclusionTypeWrap = $('<div class="pn-form-input-wrap"></div>');
    var $exclusionTypeLabel = $('<label for="query-exclusionType">Exclusion</label>');
    var $exclusionTypeInput= $('<input type="checkbox" id="query-exclusionType"/>').css('width', 'inherit');
    $nameWrap.append($nameLabel).append($nameInput);
    $descWrap.append($descLabel).append($descInput);
    $exclusionTypeWrap.append($exclusionTypeLabel).append($exclusionTypeInput);
    $exclusionTypeInput.on("change", function() {
      if($(this).prop("checked")) {
        previousName = $nameInput.val();
        $nameInput.val("Exclusion");
      } else {
        $nameInput.val(query ? query.label() : 'Cible '+(App.session.queries().length+1));
      }
    });
    
    var $exclusivityWrap = $('<div class="pn-form-input-wrap"></div>');
    var $exclusivityLabel = $('<label for="query-exclusivity">Exclusivité avec les cibles précédentes</label>');
    var $exclusivityInput= $('<input type="checkbox" id="query-exclusivity"/>').css('width', 'inherit').attr('checked', true);
    $exclusivityWrap.append($exclusivityLabel).append($exclusivityInput);

    var $useExclusionWrap = $('<div class="pn-form-input-wrap"></div>');
    var $useExclusionLabel = $('<label for="query-useExclusion">Utiliser l\'exclusion</label>');
    var $useExclusionInput= $('<input type="checkbox" id="query-useExclusion"/>').css('width', 'inherit').attr('checked', true);
    $useExclusionWrap.append($useExclusionLabel).append($useExclusionInput);  

    $content.append($nameWrap).append($descWrap).append($exclusionTypeWrap).append($exclusivityWrap).append($useExclusionWrap);
          
    if (query != null) {
        if (query.excl()) {
            $exclusionTypeInput.attr('checked',true);
            $exclusivityWrap.hide();
            $useExclusionWrap.hide();
        } else {
            $exclusivityInput.attr('checked', query.exclusivity());
            $useExclusionInput.attr('checked', query.useExclusion());
        }
    } else {
        $exclusivityInput.attr('checked', true);
        $useExclusionInput.attr('checked', true);
    }
    
    if (App.session.exclQueryExists()) {
        if ((query != null && query.excl()===false) || query ==null) {
            $exclusionTypeLabel.addClass('disabled');
            $exclusionTypeInput.attr('disabled','disabled');
        }
    }
        
    $exclusionTypeInput.click(function() {
        if ($(this).is(':checked')) {
            $exclusivityWrap.hide();
            $useExclusionWrap.hide();
        } else {
            $exclusivityWrap.show();
            $useExclusionWrap.show();            
        }
    });
    
    var dialog = new UI.Dialog(query!=null?query.label():'Nouvelle cible', $content, { width: 800 }, function() {
        
        if (query != null) {
            
            if ($exclusionTypeInput.is(':checked')) {
                if (!query.excl()) {
                    App.session._queries = App.session.queries().unset(App.session.queries().indexOf(query));
                    query.excl(true);
                    App.session.exclQuery(query);
                }
            } else {                
                if (query.excl()) {
                    App.session._exclQuery = null;                    
                } else {
                    var setConfig = function() {
                        query.exclusivity($exclusivityInput.is(':checked'));
                        query.useExclusion($useExclusionInput.is(':checked'));
                    };
                    if (   (query.exclusivity() != $exclusivityInput.is(':checked')
                        || query.useExclusion() != $useExclusionInput.is(':checked'))
                        && App.session.computeOnTheFly()
                    ) {
                        setConfig();
                        App.Controller.Query.computeFrom(query, function(){}, function(){});
                    } else {
                        setConfig();
                    }
                }
            }
            
            /*
            if (query.excl()) {
                var queryToComputeFrom = App.session.queries()[0];
                App.session._exclQuery = null;
            } else {
                var queryToComputeFrom = query.next();
                App.session._queries = App.session.queries().unset(App.session.queries().indexOf(query));
            }*/
            
            query.label($nameInput.val()).desc($descInput.val()).excl($exclusionTypeInput.is(':checked')).updateLabel();
           if (query.excl()) query.$toExcl();
                        else query.$toDefault();
                        
        } else {
            App.Controller.Query.add(
                $nameInput.val(),
                $descInput.val(),
                $exclusionTypeInput.is(':checked'),
                $exclusivityInput.is(':checked'),
                $useExclusionInput.is(':checked')
            );
        }        
        
        dialog.close();
    });
    dialog.open();
};

App.Controller.Query.remove = function(query) {
    var confirm = new UI.Confirm (
        'Etes-vous de vouloir supprimer la cible \''+query.label()+'\' ?',
        function() {
            query.remove();
            var queryToComputeFrom = null;
            if (query.excl()) {
                var queryToComputeFrom = App.session.queries()[0];
                App.session._exclQuery = null;
            } else {
                var queryToComputeFrom = query.next();
                App.session._queries = App.session.queries().unset(App.session.queries().indexOf(query));
            }
            if (query.excl()) {
                if (App.session.computeOnTheFly() && App.session.queries().length > 0) {
                    App.Controller.Query.computeFrom(queryToComputeFrom, function(){}, function(){});
                }
            } else {
                if (App.session.computeOnTheFly() && queryToComputeFrom != null) {
                    App.Controller.Query.computeFrom(queryToComputeFrom, function(){}, function(){});
                }
            }
        },
        function() {    
        }
    );
    confirm.open();
};

App.Controller.Query.add = function(label, desc, excl, exclusivity, useExclusion) {
    var query = new Query({
        id: uid(),
        label: label,
        desc: desc,
        excl: excl,
        exclusivity: exclusivity,
        useExclusion: useExclusion,
        popcount: null,
        nodes: []
    });
    if (excl) {
        App.session.exclQuery(query);
    } else {        
        App.session.addQuery(query);
    }
    query.render (null, function() {
        query.select();
    });
    App.Controller.Node.add(query, null);  
};




App.Controller.Query.computeNodes = function(query, done, fail) {
    App.Controller.Node.computeFrom(
        query.mainNode(),
        function(data) {
            done(data);
        },
        function(data) {
            fail(data);
        }
    );
};

App.Controller.Query.computeFrom = function(query, done, fail) {
    App.Controller.Session.disableQueryCommands();
    App.Controller.Query.compute(
        query,
        function(data) {
            if (query.hasNext()) {
                App.Controller.Query.computeFrom(query.next(), function(){done(data);}, function(){});
            } else if (query.excl()) {
                if (App.session.queries().length > 0) {
                    App.Controller.Query.computeFrom(App.session.queries()[0], function(){done(data);}, function(){});
                }
            }
            if (!query.hasNext()) {
                done(data);
                App.Controller.Session.enableQueryCommands();
            }
        },
        function(data) {
            fail(data);
        }
    );
};

App.Controller.Query.compute = function(query, done, fail) {
    query.disableCommand('edit').disableCommand('remove');
    var queryCompute = function() {
        query.compute (
            function(data) {
                computedCount++;
                query.progress(Math.floor(computedCount*100/totalCount));                                
                query.updatePopcount(function() {
                    query.hideProgressbar().resetProgress();
                });
                done(data);
            },
            function(data) {    
                console.log(data.responseText);
                if (fail != undefined) done(data);
            }
        )
    };    
    var computedCount = 0;
    query.progress(0);
    query.showProgressbar();
    if (!query.nodesComputed()) {
        var totalCount = query.nodes().length + 1;
        App.Controller.Node.computeFrom (
            query.mainNode(),
            function(data) {
                queryCompute();
            },
            function(data) {
            },
            function() {
                computedCount++;
                query.progress(Math.floor(computedCount*100/totalCount));
            }
        );        
    } else {
        var totalCount = 1;
        queryCompute();
    }
};
App.Controller.Node = function() {};

App.Controller.Node.deleteModel = function(id, done, fail) {    
    App.UI.state().synch.working();
    App.UI.disable();
    App.Server.Node.deleteModel (
        id,
        function(data) {
            App.UI.state().synch.ready();        
            App.UI.enable();
            done(data);            
        },
        function(data) {
            console.log(data.responseText);
            App.UI.state().synch.fail();
            App.UI.enable();
            fail(data);
        }
    );
};

App.Controller.Node.openSaveModel = function(node) {
    node._internalId = null;
    var $content = $('<div class="pn-form"></div>');
    var $wrap = $('<div class="pn-form-input-wrap"></div>');
    var $label = $('<label for="node-model-name">Nom</label>');
    var $input = $('<input id="node-model-name" class="k-textbox"/>');
    $wrap.append($label).append($input);
    $content.append($wrap);
     var dialog = new UI.Dialog('Enregistrer en tant que modèle', $content, { width: 500 }, function() {   
         node.label($input.val());
         App.UI.state().synch.working();
         App.UI.disable();
         App.Controller.Node.saveModel(
             node,
             function() {
                App.UI.state().synch.ready();        
                App.UI.enable();
             },
             function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
             }
         );
         dialog.close();
    });
    dialog.$valid().text('Enregistrer');
    dialog.open();
};


App.Controller.Node.confirmLoadModel = function(title, callback) {
    var $content = '<div>Le contenu du noeud sera perdu, êtes-vous sûr de vouloir continuer ?</div>';
    var dialog = new UI.Dialog(title, $content, {
            width: 800,
            commands: {
                valid: { text: 'Oui' },
                cancel: { text: 'Non' }
            }
        },
        function() {
            dialog.close();
            callback();
        }
    );
    dialog.open();
};     

App.Controller.Node.openLoadModel = function(node) {
    var load = function(data) {
        //App.UI.state().synch.working();
        //App.UI.disable();
        App.Server.Node.loadModel (
            data.id,
            function(data) {
                var criteria = JSON.parse(data.criteria);
                if (criteria != null) {
                    $.each(criteria, function(i, criterion) {
                        var crit_data = {
                            id: uid(),
                            operator: criterion.operator != null ? new Operator(criterion.operator) : null,
                            operation: criterion.operation != null ? new Operation(criterion.operation) : null,
                            typeFunction: criterion.typeFunction != null ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                            attribute: App.DataModel.attribute(criterion.path),
                            value: criterion.value
                        };
                        var criterion = new Criterion(crit_data);
                        node.addCriterion(criterion);
                        criterion.render();
                    });
                }                          
                if (App.session.computeOnTheFly()) {
                    App.Controller.Node.computeFrom (
                        node,
                        function() {
                            App.Controller.Query.computeFrom(node.query(), function(){}, function(){});
                        },
                        function(){}
                    );
                }
            },
            function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
            }
        );
    }
    App.Controller.Node.openModelList ('Charger un modèle', function(data) {  
        if (node._criteria.length > 0) {
            App.Controller.Node.confirmLoadModel('Confirmation du chargement du modèle', function() {
                node.emptyCriteria();
                load(data);
            });
        } else {
            load(data);
        }
        
    });
};

App.Controller.Node.openModelList = function(title, callback) {
    var $content = $('<div class="pn-form"></div>');
    var $list = App.Controller.Node.modelsList();
    $content.append($list);
    var dialog = new UI.Dialog(title, $content, { width: 800 }, function() {
        var kGrid = $list.data('kendoGrid');
        var item = kGrid.dataItem(kGrid.select());     
        callback(item);
        dialog.close();
    });
    dialog.open();
};

App.Controller.Node.modelsList = function(callback) {
    var $content = $('<div class="pn-list"></div>');   
    $content.kendoGrid({
        change: function(e) {
            if (callback != undefined) callback(e);
        },
        dataSource: { transport: { read: { url: App.config.server.url + '/node/model/list',
                                   data: { auth: App.account.auth } } }
        },
        sortable: { mode: 'single', allowUnsort: false },
        selectable: 'row', scrollable: true, resizable: true,
        /*pageable: {
          pageSize: 5,
          messages: {
            display: '{0}/{1} sessions sur {2} au total'
          }
        },*/
        columns: [
            { field: 'label', title: 'Modèle', width: 50 },
            { field: 'createdBy', title: 'Créé par', width: 20 },
            { field: 'creationDate', title: 'Créé le', width: 20 },
            { field: 'lastEditionDate', title: 'Modifié le', width: 20 },
        ]
    });
    return $content;
};

App.Controller.Node.saveModel = function(node, done, fail) {
    var criteria = [];
    $.each (node.criteria(), function(i, criterion) {
        criteria.push(criterion.toJSON());
    });
    App.Server.Node.saveModel (
       node.internalId(),
       node.label(),
       JSON.stringify(criteria),
       function(data) {
           done(data);
       },
       function(data) {
           fail(data);
       }        
    );
};

App.Controller.Node.openCreateNodeModel = function() {  
        
    var node = new Node({ id: uid(), criteria: [] });
    
    var $content = $('<div id="node-model" class="pn-form"></div>');
    
    var $details = $('<div id="node-model-details"></div>');
    var $commands = $('<div id="node-model-commands"></div>');
    var $new = $('<button id="node-model-new" class="k-button"><i class="icon-file-4"></i> Nouveau</button>');
    $new.click(function() {
        node.label('Nouveau modèle de noeud');
        node._criteria = [];
        node._internalId = null;
        $labelInput.val(node.label());
        $labelWrap.show();
        $criteria.empty().show();
    });
    var $delete = $('<button id="node-model-delete" class="k-button"><i class="icon-close"></i> Supprimer</button>');
    $delete.click(function() {
         if (node.internalId() != null) {
             App.Controller.Node.deleteModel(node.internalId(), function() {
                 var kGrid = $list.data('kendoGrid');
                 var dataRow = kGrid.dataSource.get(node.internalId());
                 kGrid.dataSource.remove(dataRow);
             });
         }
    });
    var $add = $('<button id="node-model-criterion-add" class="k-button"><i class="icon-filter-2"></i> Ajouter un critère</button>');
    $commands.append($new).append($delete).append($add);
    
    var $labelWrap = $('<div class="pn-form-input-wrap"></div>');
    var $labelLabel = $('<label for="node-model-label">Nom</label>');
    var $labelInput = $('<input id="node-model-label" class="k-textbox"/>');
    $labelWrap.hide().append($labelLabel).append($labelInput);
    var $criteria = $('<div id="node-model-criteria"></div>'); 
    
    $details.append($commands).append($labelWrap).append($criteria);
    
    var $list = App.Controller.Node.modelsList(function(e) {
        var kGrid = $list.data('kendoGrid');
        var item = kGrid.dataItem(kGrid.select());        
        App.UI.state().synch.working();
        App.UI.disable();
        App.Server.Node.loadModel (
            item.id,
            function(data) {
                $labelWrap.show();
                $labelInput.val(data.label);
                node.internalId(data.id).label(data.label);
                node._criteria = [];
                var criteria = JSON.parse(data.criteria);
                $criteria.empty();
                if (criteria != null) {
                    $.each(criteria, function(i, criterion) {
                        var crit_data = {
                            id: criterion.id,
                            operator: criterion.operator != null ? new Operator(criterion.operator) : null,
                            operation: criterion.operation != null ? new Operation(criterion.operation) : null,
                            typeFunction: criterion.typeFunction != null ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                            attribute: App.DataModel.attribute(criterion.path),
                            value: criterion.value
                        };
                        var criterion = new Criterion(crit_data);
                        node.addCriterion(criterion);
                        var $criterion = $('<div class="node-model-criterion"><i class="icon-filter-2"></i> '+criterion.toString()+'</div>');
                        var $remove = $('<button class="node-model-criterion-remove"><i class="icon-close"></i></button>');      
                        $criterion.append($remove);
                        $criterion.click(function() {
                            criterion.dialog (function() {
                                $criterion.html('<i class="icon-filter-2"></i> '+criterion.toString());
                            }, true).open();
                        });
                        $criterion.hover(function() {
                            $criterion.addClass('node-model-criterion-hover');
                            $remove.show();        
                        }, function() {
                            $criterion.removeClass('node-model-criterion-hover');
                            $remove.hide();        
                        });
                        $remove.hide().click(function() {
                            $criterion.off('click');
                            node.removeCriterion(criterion);
                            $criterion.remove();
                        });
                        $criteria.append($criterion);
                    });
                }
                $criteria.show();
                App.UI.state().synch.ready();
                App.UI.enable();
            },
            function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
            }
                
        );
    });
    $list.css('width', '50%');
    
    $content.append($list).append($details).addClass('flex');
    
    $add.click(function() {
        var criterion = new Criterion();
        var dialog = criterion.dialog (function() {
            node.addCriterion(criterion);
            var $criterion = $('<div class="node-model-criterion"><i class="icon-filter-2"></i> '+criterion.toString()+'</div>');
            $criterion.click(function() {
                criterion.dialog (function() {                    
                }).open();
            });            
            $criterion.hover(function() {
                $criterion.addClass('node-model-criterion-hover');
                $remove.show();        
            }, function() {
                $criterion.removeClass('node-model-criterion-hover');
                $remove.hide();        
            });
            $criteria.append($criterion);            
            var $remove = $('<button class="node-model-criterion-remove"><i class="icon-close"></i></button>');      
            $criterion.append($remove);
            $remove.hide().click(function() {
                $criterion.off('click');
                node.removeCriterion(criterion);
                $criterion.remove();
            });
        });
        dialog.open();
    });
    var dialog = new UI.Dialog ('Modèle de noeud', $content, {width: 1000},
        function() {
            node.label($labelInput.val());
            App.Controller.Node.saveModel(
                node,
                function() {
                    App.UI.state().synch.ready();        
                    App.UI.enable();
                 },
                 function(data) {
                    console.log(data.responseText);
                    App.UI.state().synch.fail();
                    App.UI.enable();
                 }
             );
            dialog.close();
        }
    );
    dialog.$valid().text('Enregistrer');
    dialog.open();  
};

App.Controller.Node.add = function(query, node, parent) {    
    var session = App.session;   
    // node pas renseigné
    if (node == null) {
        var data = {
            label: parent == null ? 'Niveau 1' : 'Niveau '+parent.level()+'-'+(parent.hasChildren() ? parent.last().axis().y + 1 : 1),
            popcount: null,
            parent: parent,
            children: [],
            query: query,
            criteria: []
        };
        node = new Node(data);
        node.id(uid());
        if (node.hasParent()) parent.children().push(node);
        query.addNode(node).render();
    // node renseigné
    } else {
        node.parent(parent);
        node.query(query);
        node.children([]);
        parent.children().push(node);
        query.addNode(node).render();
    }
}

App.Controller.Node.delete = function(node) {     
    var confirm = new UI.Confirm (
        'Etes-vous de vouloir supprimer le noeud \''+node.label()+'\' ?',
        function() {
            var query = node.query();
            var newNode = null;
            if (node.hasChildren()) {
                newNode = node.first();
            } else if (node.hasNext()) {
                newNode = node.next();
            }
            node.query().removeNode(node.remove(function() {
                query.rebuildLinks();
            }));    
            if (newNode != null) {        
                if (App.session.computeOnTheFly()) {
                    App.Controller.Node.computeFrom (
                        newNode,
                        function() {
                            App.Controller.Query.computeFrom(query, function(){}, function(){});
                        },
                        function(){}
                    );
                }
            } else {
                if (App.session.computeOnTheFly()) App.Controller.Query.computeFrom(query, function(){}, function(){});
            }
        }
    );
    confirm.open();
};

App.Controller.Node.computeCriteria = function(node, done, fail) {    
    node.loading();
    /*App.UI.state().synch.working();
    App.UI.disable();*/
    $.each (node.criteria(), function(i, criterion) {
        criterion.compute(
            function(data){
                if (i == node.criteria().length) {
                    /*App.UI.state().synch.ready();
                    App.UI.enable();*/
                    done(data);
                }
            },
            function(data){
                fail(data);
            }
        );
    });
};

App.Controller.Node.computeFrom = function(node, done, fail, progression) {
	
    //console.log('progression', progression);
    App.Controller.Node.compute(
        node,
        function(data) {
            if (node.hasChildren()) {
                App.Controller.Node.computeFrom(node.first(), function(){ done(data); /*progression();*/ }, function(){}, progression);
            }
            if (node.hasNext()) {
                App.Controller.Node.computeFrom(node.next(), function(){ done(data); /*progression(); */}, function(){}, progression);
            }
            if (node.query().nodesComputed()) {
                done(data);
            }
            if(progression) progression();
        },
        function(data) {
            fail(data);
        }
    );
};

App.Controller.Node.compute = function(node, done, fail) {
    node.computed(false);
    var nodeCompute = function() {
        node.compute(
            function(data) {
                App.UI.error('Erreur survenue pendant le calcul', data.responseText);
                node.updateCount();
                done(data);                    
            },
            function(data) {    
                fail(data) ;
            }
        );
    };        
    node.loading();
    nodeCompute();
};
App.Controller.Criterion = function() {};

App.Controller.Criterion.add = function(node, args) {   
    var criterion = new Criterion(args);
    criterion.id(uid());
    var dialog = criterion.dialog (function() { 
        node.addCriterion(criterion).render();
        if (App.session.computeOnTheFly()) {
            /*App.Controller.Criterion.compute (
                criterion,
                function(data) {*/
                    App.Controller.Node.computeFrom (                
                        node,
                        function() {
                            App.Controller.Query.computeFrom(node.query(), function(){}, function(){});
                        },
                        function() {}
                    );  
                /*},
                function(data) {
                }
            );*/
        }
    });  
    dialog.open();
}

App.Controller.Criterion.edit = function(criterion) {
    var dialog = criterion.dialog(function() {  
        criterion.updateRender();      
        if (App.session.computeOnTheFly()) {  
            /*App.Controller.Criterion.compute(
                criterion,
                function(data) {*/
                    App.Controller.Node.computeFrom (
                        criterion.node(),
                        function() {
                            App.Controller.Query.computeFrom(criterion.node().query(), function(){}, function(){});
                        },
                        function() {}                        
                    );
                /*},
                function(data) {
                }
            );*/
        }
    }, true);
    dialog.open();
}


App.Controller.Criterion.delete = function(criterion) {      
    var confirm = new UI.Confirm (
        'Etes-vous de vouloir supprimer le critère \''+criterion.toString()+'\' ?',
        function() {
            criterion.node().removeCriterion(criterion.remove());            
            if (App.session.computeOnTheFly()) {
                App.Controller.Node.computeFrom (
                    criterion.node(),
                    function() {
                        App.Controller.Query.computeFrom(criterion.node().query(), function(){}, function(){});},
                    function() {}
                );
            }
        }
    );
    confirm.open();
}


App.Controller.Criterion.compute = function(criterion, done, fail) {  
    criterion.node().loading();
    /*App.UI.state().synch.working();       
    App.UI.disable();   */
    criterion.compute (
        function(data) {
            /*App.UI.state().synch.ready();
            App.UI.enable();*/
            done(data);
        },
        function(data) {
            console.log(data.responseText);  
            /*App.UI.state().synch.fail();
            App.UI.enable();*/   
            fail(data);
        }
    );
}

function Session() {

    this._queries = [];
    this._mode = null;
    this._name = null;
    this._id = null;
    this._saved = false;
    this._mode = 'full';
    this._computeOnTheFly = true;
    this._exclQuery = null;
    this._excludeQueries = true;
    
    
    this._plugin = {};
    
    this.plugin = function(name, data) {
        if (name != null && data != null) {
            this._plugin = { name: name, data: data }
            return this;
        } else {
            return this._plugin;
        }
    }
    
    this.queriesComputed = function() {
        var queriesComputed = true;
        $.each (this.queries(), function(i, query) {
            if (!query.computed()) {
                queriesComputed = false;
                return false;
            }
        });
        return queriesComputed;
    }
    
    this.mode = function(mode) {
        if (mode != null) { this._mode = mode; return this; }
        else { return this._mode; }
    }
    
    this.computeOnTheFly = function(computeOnTheFly) {
        if (computeOnTheFly != null) { this._computeOnTheFly = computeOnTheFly; return this; }
        else { return this._computeOnTheFly; }
    }
    
    this.excludeQueries = function(excludeQueries) {
        if (excludeQueries != null) { this._excludeQueries = excludeQueries; return this; }
        else { return this._excludeQueries; }
    }
    
    this.name = function(name) {
        if (name != null) { this._name = name; return this; }
        else { return this._name; }
    }
    
    this.id = function(id) {
        if (id != null) { this._id = id; return this; }
        else { return this._id; }
    }
    
    this.saved = function(saved) {
        if (saved != null) { this._saved = saved; return this; }
        else { return this._saved; }
    }
    
    this.exclQuery = function(exclQuery) {
        if (exclQuery != null) { this._exclQuery = exclQuery; return this; }
        else { return this._exclQuery; }
    }
    
    this.isSaved = function() {
        return this._saved;
    }
    
    this.load = function(callback) {
        var that = this;
        App.Server.session.load(token, 
            callback(function() {
                that._mode = data.mode;
                that._queries = data.queries;
            })
        );
    }
    
    this.toJSON = function() {
        var queries = [];
        $.each (this.queries(), function(i, query) {
           queries.push (query.toJSON()); 
        });
        return {
            id: this.id(),
            name: this.name(),
            queries: queries
        }
    }
    
    this.toString = function() {
      var str = "";
      var queries = this.queries();
      str += _.map(queries, function(q) {
        return (queries.length > 1 ? "(" : "") + q.toString() + (queries.length > 1 ? ")" : "");
      }).join(" + ");
      if(this.exclQuery()) {
        str += " - (" + this.exclQuery().toString() + ")";
      }
      return str;
    },
            
    this.synch = function(done, fail) {
        var data = {queries: this.JSON()};
        Server.session.synch(this._token, JSON.stringify(data), done, fail);
    }        
        
    this.addQuery = function(query) {
        this.queries().push(query);
        return query;
    }    
        
    this.query = function(id) {
        var index;
        $.each(this.queries(), function(i,e) {
            if (e.id() == id) index = i;
        });
        return this.queries()[index];
    }
    
    this.popcount = function() {
      return _.reduce(this.queries(), function(memo, value) { return memo + value.popcount() }, 0);
    };
    
    this.queries = function() {
        return this._queries;
    }
    
    this.currentTarget = function() {
        return this.target(App.currentTarget);
    }
    
    /*this.addQuery = function() {
        var id;
        $.ajax({
            url: App.SERVER_URL, method: "post",
            data: {c:"target-add",sid:this._id}, 
            async: false,
            success: function(data) {
                id = data;
            }    
        });      
        var frontId = App.newTargetId();
        var target = new PnTarget();
        target.id(id).label("Cible "+frontId).frontId(frontId);
        App.frontIdCounter[frontId] = [];           
        this._targets.push(target);
        this._length++;
        return target;
    }*/
    
    
    this.exclQueryExists = function() {
        return this.exclQuery() != null;
    }
    
    this.removeQuery = function(id) {
        $.ajax({
            url: App.SERVER_URL, method: "post",
            data: {c:"target-remove",sid:this._id,tid:id}, 
            async: false
        }).done(function() {
            var thisSession = this;
            $.each(thisSession.targets(), function(i,e) {
                if (e.id() == id) {
                    thisSession._targets = thisSession.targets().unset(i);
                    return;
                }
            });
        });   
    }
    
    this.kill = function() {
        $.ajax({
            url: App.SERVER_URL, method: "post",
            data: {c:"session-kill",sid:this._id}, 
            async: false,
            success: function(data) {
            }    
        });
    };
    
    this.resetQueries = function() {
        this._queries = [];
    }    
    

}
// Objet Query
function Query(data) {
    
    // Propriétés autorisées
    this.allowedProperties = [
        'id',
        'internalId',
        'label',
        'popcount', 
        'nodes', 
        'desc', 
        'excl', 
        'exclusivity', 
        'useExclusion'
    ];    
        
    // Affectation des propriétés
    for (key in data) {  
        if ($.inArray(key, this.allowedProperties) > -1) {
            var obj = data[key];
            this['_'+key] = obj;
        }
    }
    
    /*this._nodes = [];
    this._popcount = 0;*/
    this._$parentE = $('#query-list');
    this._$e = null;
            
    this._computed = false;
    this.computed = function(computed) {
        if (computed != null) { this._computed = computed; return this; }
        else { return this._computed; }
    }    
    
    this._computing = false;
    this.computing = function(computing) {
        if (computing != null) { this._computing = computing; return this; }
        else { return this._computing; }
    }
          
    this._progression = 0;
    this.progression = function(progression) {
        if (progression != null) { this._progression = progression; return this; }
        else { return this._progression; }
    }
    
    this._limit = null;
    this.limit = function(limit) {
        if (limit != null) { this._limit = limit; return this; }
        else { return this._limit; }
    }
    
    this._selected = false;
    this.selected = function(selected) {
        if (selected != null) { this._selected = selected; return this; }
        else { return this._selected; }
    }
    
	//this._exclusivity = true;	
    this.exclusivity = function(exclusivity) {
        if (exclusivity != null) { this._exclusivity = exclusivity; return this; }
        else { return this._exclusivity; }
    }
    
	//this._useExclusion = true;
    this.useExclusion = function(useExclusion) {
        if (useExclusion != null) { this._useExclusion = useExclusion; return this; }
        else { return this._useExclusion; }
    }
    
    
    
    this.nodesComputed = function() {
        var nodesComputed = true;
        $.each (this.nodes(), function(i, node) {
            if (!node.computed()/* && node.criteria().length > 0*/) {
                nodesComputed = false;
                return false;
            } 
        });
        return nodesComputed;
    }
    
    
    this.toJSON = function() {
        var nodes = [];
        $.each (this.nodes(), function(i, node) {
            nodes.push(node.toJSON());
        });
        return {
            id: this.id(),
            order: this.order(),
            internalId: this.internalId(),
            desc: this.desc(),
            excl: this.excl(),
            label: this.label(),
            exclusivity: this.exclusivity(),
            useExclusion: this.useExclusion(),
            nodes: nodes
        };
    }       
    
    this.toString = function() {
      return this.mainNode().toString();
    },            
    
    // Getters / setters
    
    this.id = function(id) {
        if (id != null) { this._id = id; return this; }
        else { return this._id; }
    }
    
    this.internalId = function(internalId) {
        if (internalId != null) { this._internalId = internalId; return this; }
        else { return this._internalId; }
    }
    
    this.label = function(label) {
        if (label != null) { this._label = label; return this; }
        else { return this._label; }
    }
    
    this.excl = function(excl) {
        if (excl != null) { this._excl = excl; return this; }
        else { return this._excl; }
    }
    
    this.desc = function(desc) {
        if (desc != null) { this._desc = desc; return this; }
        else { return this._desc; }
    }
    
    this.popcount = function(popcount) {
        if (popcount != null) { this._popcount = popcount; return this; }
        else { return this._popcount; }
    }
    
    this.nodes = function(nodes) {
        if (nodes != null) { this._nodes = nodes; return this; }
        else { return this._nodes; }
    }
    
    this.order = function() {
        if (App.session.exclQuery() != null) {
            if (this.excl()) {
                return 0;
            } else {
                return App.session.queries().indexOf(this) + 1;
            }
        } else {
            return App.session.queries().indexOf(this);
        }
    }
    
    // Navigation
    
    // Requête précédente
    this.previous = function() {
        var that = this, prev = null;
        $.each(App.session.queries(), function(i,q) {
            if (that.id()==q.id()) {
                if (i < (App.session.queries().length+1)) {
                    prev = App.session.queries()[i-1];
                    return false;
                }
            }
        });
        return prev;
    };
    
    this.hasNext = function() {
        return (this.next() != null);
    };
    
    // Requête suivante
    this.next = function() {
        var that = this, next = null;
        $.each(App.session.queries(), function(i,q) {
            if (that.id()==q.id()) {
                if (i < (App.session.queries().length-1)) {
                    next = App.session.queries()[i+1];
                    return false;
                }
            }
        });
        return next;
    };
    
    
    // Manipulation des noeuds
    
    // Noeud principale (premier noeud)
    this.mainNode = function() {
        return this.nodes()[0];
    }
    
    // Noeud portant l'id passé en paramètre
    this.node = function(id) {
        var node;
        $.each(this.nodes(), function(i, n) {
            if (n.id() == id) {
                node = n;
                return;
            }
        });
        return node;
    }
    
    // Noeud d'internalId passé en paramètre
    this.nodeByInternalId = function(internalId) {
        var node;
        $.each(this.nodes(), function(i, n) {
            if (n.internalId() == internalId) {
                node = n;
                return;
            }
        });
        return node;
    }
        
    // Ajout d'un noeud
    this.addNode = function(node) {
        this.nodes().push(node)
        return node;
    }
    
    // Suppression d'un noeud
    this.removeNode = function(node) {
                
        var that = this;
                
        // réaffectation des parents des enfants du noeud courant
        $.each(node.children(), function(i, child) {
            child.parent(node.parent());            
            //node.query().node(e.id()).parentId(node.parent().id());
        });    
        
        // réaffectation des enfants du parent du noeud courant
        var afterNode = node;
        $.each(node.children(), function(i, child) {
            node.parent().children(
                node.parent().children().insert(
                    node.parent().children().indexOf(afterNode),
                    child
                )
            );
            afterNode = child;
        });
        
       // suppression du noeud supprimé dans les enfants du parent
       node.parent().children(node.parent().children().unset(node.parent().children().indexOf(node)));
           
       // suppression du noeud de la requête
       that.nodes(that.nodes().unset(that.nodes().indexOf(node)));
       
    }
    
    this.rebuildLinks = function() {
        var that = this;
        $.each (this.nodes(), function(i, node) {
            if (node.hasChildren()) {
                node.link();
            } else {
                node.unlink();
            }
        });
        $.each (this.$tree().find('canvas.node-link'), function(i, link) {
            if (that.node($(link).attr('data-id')) == undefined) {                
                this.remove();
            }
        });
    }
    
    // Suppression d'un noeud par l'indice
    this.removeNodeByIndex = function(index) {
        this.nodes(this.nodes().unset(index));
    }
    
    // jQuery
    
    this.$listItem = function() {
        var that = this;
        var $item = $('#query-list').children('li[data-id="'+this.id()+'"]');
        if (!$item.exists()) {
            $item = $('<li class="query-item" data-id="'+this.id()+'"></li>');
            var $details = $('<div class="query-details"></div>');
            $details.append('<div class="query-label">'+this.label()+'</div>')
                    .append('<div class="query-popcount"><i class="icon-users"></i> <span class="query-popcount-number">-</span></div>')
                    .click(function() { that.select(); });
            var $progressbar = $('<div class="query-progressbar"></div>');
            $details.append($progressbar);
            $progressbar.kendoProgressBar({type: 'percent', showStatus: false, animation: { duration: 600 }});
            var $commands = $('<div class="query-commands"></div>');
            $commands.addClass('flex');
            $.each (App.UI.query, function(name, cmd) {  
                if (cmd.enabled) {
                    if ((cmd.excl && that.excl()) || !that.excl()) {
                        var $button = $('<button title="'+cmd.tooltip+'" class="k-button query-command-'+name+'"><i class="icon-'+cmd.icon+'"></i></button>')
                        $button.click(that.commands()[name]);
                        $commands.append($button);
                    }
                }
            });
            $item.append($details).append($commands).hide();
            $item.addClass('query-item'+(this.excl()?'-excl':'-default'));
        }
        return $item;
    }
    
    
    this.$toExcl = function() {
        this.$listItem().removeClass('query-item-default').addClass('query-item-excl');
        return this;        
    }
    
    this.$toDefault = function() {
        this.$listItem().removeClass('query-item-excl').addClass('query-item-default');
        return this;   
    }
    
    this.commandButton = function(name) {
        return this.$listItem().children('.query-commands').children('button.query-command-'+name);
        return this;  
    }
    
    this.disableCommand = function(name) {
        this.commandButton(name).off('click').addClass('disabled');
        return this;
    }
    
    this.enableCommand = function(name) {
        var that = this;
        this.commandButton(name).on('click', that.commands()[name]).removeClass('disabled');
        return this;
    }
    
    this.disableCommands = function() {
        var that = this;
        $.each (this.commands(), function(name, command) {
            that.disableCommand(name);
        });
        return this;
    }
    
    this.enableCommands = function() {
        var that = this;
        $.each (this.commands(), function(name, command) {
            that.enableCommand(name);
        });
        return this;
    }
    
    this.dependentQueries = function() {
        var queries = [];
        if (this.excl()) {
            queries = App.session.queries();
        } else {
            if (this.hasNext()) {
                var query = this;
                while (query.hasNext()) {
                    query = query.next();
                    queries.push(query);                
                }
            }
        }
        return queries;
    }
    
    this.commands = function() {
        var that = this;
        return {
            copy: function() {},
            save: function() { App.Controller.Query.openSaveModel(that); },
            load: function() { App.Controller.Query.openLoadModel(that); },
            edit: function() { App.Controller.Query.dialog(that); },
            remove: function() { App.Controller.Query.remove(that); },
                /*,
            up: { excl: false, icon: 'arrow-up-2', toolip: 'Remonter', event: function() {
                that.previous().$listItem().before(that.$listItem()).fadeIn();
                var previous = that.previous();
                App.session._queries = App.session.queries().unset(App.session.queries().indexOf(that.previous()));
                App.session._queries = App.session.queries().insert(
                        App.session.queries().indexOf(that),
                        previous
                );
            }},
            down: { excl: false, icon: 'arrow-down-2', toolip: 'Descendre', event: function() {
                that.next().$listItem().after(that.$listItem()).fadeIn();
                var next = that.next();
                App.session._queries = App.session.queries().unset(App.session.queries().indexOf(that.next()));
                App.session._queries = App.session.queries().insert(
                        App.session.queries().indexOf(that.previous()),
                        next
                );
            }}*/
        }
    }
    
    this.$tree = function() {
        var $tree = $('.query-tree[data-id="'+this.id()+'"]');
        if ($tree.exists()) {
            return $tree;
        } else {
            return $('<div class="query-tree" data-id="'+this.id()+'"></div>');
        }
    }
    
    this.render = function(effect, done) {
        if (effect == undefined || effect == null) {
            var effect = true;
        }
        var that = this;
        $('#query-list').children('li.empty').remove();
        if (that.excl()) {
            $('#query-list').prepend(that.$listItem());
        } else {
            $('#query-list').append(that.$listItem());
        }
        if (done == undefined) {
            var done = function() {};
        }
        if (effect) {
            that.$listItem().effect('slide', done);
        } else {
            that.$listItem().show(done);
        }
        $('#query-wrapper').append(that.$tree());
        return this;
    }
    
    this.remove = function() {
        this.$listItem().fadeOut('slow');
        this.$tree().fadeOut('slow');
    }
    
    this.$details = function() {
        return this.$listItem().children('.query-details');
    }
    
    this.$popcount = function() {
        return this.$details().children('.query-popcount');
    }
        
    this.$loading = function() {
        if (!this.$popcount().children('.query-loading').exists()) {
            this.$popcount().children('.query-popcount-number').replaceWith($('<span class="query-loading"></span>'));
        }        
        return this.$popcount().children('.query-loading');
    }     
                
    this.$progressbar = function() {
        return this.$details().children('.query-progressbar');
    }
    
    this.progressbar = function(value) {
        this.$progressbar().data('kendoProgressBar').value(value);
    }      
            
    this.progress_ = function() {
        var total = this.nodes().length;
        var computed = 0;
        $.each (this.nodes(), function(i, node) {
            if (node.computed()) {
                computed++;
            } 
        });
        return computed / total;
    }     
            
    this.progress = function(percent) {
        this.$loading().text(percent+'%');
        this.progressbar(percent);
        return this;
    };
    
    this.resetProgress = function() {
        this.progressbar(0);
    }
    
    this.showProgressbar = function() {
        this.$progressbar().css('visibility', 'visible');
        return this;
    }
    
    this.hideProgressbar = function() {
        this.$progressbar().css('visibility', 'hidden');
        return this;
    }
            
    this.updateLabel = function() {
        this.$listItem().find('.query-label').text(this.label());
    } 
        
    this.updatePopcount = function(callback) { 
        var $loading = this.$popcount().find('.query-loading'), that = this;
        $loading.fadeOut(500, function() {
            $loading.remove();
            var $count = $('<span class="query-popcount-number">'+$.formatNumber(that.popcount(),{format:"#,##0",locale:"fr"})+'</span>').hide();
            that.$popcount().append($count);
            $count.fadeIn('slow');
            var initColor$Count = that.$listItem().children('.query-details').css('backgroundColor');
            that.$listItem().children('.query-details').animate({backgroundColor:'#FE2339'}, 500, function() {
                $(this).animate({backgroundColor:initColor$Count},500, function() {                 
                    $(this).removeAttr('style');
                    callback();
                });
            });
        });
    } 
        
    this.unselect = function() {
        this.$listItem().removeClass('query-item-selected');
        this.selected(false);
    }    
        
    this.select = function() {
        var that = this;
        if (App.session.exclQuery() != null) {
            App.session.exclQuery().unselect();
        }
        $.each (App.session.queries(), function(i, query) {
           query.unselect();
        });
        this.$listItem().addClass('query-item-selected');
        $('.query-tree').hide();
        $('.query-tree[data-id="'+that.id()+'"]').show();
        this.selected(true);
        return this;
    }
        
    this.compute = function(done, fail) {
        var that = this;
        var nodes = [];
        this.computing(true);
        if (!this.mainNode().hasChildren()) {
            nodes.push(this.mainNode().toJSON());
        } else {
            $.each (this.mainNode().clsBranch(), function(i, node) {
                nodes.push(node.toJSON());
            });
        }
        var excludeQueries = [];
        if (App.session.excludeQueries()) {
            if (!this.excl()) {
                if (App.session.exclQuery() != null && this.useExclusion()) {
                    excludeQueries.push(App.session.exclQuery().toJSON());
                }
                if (this.exclusivity()) {
                    $.each (App.session.queries(), function(i, query) {            
                        if (i < App.session.queries().indexOf(that)) {
                            excludeQueries.push(query.toJSON());
                        } 
                    });
                }
            }
        }        
        App.Server.Query.compute(this.toJSON(), nodes, excludeQueries,
            function(data) { that.popcount(data.count).computed(true).computing(false); done(data); },
            function(data) { fail(data); }
        );
    }
        
        
        
}
function Node(data) {
    
    // Propriétés
    
    // Propriétés autorisées
    this.allowedProperties = ['id', 'label', 'popcount', 'criteria', 'parent', 'query', 'children'];    
      
    this.defaults = {
        id: uid(),
        label: null,
        popcount: null,
        criteria: [],
        parent: null,
        query: null,
        children: []
    };
    
    this._internalId = null;
        
    // Affectation des propriétés
    for (key in data) {  
        if ($.inArray(key, this.allowedProperties) > -1) {
            var obj = data[key];
            this['_'+key] = obj;
        }
    }
    
    this._internalId = null;
    
    this._computed = false;
    this.computed = function(computed) {
        if (computed != null) { this._computed = computed; return this; }
        else { return this._computed; }
    }    
    
    this._computing = false;
    this.computing = function(computing) {
        if (computing != null) { this._computing = computing; return this; }
        else { return this._computing; }
    }
    
    this.criteriaComputed = function() {
        var criteriaComputed = true;
        $.each (this.criteria(), function(i, criterion) {
            if (!criterion.computed()) {
                criteriaComputed = false;
                return false;
            }
        });
        return criteriaComputed;
    }
    
    this.toJSON = function() {
        var criteria = [];
        $.each (this.criteria(), function(i, criterion) {
            criteria.push (criterion.toJSON());
        });
        var children = [];
        $.each (this.children(), function(i, child) {
            children.push(child.id()); 
        });
        return {
            id: this.id(),
            label: this.label(),
            criteria: criteria,
            children: children,
            parent: this.hasParent() ? this.parent().id() : null
        };
    }
        
    
    this.toString = function() {      
      var str = "";      
      var crits = this.criteria();      
      var critStr = _.map(crits, function(c) { return c.toString(); }).join(" et ");
      
      if(critStr) {
        str += (crits.length > 1 ? "(" : "") + critStr + (crits.length > 1 ? ")" : "");
      }
      
      var children = this.children();
      
      var childrenStr = _.map(children, function(n) {
        return n.toString();
      }).join(" ou ");
      
      if(childrenStr) {
        str += " et " + (children.length > 1 ? "(" : "") + childrenStr + (children.length > 1 ? "(" : "");
      }
            
      return str;
    },            
        
        
    // Getters / setters
    
    this.id = function(id) {
        if (id != null) { this._id = id; return this; }
        else { return this._id; }
    }    
    
    this.internalId = function(internalId) {
        if (internalId != null) { this._internalId = internalId; return this; }
        else { return this._internalId; }
    }
    
    this.parent = function(parent) {
        if (parent != null) { this._parent = parent; return this; }
        else { return this._parent; }
    }
    
    this.children = function(children) {
        if (children != null) { this._children = children; return this; }
        else { return this._children; }
    }
    
    this.query = function(query) {
        if (query != null) { this._query = query; return this; }
        else { return this._query; }
    }
    
    this.label = function(label) {
        if (label != null) { this._label = label; return this; }
        else { return this._label; }
    }    
    
    this.popcount = function(popcount) {
        if (popcount != null) { this._popcount = popcount; return this; }
        else { return this._popcount; }
    }    
        
    this.criteria = function(criteria) {
        if (criteria != null) { this._criteria = criteria; return this; }
        else {
            /*if (this._criteria.length == 0) {
               return [new Criterion({
                   id: uid(),
                   attribute: App.DataModel.attributeByName('entiere'),
                   operator: new Operator('isNotEmpty'),
                   entiere: true,
                   operation: null,
                   value: null,
                   typeFunction: null,
                   node: this
               })];
            } else {*/
                return this._criteria;
            //}
        }
    }     
    
    this.genLabel = function() {     
        if (this.hasParent()) {
            var parent = this.parent();
            
        } else {
            var parent = null;
        }
        if (parent===undefined) parent = null;
        var frontId = (parent!=null?this.node(parent).frontId()+'-':'')+App.newFrontId(this.frontId(),(parent!=null?this.node(parent).frontId():0));
        
        return label;
    }
    
    // Coordonnées (x,y)
    this.axis = function() {
        return {
            x: this.hasParent()   ? this.parent().axis().x   + 1 : 1,
            y: this.hasPrevious() ? this.previous().axis().y + 1 : 1
        }  
    } 
    
    // Position
    this.position = function() {
        var position = {};
        if (!this.hasParent()) {
            position.top = 10;
            position.left = 20;
        } else {
            var plength = this.parent().clsBranch().length;            
            if (this.parent().children().length == 1) { // si enfant unique => top du parent
                position.top = this.parent().$e().pos('top');
            } else if (this.parent().children().length > 1) { // si possède frère(s)                
                if (!this.previous().hasChildren()) position.top = this.previous().$e().pos('top') + 180 + 10; // si le précédent n'a pas d'enfant => top précédent + 180 + 10                 
                else position.top = this.previous().lastOfBranch().$e().pos('top') + 180 + 10; // sinon => top dernier de la branche du précédent + 180 + 10
            } else {
            }
            position.left = this.parent().$e().pos('left') + 270 + 10; 
        }
        return position;
    };
        
    // Niveau
    this.level = function() {
        if (this.hasParent()) {
            return this.parent().level() + '-' + this.axis().y;
        } else {
            return '1';
        }
    };
           
    // Retourne le noeud enfant portant l'id passé en paramètre
    this.child = function(id) {
        var node;
        $.each(this.children(), function(i,n) {
            if (n.id()==id) {
                node = n;
                return;
            }
        });
        return node;
    };
    
    // Possède un ou des enfants
    this.hasChildren = function() {
        return (this.children().length > 0);
    };
        
    // Retourne le premier noeud enfant
    this.first = function() {
        var first = null;
        if (this.hasChildren()) first = this.children()[0];
        return first;
    };
    
    // Retourne le dernier noeud enfant
    this.last = function() {
        var last = null;
        if (this.hasChildren()) last = this.children()[this.children().length-1];
        return last;
    };
    
    // Possède un noeud précédent
    this.hasPrevious = function() {
        return (this.previous() != null);
    };
    
    // Retourne un noeud précédent
    this.previous = function() {
        var that = this, prev = null;
        if (that.hasParent()) {
            if (that.parent().hasChildren()) {
                $.each(that.parent().children(), function(i,e) {
                    if (that.id()==e.id()) {
                        if (i < (that.parent().children().length+1)) {
                            prev = that.parent().children()[i-1]; return;
                            //prev = that.query().node(that.parent().children()[i-1].id()); return;
                        }
                    }
                });
            }
        }
        return prev;
    };
    
    // Possède un noeud suivant
    this.hasNext = function() {
        return (this.next() != null);
    };
    
    // Retourne le noeud suivant
    this.next = function() {
        var that = this, next = null;
        if (that.hasParent()) {
            if (that.parent().hasChildren()) {
                $.each(that.parent().children(), function(i,e) {
                    if (that.id()==e.id()) {
                        if (i < (that.parent().children().length-1)) {
                            next = that.parent().children()[i+1]; return;
                        }
                    }
                });
            }
        }
        return next;
    };
    
    // Retourne tous les noeuds de la branche
    this.branch = function() {
        var branch = []; 
        $.each(this.children(), function(i,node) {
            branch.push(node);
            branch = branch.concat(node.branch());
        });
        return branch;
    }
    
    // Retourne les noeuds enfant n'ayant pas d'enfant
    this.clsChildren = function() {
        var children = [], thisNode = this;
        $.each (thisNode.children(), function(i,node) {
            if (!node.hasChildren()) children.push(node);
        });
        return children;
    };
    
    // Retourne tous les noeuds de la branche n'ayant pas d'enfant
    this.clsBranch = function() {
        var children = [], that = this;
        $.each (that.branch(), function(i, node) {
            if (!node.hasChildren()) children.push(node);
        });
        return children;
    }
    
    this.clsNoEmptyBranch = function() {
        var branch = []; 
        $.each(this.branch(), function(i,node) {
            if (node.criteria().length > 0 && !node.hasChildren()) {
                branch.push(node);
                //branch = branch.concat(node.clsNoEmptyBranch());
            }
        });
        return branch;
    }
    
    // Retourne le premier noeud de la branche
    this.firstOfBranch = function() {
        var firstOfBranch = null, clsBranch = this.clsBranch();
        if (clsBranch.length > 0) {
            firstOfBranch = clsBranch[0];
        }
        return firstOfBranch;
    };
    
    // Retourne le dernier noeud de la branche
    this.lastOfBranch = function() {
        var lastOfBranch = null, clsBranch = this.clsBranch();
        if (clsBranch.length > 0) {
            lastOfBranch = clsBranch[clsBranch.length-1];
        }
        return lastOfBranch;
    };
    
    // Noeud parent
    
    // Possède un noeud parent
    this.hasParent = function() {
        return this.parent() != null;
    }
    
    // Critères
        
    // Retourne le critère portant l'id passé en paramètre
    this.criterion = function(id) {
        var criterion;
        $.each(this.criteria(), function(i, c) {
            if (c.id() == id) {
                criterion = c;
                return;
            }
        });
        return criterion;
    }
    
    // Ajout d'un critère
    this.addCriterion = function(criterion) {
        this.criteria().push(criterion);
    }
    
    // Suppression de tout les critères
    this.emptyCriteria = function() {
        this._criteria = [];
        this.$criteria().empty();
    }
    
    // Suppression d'un critère
    this.removeCriterion = function(criterion) {
        this.criteria(this.criteria().unset(this.criteria().indexOf(criterion)));
    }
    
    // Suppression d'un critère par l'indice
    this.removeCriterionByIndex = function(index) {
        this.nodes(this.criteria().unset(index));
    }
    
    // jQuery
    
    this.$e = function() {      
        return $('.node[data-id="'+this.id()+'"]');
    }
            
    this.build$e = function() {
        var color = {};
        /*if (this.axis().x == 1) {
            color.header = '#303030';
        } else if (this.axis().x == 2) {            
            var seq = App.config.node.colorsSequence;
            if (this.axis().y <= 4) {
                color.header = seq[this.axis().y - 1];
            } else {
                color.header = seq[this.axis().y - seq.length * Math.floor(this.axis().y / seq.length)];
            }
        } else {
            color.header = $.xcolor.opacity(this.parent().color.header, '#959795', 0.20).getHex();
        }        
        color.footer = $.xcolor.lighten(color.header, 3, 16).getHex();
        color.button = $.xcolor.darken(color.footer, 3, 16).getHex();
        color.buttonOver = $.xcolor.darken(color.button, 3, 16).getHex();
        this.color = color;*/
        var that = this;
        var $e = $('<div class="node" data-id="'+this.id()+'"></div>');
        var $header = $('<div class="node-header"></div>')/*.css('backgroundColor', color.header)*/;
        var $label = $('<span class="node-label">'+this.label()+'</span>');
        var $popcount = $('<div class="node-popcount"><i class="icon-users"></i> <span>'+(this.popcount() == null ? '-' : $.formatNumber(this.popcount(),{format:'#,##0',locale:'fr'}))+'</span></div>');
        //$popcount.css('color', color.buttonOver);
        $header.append($label).append($popcount);
        var $criteria = $('<div class="node-criteria"></div>');
        var $footer = $('<div class="node-footer"></div>')/*.css('backgroundColor', color.footer)*/;
        var $commands = $('<div class="node-commands"></div>');   
        $.each (App.UI.node, function(name, cmd) {
            if (!(that.query().nodes().indexOf(that) == 0 && name == 'remove')) {
                if (cmd.enabled) {
                    var $button = $('<button id="node-command-'+name+'" title="'+cmd.tooltip+'" class="k-button node-command-'+name+'"><i class="icon-'+cmd.icon+'"></i></button>')
                                    .click(that.commands()[name])
                                    /*.css('color', that.color.button)*/
                                    .hover(function(){ $(this)/*.css('color', color.buttonOver )*/},
                                           function(){ $(this)/*.css('color', color.button     )*/})
                    $commands.append($button);
                }
            }
        });
        var $level = $('<div class="node-level">'+this.level()+'</div>');
        $footer.append($commands).append($level);
        $e.append($header).append($criteria).append($footer);  
        var top, left;
        if (!this.hasParent()) {
            top = 20;
            left = 20;
        } else {
            var plength = this.parent().clsBranch().length;            
            if (this.parent().children().length == 1) {       // si enfant unique => top du parent
                top = this.parent().$e().pos('top');
            } else if (this.parent().children().length > 1) { // si possède frère(s)
                if (!this.previous().hasChildren()) {         // si le précédent n'a pas d'enfant => top précédent + 180 + 10
                    top = this.previous().$e().pos('top') + 200 + 20;   
                } else {                                      // sinon => top dernier de la branche du précédent + 180 + 10
                    top = this.previous().lastOfBranch().$e().pos('top') + 200 + 20;
                }
            }     
            if (!this.hasPrevious()) {                        // si enfant unique => top du parent
                top = this.parent().$e().pos('top');
            } else { // si possède frère(s)
                if (!this.previous().hasChildren()) {         // si le précédent n'a pas d'enfant => top précédent + 180 + 10
                    top = this.previous().$e().pos('top') + 200 + 20;   
                } else {
                    top = this.previous().lastOfBranch().$e().pos('top') + 200 + 20;
                }
            }
            left = this.parent().$e().pos('left') + 270 + 10;  
        }            
        $e.pos('top', top).pos('left', left);
        /*$e.click(function(){that.select()});*/
        return $e;
    }
    
    this.$header = function() {
        return this.$e().children('.node-header')
    }
    
    this.$popcount = function() {
        return this.$header().children('.node-popcount');
    }
    
    this.$label = function() {
        return this.$header().children('.node-label');
    }
    
    this.$criteria = function() {
        return this.$e().children('.node-criteria');
    }
    
    this.$footer = function() {
        return this.$e().children('.node-footer');
    }
        
    this.$commands = function() {
        return this.$footer().children('.node-commands');
    }
    
    this.$level = function() {
        return this.$footer().children('.node-level');
    }
        
    this.commandButton = function(name) {
        return this.$e().children('.node-footer').children('.node-commands').children('button.node-command-'+name);  
    }
    
    this.disableCommand = function(name) {
        this.commandButton(name).off('click').addClass('disabled');
    }
    
    this.enableCommand = function(name) {
        var that = this;
        this.commandButton(name).on('click', that.commands()[name]).removeClass('disabled');
    }
    
    this.disableCommands = function() {
        var that = this;
        $.each (this.commands(), function(name, command) {
            that.disableCommand(name);
        });
    }
    
    this.enableCommands = function() {
        var that = this;
        $.each (this.commands(), function(name, command) {
            that.enableCommand(name);
        });
    }
    
    this.commands = function() {
        var that = this;
        return {
            copy: function() {},
            save: function() { App.Controller.Node.openSaveModel(that) },
            load: function() { App.Controller.Node.openLoadModel(that) },
            addCriterion: function() { App.Controller.Criterion.add(that); },
            edit: function() { App.Controller.Node.edit(that); },
            remove: function() { App.Controller.Node.delete(that); },
            addNode: function() { App.Controller.Node.add(that.query(), null, that); }
        };
    }
        
    this.pos = function(pos, px) {
        if (px != null) { this.$e().pos(pos,px); return this.$e(); }
        else { return this.$e().pos(pos); }
    }
    
    this.addCriterion = function(criterion) {
        criterion.node(this);
        this._criteria.push(criterion);
        return criterion;
    }
    
    this.select = function() {
        $.each(this.query().nodes(), function(i, node) {
            node.$e().removeClass('node-selected');
        });
        this.$e().addClass('node-selected');
    }
        
    this.loading = function() {
        var $loading = $('<span class="node-loading"></span>');
        this.$popcount().children('span').replaceWith($loading);
        return this;
    }
    
    this.updateCount = function() {
        var $loading = this.$popcount().find('.node-loading'), that = this;
        $loading.fadeOut(500, function() {
            $loading.remove();
            if (that.popcount() != null) {
                var $count = $('<span>'+$.formatNumber(that.popcount(),{format:'#,##0',locale:'fr'})+'</span>').hide();
            } else {
                var $count = $('<span>-</span>').hide();
            } 
            that.$popcount().append($count);
            $count.fadeIn(500);
            var $count = that.$popcount();
            var initColor$Count = $count.css('backgroundColor');
            $count.animate({backgroundColor:'#FE2339'},1000).animate({backgroundColor:initColor$Count},500);
        });
    }
    
    /*this.updateLabel = function(newLabel) {
        
    }*/
            
    this.computeFrom = function(node) {
        var child = node==null?this:node;
        child.loading();
        var $comp = child.compute(true);
        $comp.done(function() {
            child.updateCount();
            if (child.hasChildren()) {
                child.computeFrom(child.first());
            }
            if (child.hasNext()) {
                child.next().loading();
                child.computeFrom(child.next());
            } else {                
                return $comp;
            }
        });
    }
    
    this.compute = function(done, fail) {
        var that = this, aPrevious = []; 
        
        this.computing (true);
        
        if (this.hasPrevious()) {
            var previous = this.previous();
            while (previous != null/* && previous.criteria().length > 0*/) {
                aPrevious.push(previous.toJSON());
                previous = previous.previous();
            }
        }
        
        App.Server.Node.compute(
            this.toJSON(),
            this.hasParent() ? [this.parent().toJSON()] : [],
            aPrevious,            
            function(data) {
                that.popcount(data.count).computed(true).computing(false);
                done(data);
            },
            function(data) {
                fail(data);
            }
        );
            
    }
    
    this.remove = function(callback) {
        var that = this, requests = [];
                
        requests.push(this.$e().hide('slide', {direction: this.hasPrevious() ? 'up' : 'left'}, function() {
            $(this).remove();
        }));
        
        // tous les enfants décalent à gauches
        $.each(this.branch(),function(i,node) {
           requests.push(node.$e().animate({left: node.$e().pos('left')-280}));
        });
        
        // si pas d'enfant pour prendre la place, on remontent les frères et leurs enfants
        if (!this.hasChildren()) {
            var next = this.next();
            while (next != null) {
                var next2 = next;
                requests.push(next.$e().animate({top: next.$e().pos('top')-200-20}));  
                $.each(next.branch(),function(i,child) {
                    requests.push(child.$e().animate({top: child.$e().pos('top')-200-20}));            
                });
                next = next.next();
            }
        }
        
        var parent = this.parent();
        while (parent != null) {
            if (parent.hasNext()) {
                var next = parent.next();
                while (next != null) {
                    if (that.parent().children().length > 1) {
                        var next2 = next;
                        next.$e().animate({top: next.pos('top')-200-20});
                        $.each(next.branch(), function(i,e) {
                            var e2 = e;
                            requests.push(e.$e().animate({top: e.$e().pos('top')-200-20}));
                        });
                    }
                    next = next.next();
                }
            }
            parent = parent.parent();                
        }
        
        if (callback !== undefined) {
            $.when.apply($, requests).done(function() {
                callback();
            });
        }
        
        return this;
    }
    
    this.render = function() {
        if (!this.$e().exists()) {
            var $e = this.build$e();
        } else {
            var $e = this.$e();            
        }
        $e.hide();
        this.query().$tree().append($e);
        var parent = this.parent();
        while (parent != undefined) {
            parent.link();
            if (parent.hasNext()) {
                var next = parent.next();
                while (next != null) {
                    if (this.parent().children().length > 1) {
                        var next2 = next;
                        next.$e().animate({top: next.pos('top') + 200 + 20}, function() {
                            if (next2.hasChildren()) next2.link();
                        });
                        $.each(next.branch(), function(i,e) {
                            var e2 = e;
                            e.$e().animate({top: e.$e().pos('top') + 200 + 20}, function() {
                                if (e2.hasChildren()) e2.link();
                            });
                        });
                    }
                    next = next.next();
                }
            }
            parent = parent.parent();                
        } 
        //$e.show('slide', {direction: this.hasPrevious() ? 'up' : 'left'});
        $e.fadeIn();
        /*if (this.hasParent()) {
            this.link();
            //this.parent().link();
        }*/
        
        
        return this;
    }       
    
    this.unlink = function() {
        this.query().$tree().find('.node-link[data-id="'+this.id()+'"]').remove();
    }
    
    this.link = function() {
        var that = this;
        var childrenCount = this.clsBranch().length;
        var height = null;
        this.query().$tree().find('.node-link[data-id="'+this.id()+'"]').remove();
        var $canvas = $('<canvas data-id="'+this.id()+'" class="node-link"></canvas>');
        $canvas.hide();
        $canvas.attr('width', 30);
        $canvas.pos('top', that.pos('top')).pos('left', this.$e().pos('left')+270-20);
        if (childrenCount == 1) {
            height = 200;
        } else if (childrenCount > 1) {
            height = 200*childrenCount+20*(childrenCount-1)-(this.last().clsBranch().length > 1 ? this.last().clsBranch().length - 1 : 0)*(200+20);
        }
        $canvas.attr('height', height);
        
        this.query().$tree().append($canvas);
        
        var strokeStyle = '#6B6C6B';
        var strokeWidth = 5;
        
        // premier enfant
        $canvas.drawLine({
            strokeStyle: strokeStyle,
            strokeWidth: strokeWidth,
            x1: 0, y1: 100,
            x2: 30, y2: 100
        });
        if (this.children().length > 1) {
            // colonne vertébrale
            $canvas.drawLine({
                strokeStyle: strokeStyle,
                strokeWidth: strokeWidth,
                x1: 15, y1: 100+2.5,
                x2: 15, y2: height-100+2.5
            });
            // autres enfants
            var clsBranchCount = 0;
            $.each (this.children(), function(i, child) {
                if (i > 0) {
                    clsBranchCount = clsBranchCount + (child.previous().hasChildren() ? child.previous().clsBranch().length : 1);
                    var y = 200*(clsBranchCount)+10*(clsBranchCount*2)+100;
                    var line = {
                        strokeStyle: strokeStyle,
                        strokeWidth: strokeWidth,
                        x1: 15+2.5, y1: y,
                        x2: 30, y2: y
                    };
                    $canvas.drawLine(line);
                } 
            });
        }
        $canvas.show();
    }
    
    this.computeCriteria = function(done, fail) {        
        var that = this;
        var criteria = [];
        $.each (this.criteria(), function(i, criterion) {
            criteria.push (criterion.toJSON());
        });
        App.Server.Criterion.compute(
            criteria, 
            function(data) {
                $.each (that.criteria(), function(i, criterion) {
                    criterion.computed(true);
                });
                done(data);
            },
            function(data) {
                fail(data);
            }
        );
    }
       
}

function Criterion(data) {

  // Propriétés autorisées
  this.allowedProperties = ['id', 'attribute', 'operator', 'operation', 'value', 'node', 'criteria', 'typeFunction', 'entiere', 'sequenceFile'];

  this.defaults = {
    id: uid(),
    attribute: null,
    operator: null,
    operation: null,
    value: null,
    node: null,
    typeFunction: null,
    sequenceFile: null
  };

  // Affectation des propriétés
  for (key in data) {
    if ($.inArray(key, this.allowedProperties) > -1) {
      var obj = data[key];
      this['_' + key] = obj;
    }
  }

  this._internalId = null;

  this._computed = false;
  this.computed = function (computed) {
    if (computed != null) {
      this._computed = computed;
      return this;
    } else {
      return this._computed;
    }
  }

  // Getters / setters

  this.id = function (id) {
    if (id != null) {
      this._id = id;
      return this;
    } else {
      return this._id;
    }
  }

  this.internalId = function (internalId) {
    if (internalId != null) {
      this._internalId = internalId;
      return this;
    } else {
      return this._internalId;
    }
  }

  this.attribute = function (attribute) {
    if (attribute != null) {
      this._attribute = attribute;
      return this;
    } else {
      return this._attribute;
    }
  }

  this.operator = function (operator) {
    if (operator != null) {
      this._operator = operator;
      return this;
    } else {
      return this._operator;
    }
  }

  this.typeFunction = function (typeFunction) {
    if (typeFunction != null) {
      this._typeFunction = typeFunction;
      return this;
    } else {
      return this._typeFunction;
    }
  }

  this.operation = function (operation) {
    if (operation != null) {
      this._operation = operation;
      return this;
    } else {
      return this._operation;
    }
  }

  this.value = function (value) {
    if (value != null) {
      this._value = value;
      return this;
    } else {
      return this._value;
    }
  }

  this.entiere = function (entiere) {
    if (entiere != null) {
      this._entiere = entiere;
      return this;
    } else {
      return this._entiere;
    }
  }

  this.node = function (node) {
    if (node != null) {
      this._node = node;
      return this;
    } else {
      return this._node;
    }
  }

  this.dataOperators = {
    equalsTo: {text: "est égal à", type: 'comparaison', shortText: "=", value: "equalsTo", hasValue: true, notAvailableTypes: []},
    notEqualsTo: {text: "est différent de", type: 'comparaison', shortText: "différent de", value: "notEqualsTo", hasValue: true, notAvailableTypes: []},
    greaterThan: {text: "est supérieur ou égal à", type: 'comparaison', shortText: ">=", value: "greaterThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    sGreaterThan: {text: "est strictement supérieur à", type: 'comparaison', shortText: ">", value: "sGreaterThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    lessThan: {text: "est inférieur ou égal à", type: 'comparaison', shortText: "<=", value: "lessThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    sLessThan: {text: "est strictement inférieur à", type: 'comparaison', shortText: "<", value: "sLessThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    isEmpty: {text: "n'est pas renseigné", type: 'logic', shortText: "pas renseigné", value: "isEmpty", hasValue: false, notAvailableTypes: []},
    isNotEmpty: {text: "est renseigné", type: 'logic', shortText: "renseigné", value: "isNotEmpty", hasValue: false, notAvailableTypes: []},
    contains: {text: "contient", type: 'comparaison', shortText: "contient", value: "contains", hasValue: true, notAvailableTypes: ["link", "boolean", "integer"]},
    beginsWith: {text: "commence par", type: 'comparaison', shortText: "commence par", value: "beginsWith", hasValue: true, notAvailableTypes: ["link", "boolean", "integer"]},
    endsWith: {text: "se termine par", type: 'comparaison', shortText: "se termine par", value: "endsWith", hasValue: true, notAvailableTypes: ["link", "boolean", "integer"]},
    between: {text: "est compris entre", type: 'interval', shortText: "compris entre", value: "between", hasValue: true, notAvailableTypes: ["boolean"]},
    notBetween: {text: "n'est pas compris entre", type: 'interval', shortText: "pas compris entre", value: "notBetween", hasValue: true, notAvailableTypes: ["boolean"]},
    in: {text: "est compris dans", type: 'sequence', shortText: "compris dans", value: "in", hasValue: true, notAvailableTypes: ["boolean"]},
    notIn: {text: "n'est pas compris dans", type: 'sequence', shortText: "pas compris dans", value: "notIn", hasValue: true, notAvailableTypes: ["boolean"]}
  };

  this.operators = function () {
    var that = this;
    var operators = [];
    $.each(this.dataOperators, function (i, o) {
      if ($.inArray(that.attribute().dataType() == undefined ? that.attribute().type() : that.attribute().dataType(), o.notAvailableTypes) == -1) {
        operators.push({value: o.value, text: o.text});
      }
    });
    return operators;
  }

  this.dataOperations = {
    exists: {text: 'Aucune', shortText: 'Aucune', value: 'exists'},
    sum: {text: 'Somme / Total', shortText: 'Somme', value: 'sum'},
    average: {text: 'Moyenne', shortText: 'Moyenne', value: 'average'},
    standartDeviation: {text: 'Ecart-type', shortText: 'Ecart-type', value: 'standartDeviation'},
    minimal: {text: 'Valeur minimale', shortText: 'Minimum', value: 'minimum'},
    maximal: {text: 'Valeur maximale', shortText: 'Maximum', value: 'maximum'},
    count: {text: 'Nombre', shortText: 'Nombre', value: 'count'},
    countDistinct: {text: 'Nombre distinct', shortText: 'Nombre distinct', value: 'countDistinct'}
  },
  this.typeFunctions = function (type) {
    var typeFunctions = [];
    if (this.hasTypeFunctions(type)) {
      $.each(this.dataTypeFunctions[type], function (i, tf) {
        typeFunctions.push(tf);
      });
    }
    return typeFunctions;
  }

  this.hasTypeFunctions = function (type) {
    return this.dataTypeFunctions.hasOwnProperty(type);
  }

  this.dataTypeFunctions = {
    date: {
      dayOfWeek: {text: 'Jour de la semaine', shortText: 'Jour de la semaine', value: 'dayOfWeek', returnType: 'integer', formula: 'dayOfWeek({0})', label: 'Jour de la semaine de {0}'},
      dayOfMonth: {text: 'Jour du mois', shortText: 'Jour du mois', value: 'dayOfMonth', returnType: 'integer', formula: 'dayOfMonth({0})', label: 'Jour du mois de {0}'},
      dayOfYear: {text: 'Jour de l\'année', shortText: 'Jour de l\'année', value: 'dayOfYear', returnType: 'integer', formula: 'dayOfYear({0})', label: 'Jour de l\'année de {0}'},
      weekOfYear: {text: 'Semaine de l\'année', shortText: 'Semaine de l\'année', value: 'weekOfYear', returnType: 'integer', formula: 'weekOfYear({0})', label: 'Semaine de l\'année de {0}'},
      monthOfYear: {text: 'Mois de l\'année', shortText: 'Mois de l\'année', value: 'monthOfYear', returnType: 'integer', formula: 'monthOfYear({0})', label: 'Mois de l\'année de {0}'},
      year: {text: 'Année', shortText: 'Année', value: 'year', returnType: 'integer', formula: 'year({0})', label: 'Année de {0}'},
      ageInDay: {text: 'Age en jours', shortText: 'Age en jours', value: 'ageInDay', returnType: 'integer', formula: 'ageInDay({0})', label: 'Age en jours de {0}'},
      ageInMonth: {text: 'Age en mois', shortText: 'Age en mois', value: 'ageInMonth', returnType: 'integer', formula: 'ageInMonth({0})', label: 'Age en mois de {0}'},
      ageInYear: {text: 'Age en années', shortText: 'Age en années', value: 'ageInYear', returnType: 'integer', formula: 'ageInYear({0})', label: 'Age en année de {0}'}
    }
  };

  this.operations = function () {
    var operations = [];
    $.each(this.dataOperations, function (i, o) {
      operations.push({value: o.value, text: o.text});
    });
    return operations;
  }

  this.$inite = function () {
    var that = this, $e;
    if (App.session.mode() != 'readOnly') {
      var $remove = $('<button class="criterion-remove"><i class="icon-close"></i></button>');
      $remove.hide().click(function () {
        that.$e().off('click');
        App.Controller.Criterion.delete(that);
      });
    }
    $e = $('<div class="criterion" data-id="' + this.id() + '">' + this.toString() + '</div>');
    if (App.session.mode() != 'readOnly') {
      $e.click(function () {
        App.Controller.Criterion.edit(that);
      });
      $e.append($remove);
      $e.hover(function () {
        $e.addClass('criterion-hover');
        $remove.show();
      }, function () {
        $e.removeClass('criterion-hover');
        $remove.hide();
      });
    }
    return $e;
  }

  this.$e = function () {
    if ($('.criterion[data-id="' + this.id() + '"]').exists()) {
      var $e = $('.criterion[data-id="' + this.id() + '"]');
    } else {
      var $e = this.$inite();
    }
    return $e;
  }

  this.remove = function () {
    this.$e().fadeOut('slow');
    return this;
  }

  this.render = function () {
    this.node().$e().find('.node-criteria').append(this.$e());
  }

  this.updateRender = function () {
    this.$e().replaceWith(this.$inite());
  }

  this.toJSON = function () {
    return {
      id: this.id(),
      path: this.attribute().path(),
      computed: this.computed(),
      operator: this.operator().name(),
      typeFunction: this.typeFunction() != null ? this.typeFunction().name() : null,
      operation: this.operation() != undefined ? this.operation().name() : null,
      value: this.value() != null ? this.value() : null,
      node: this.node().id(),
      entiere: this.entiere(),
      sequenceFile: this.sequenceFile
    };
  };

  this.toString = function () {
    var that = this;
    
    var str = this.operation() != undefined && this.operation().name() != 'exists' ? this.operation().text + ' de ' : '';
    
    // Toute la base
    if (this.entiere()) {
      str += 'Toute la base';
    }
    
    // Sinon Attribute
    else {
      var attribute = App.DataModel.attribute(this.attribute().path());
      if (this.typeFunction() != null) {
        str += this.typeFunction().label.format(attribute.label()) + ' ';
      } else {
        str += attribute.label() + ' ';
      }
    }
    
    
    if (!this.entiere()) {
      str += this.operator().text + ' ';
    }
    
    if (this.value() != undefined) {
      if (this.attribute().type() == 'link') {
        if (this.operator().type() == 'sequence') {

          if (this.sequenceFile) {
            str += " le fichier '" + this.sequenceFile.name + "'";
          } else {
            var values = this.value().split(',');
            $.each(values, function (i, value) {
              value = value.replace(new RegExp('\'', 'gi'), '');
              str += App.DataModel.referential(that.attribute().schema()).row(value).t;
              if (i == (values.length - 2)) {
                str += ' et ';
              } else if (i < (values.length - 1)) {
                str += ', ';
              }
            });
          }
        } else if (this.operator().type() == 'interval') {
          var values = this.value().split('-');
          $.each(values, function (i, value) {
            if (i == 1)
              str += ' et '
            str += App.DataModel.referential(that.attribute().schema()).row(value).t;
          });
        } else {
          str += App.DataModel.referential(that.attribute().schema()).row(that.value()).t;
        }

      } else {
        var enumLabel = function(v) {
          return $.grep(that.attribute()._enum, function(n, i) {
            return n.value == v;
          })[0].label;
        };
        if (this.operator().type() == 'interval') {
          var value1 = this.value().split('-')[0];
          var value2 = this.value().split('-')[1];
          if (this.attribute().dataType() == 'date') {
            str += $.format.date(new Date(value1.substr(0, 4), parseInt(value1.substr(4, 2)) - 1, value1.substr(6, 2)), 'dd/MM/yyyy') + ' et ' +
                    $.format.date(new Date(value2.substr(0, 4), parseInt(value2.substr(4, 2)) - 1, value2.substr(6, 2)), 'dd/MM/yyyy');
          } else if(this.attribute()._enum) {            
            str += enumLabel(value1) + " et " + enumLabel(value2);
          }
          else {
            str += value1 + ' et ' + value2;
          }
        } else if (this.operator().type() == 'sequence') {
          if (this.sequenceFile) {
            str += " le fichier '" + this.sequenceFile.name + "'";
          } else {
            var values = this.value().split(',');
            $.each(values, function (i, value) {
              if (that.attribute().dataType() == 'date') {
                value = value.replace(new RegExp('\'', 'gi'), '');
                value2 = $.format.date(new Date(value.substr(0, 4), parseInt(value.substr(4, 2)) - 1, value.substr(6, 2)), 'dd/MM/yyyy');
                str += value2.replace(new RegExp('\'', 'gi'), '');
              } else if(that.attribute()._enum) { 
                str += enumLabel(eval(value));
              } 
              else {
                str += value;
              }
              if (i == (values.length - 2)) {
                str += ' et ';
              } else if (i < (values.length - 1)) {
                str += ', ';
              }
            });
          }
        } else {
          if(this.attribute()._enum) {  
            str += enumLabel(this.value());
          } else {
            switch (this.attribute().dataType()) {
              case 'boolean':
                str += this.value() == 1 ? 'Oui' : 'Non';
                break;
              case 'date':
                str += $.format.date(new Date(this.value().substr(0, 4), parseInt(this.value().substr(4, 2)) - 1, this.value().substr(6, 2)), 'dd/MM/yyyy');
                break;
              default:
                str += this.value();
            }
          }
        }
      }
    }
    
    return str;
  };

  this.dialog = function (callback, edition) {

    var that = this, title, inputValue;
    var $content = $('<div class="criterion-form pn-form"></div>');

    function inputValueCode(setValue) {
      if (that.operator().type() == 'interval') {
        inputValue = new CriterionIntervalInput(that.inputValue());
      } else if (that.operator().type() == 'sequence') {
        inputValue = new CriterionSequenceInput(that.inputValue());
      } else {
        inputValue = that.inputValue();
      }
      if (setValue === true) {
        var value = that.value();
        if(that.sequenceFile) {
          value = {file: that.sequenceFile};
        }
        inputValue.value(value);
      }
      var $input = inputValue.$input();
      $content.append($input.$wrap);
            
      if($input.$input) {
        $input.$input.on("file:loading", function() {
          dialog.enableValid(false);
        });

        $input.$input.on("file:loaded", function() {
          dialog.enableValid(true);
        });
      }
    
    }

    function resetInput(inputs) {
      $.each(inputs, function (i, input) {
        $content.find('.criterion-' + input + '-wrap').remove();
        that['_' + input] = null;
      });
    }

    var $attr = this.$inputAttribute(function () {
      resetInput(['operation', 'typeFunction', 'operator', 'value']);
      if (that.hasTypeFunctions(that.attribute().dataType())) {
        $content.append(that.$inputTypeFunction(that.attribute().dataType(), function () {
          resetInput(['operation', 'operator', 'value']);
          if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
            $content.append(that.$inputOperation('multiple', function () {}));
          }
          if (that.attribute().name() != 'entiere') {
            $content.append(that.$inputOperator(function () {
              resetInput(['value']);
              if (that.operator().hasValue) {
                inputValueCode();
              }
            }));
          } else {
            that.operator(new Operator('isNotEmpty'));
          }
        }));
      } else {
        if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
          $content.append(that.$inputOperation('multiple', function () {}));
        }
        if (!that.entiere()) {
          $content.append(that.$inputOperator(function () {
            resetInput(['value']);
            if (that.operator().hasValue) {
              inputValueCode();
            }
          }));
        } else {
          that.operator(new Operator('isNotEmpty'));
        }
      }
    });

    $content.append($attr);

    if (edition) {
      if (!that.entiere()) {
        if (that.typeFunction() != null) {
          $content.append(that.$inputTypeFunction(that.typeFunction().type(), function () {
            resetInput(['operation', 'operator', 'value']);
            if (that.operation() != null) {
              if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
                $content.append(that.$inputOperation('multiple', function () {
                  inputValueCode();
                }));
              }
            }
            $content.append(that.$inputOperator(function () {
              resetInput(['value']);
              if (that.operator().hasValue) {
                inputValueCode();
              }
            }));
          }));
          if (that.operation() != null) {
            if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
              $content.append(that.$inputOperation('multiple', function () {
                resetInput(['value']);
                inputValueCode();
              }));
            }
          }
          $content.append(that.$inputOperator(function () {
            resetInput(['value']);
            if (that.operator().hasValue) {
              inputValueCode();
            }
          }));
          if (that.operator().hasValue)
            inputValueCode(true);
        } else {
          if (that.operation() != null) {
            if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
              $content.append(that.$inputOperation('multiple', function () {
                resetInput(['value']);
                inputValueCode();
              }));
            }
          }
          $content.append(that.$inputOperator(function () {
            resetInput(['value']);
            if (that.operator().hasValue) {
              inputValueCode();
            }
          }));
          if (that.operator().hasValue)
            inputValueCode(true);
        }
      } else {
        that.operator(new Operator('isNotEmpty'));
      }
    }
    if (edition)
      title = 'Critère \'' + this.toString() + '\'';
    else
      title = 'Nouveau critère';

    var dialog = new UI.Dialog(title, $content, {width: 1000}, function() {
      if (that.operator().hasValue) {        
        if (inputValue.file) {
          that.sequenceFile = inputValue.file;
        }
        that.value(inputValue.value());
      } else {
        that._value = null;
      }
      dialog.close();
      callback();
    });

    return dialog;
  };

  this.$inputAttribute = function (callback) {
    var that = this;
    var $wrap = $('<span class="criterion-attribute-wrap pn-form-wrap pn-form-search-wrap"></span>');
    var $button = $('<button class="k-button"><i class="icon-search"/></button>');
    var $input = $('<span class="criterion-attribute-input">' + (this.attribute() == null ? 'Sélectionner une variable' : (this.entiere() ? 'Toute la base' : this.attribute().label())) + '</span>');
    $button.click(function () {
      var dialog = App.DataModel.dialog('Sélectionner la variable', function (attribute) {
        if (attribute.type() == 'attribute' || (attribute.type() == 'link' && attribute.linkCardinality() != 'multiple')) {
          that.attribute(attribute);
          if (attribute.dataType() == 'entiere') {
            that.entiere(true);
            $input.text('Toute la base');
          } else {
            that.entiere(false);
            $input.text(attribute.label());
          }
          callback();
          dialog.close();
        }
      }, {hideQueryAttrs: true});
    });
    $wrap.append($button).append($input);
    return $wrap;
  };

  this.$inputOperator = function (callback) {
    var that = this;
    var $wrap = $('<span class="criterion-operator-wrap pn-form-wrap"></span>');
    var $input = $('<input class="criterion-operator-input"/>');
    $wrap.append($input);
    $input.kendoDropDownList({
      dataTextField: 'text',
      dataValueField: 'value', 
      dataSource: that.operators(),
      optionLabel: "Opérateur...",
      select: function (e) {
        that.operator(new Operator(this.dataItem(e.item.index()).value));
        callback();
      }
    });
    if (this.operator() != null)
      $input.data('kendoDropDownList').value(this.operator().name());
    return $wrap;
  };

  this.$inputTypeFunction = function (type, callback) {
    var that = this;
    var $wrap = $('<span class="criterion-typeFunction-wrap pn-form-wrap"></span>');
    var $input = $('<input class="criterion-typeFunction-input"/>');
    $wrap.append($input);
    var dataSource = that.typeFunctions(type);
    dataSource.unshift({text: 'Aucune', value: 'none'});
    $input.kendoComboBox({
      dataTextField: 'text', dataValueField: 'value', dataSource: dataSource,
      filter: 'contains', placeholder: 'Fonction...', select: function (e) {
        if (this.dataItem(e.item.index()).value != 'none') {
          that.typeFunction(new TypeFunction(type, this.dataItem(e.item.index()).value));
          that.attribute().dataType(that.typeFunction().returnType);
        }
        callback();
      }
    });
    if (this.typeFunction() != null)
      $input.data('kendoComboBox').value(this.typeFunction().name());
    return $wrap;
  };

  this.$inputOperation = function (type, callback) {
    var that = this;
    var $wrap = $('<span class="criterion-operation-wrap pn-form-wrap"></span>');
    var $input = $('<input class="criterion-operation-input"/>');
    $wrap.append($input);
    $input.kendoComboBox({
      dataTextField: 'text', dataValueField: 'value', dataSource: that.operations(),
      filter: 'contains', placeholder: 'Opérations...', select: function (e) {
        that.operation(new Operation(this.dataItem(e.item.index()).value));
        callback();
      }
    });
    if (this.operation() != null)
      $input.data('kendoComboBox').value(this.operation().name());
    return $wrap;
  };

  this.inputValue = function () {
    var that = this, input;
    console.log(that.attribute());
    if(that.attribute()._enum && that.attribute()._enum.length) {
      input = new CriterionEnumInput({enum: that.attribute()._enum});
    } else {
      switch (that.attribute().dataType()) {
        case 'integer':
          input = new CriterionNumberInput();
          break;
        case 'float':
          input = new CriterionNumberInput({
            format: that.attribute().format(),
            type: that.attribute().dataType()
          });
          break;
        case 'string':
          input = new CriterionStringInput();
          break;
        case 'boolean':
          input = new CriterionBooleanInput();
          break;
        case 'date':
        case 'datetime':
          input = new CriterionDateInput();
          break;
        default:
          if (that.attribute().type() == 'link') {
            if (that.attribute().hugeData()) {
              input = new CriterionHugeDataLinkInput(that.attribute().schema(), that.attribute().keyName(), that.operator().type() == 'sequence');
            } else {
              input = new CriterionLinkInput(that.attribute().schema(), that.attribute().keyName());
            }
          }
      }
    }    
    return input;
  };

  this.compute = function (done, fail) {
    var that = this;
    App.Server.Criterion.compute(
            [this.toJSON()],
            function (data) {
              that.computed(true);
              done(data);
            },
            function (data) {
              fail(data);
            }
    );
  }

}
function CriterionNumberInput(params) {
        
    if (params == null) params = {};    
    this._format = params.format != null ? params.format : null;
    this._type = params.type != null ? params.type : 'integer';
    this._exists = false;         
    this._input = {};
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'greaterThan', 'sGreaterThan',
        'lessThan', 'sLessThan',
        'isEmpty', 'isNotEmpty', 
        'between', 'notBetween',
        'in', 'notIn'
    ];    
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.data('kendoNumericTextBox').value(value);
        } else { 
            return this.$input().$input.data('kendoNumericTextBox').value();
        }
    }
   
    this.$input = function() {
        var that = this, params;                 
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="criterion-value-input"/>');
            $wrap.append($input);
            $input = this.init($input);
            this._input = {
                $wrap: $wrap,
                $input: $input
            };
            return this._input;
        }
    }
    
    this.init = function($input) {
        if (this._type == 'float') {  
            switch (this._format) {
                case 'percent':
                    params = {
                        format: 'p0',
                        min: 0,
                        max: 1,
                        step: 0.01
                    };
                    break;
                case 'amount':
                    params = {
                        format: '#.00 €'
                    };
                    break;
            }    
        } else if (this._type == 'integer') {                              
            params = {
                decimal: 0,
                step: 1
            };
        }                     
        $input.kendoNumericTextBox(params);
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}
function CriterionStringInput() {
        
    this._exists = false;         
    this._input = {};
    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
        'beginsWith', 'endsWith', 'contains'
    ];    
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.val(value);
        } else { 
            return this.$input().$input.val();
        }
    }
   
    this.$input = function() {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="k-textbox criterion-value-input"/>');
            $wrap.append($input);      
            $input = this.init($input);  
            this._input = {
                $wrap: $wrap,
                $input: $input
            };
            return this._input;
        }
    }
    
    this.init = function($input) {
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}
function CriterionBooleanInput() {
    
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
    ];    
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.data('kendoComboBox').value(value);
        } else { 
            return this.$input().$input.data('kendoComboBox').value();
        }
    }

    this.$input = function($wrap) {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="criterion-value-input" data-id="'+this._uid+'"/>');
            $wrap.append($input);
            $wrap.append($input);
            $input = this.init($input);            
            this._input = {
                $wrap: $wrap,
                $input: $input
            }
            return this._input;
        }
    }
    
    this.init = function($input) {
        $input.kendoComboBox({
            dataTextField: 'text',
            dataValueField: 'value',
            dataSource: [
                {   text:'oui',
                    value:'1'  },
                {   text:'non',
                    value:'0'  }
            ],
            criterion: 'contains',
            placeholder: 'Valeur...',
            suggest: true
        });
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}
function CriterionDateInput() {
    
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'greaterThan', 'sGreaterThan',
        'lessThan', 'sLessThan',
        'isEmpty', 'isNotEmpty', 
        'between', 'notBetween',
        'in', 'notIn'
    ];  
        
    this.value = function(value) {
        if (value != null) {
            var date = new Date(value.substr(0,4), value.substr(4,2), value.substr(6,2));
            this.$input().$input.data('kendoDatePicker').value(date);
        } else { 
            return $.format.date(this.$input().$input.data('kendoDatePicker').value(),'yyyyMMdd');
        }
    }   

    this.$input = function() {
        var that = this, params;        
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="criterion-value-input"/>');
            $wrap.append($input);
            $input = this.init($input);
            this._input = {
                $wrap: $wrap,
                $input: $input
            }
            return this._input;
        }
    }
    
    this.init = function($input) {        
        $input.kendoDatePicker({
            format: 'dd/MM/yyyy',
            culture: 'fr-FR'
        });
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}
function CriterionLinkInput(schema, key) {
    
    this._schema = schema;
    this._key = key;
    //this._keyAlias = key.charAt(0);
    this._sequenced = false;
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
    ];    
    this._dataItem = null;
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.data(this._sequenced ? 'kendoMultiSelect' : 'kendoComboBox').value(value);
        } else {
            if (this._sequenced) {
                return this.$input().$input.data('kendoMultiSelect').value().join(',')
            } else {           
                if (this._dataItem == undefined) {
                    return this.$input().$input.data('kendoComboBox').dataItem().v;
                } else {
                    return this._dataItem.v;
                }
            }
        }
    }
   
    this.$input = function() {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="criterion-value-input"/>');         
            $wrap.append($input);             
            $input = this.init($input);            
            this._input = {
                $wrap: $wrap,
                $input: $input
            }
            return this._input;
        }
    }
    
    this.init = function($input, sequenced) {
        var that = this;
        if (sequenced != null) this._sequenced = sequenced;
        var dataSource = /*new kendo.data.DataSource({
            transport: { read: { url: App.config.server.url+'/schema/'+this._schema+'/data',
                data: { data: {  keyName: that._key, orderBy: { name: 'short_text', way: 'asc' }},
                        auth: App.account.auth
                }}
            }
        });*/ App.DataModel.referential(this._schema).data();
        var dataItem = null;
        var kendoParams = {
            dataSource: dataSource, dataTextField: 't', dataValueField: 'v',
            autoBind: true, filter: 'contains', placeholder: 'Valeur...', suggest: false,
            select: function(e) {
                that._dataItem = this.dataItem(e.item.index());
            }
        };
        if (this._sequenced) $input.kendoMultiSelect(kendoParams);
                        else $input.kendoComboBox(kendoParams);
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}
function CriterionHugeDataLinkInput(schema, key, sequenced) {
    
    this._schema = schema;
    this._key = key;
    this._sequenced = sequenced;
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
    ];    
    this._dataItem = null;
        
    this.value = function(value) {
        var that = this;
        if (value != null) {
            var values = value.replace(new RegExp('\'', 'gi'),'').split(',');
            var dataSource = [];
            $.each (values, function(i, value) {
                dataSource.push(App.DataModel.referential(that._schema).row(value));
            });
            this.$input().$input.data('kendoMultiSelect').setDataSource(dataSource);
            this.$input().$input.data('kendoMultiSelect').value(values);
        } else {
            return this.$input().$input.data('kendoMultiSelect').value()[0];
        }
    }    
    
    this.$input = function() {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $add = $('<button class="k-button">Ajouter</button>'); 
            $add.css('marginTop', '-15px');             
            $add.click(function() {
                var kGrid = $list.data('kendoGrid');
                var dataItems = $input.data('kendoMultiSelect').dataItems();
                var data = [];
                $.each (dataItems, function(i, item) {
                    data.push({v: item.v, t: item.t});
                });
                $.each (kGrid.select(), function(i, item) {
                    data.push ({
                        v: kGrid.dataItem(kGrid.select()[i]).v,
                        t: kGrid.dataItem(kGrid.select()[i]).t
                    });
                });
                var vdata = [];
                $.each (data, function(i, item) {
                   vdata.push(item.v); 
                });
                $input.data('kendoMultiSelect').setDataSource(data);
                $input.data('kendoMultiSelect').value(vdata);
            });       
            $wrap.append($add);             
            var $input = $('<div class="criterion-value-input"></div>');
            $input.css('margin', '10px');
            $wrap.append($input);             
            $input = this.init($input);  
            
            var $search_wrap = $('<div></div>');
            $wrap.append($search_wrap)
            
            var $search = $('<input placeholder="Filter les résultats" style="width: 100%" class="k-textbox"/>');
            $search_wrap.append($search);
            
            $search.on('input', function(e) {
              var value = e.target.value.toUpperCase();
              if(value.length === 0) {
                $list.data('kendoGrid').dataSource.filter([])
              } else {
                $list.data('kendoGrid').dataSource.filter({ field: 't', operator: 'contains', value: value });
              }
            });
            
            var $list = $('<div></div>');            
            $wrap.append($list);
            $list = this.list($list);
            this._input = {
                $wrap: $wrap,
                $input: $input
            }
            return this._input;
        }
    }
    
    this.init = function($input) {
        var that = this;
        var kendoParams = {
            dataTextField: 't', dataValueField: 'v',
            autoBind: true, filter: 'contains', placeholder: 'Valeur...', suggest: false,
            maxSelectedItems: that._sequenced ? null : 1
        };
        $input.kendoMultiSelect(kendoParams);
        return $input;
    }
    
    this.list = function($list) {
        var that = this;
        var dataItem = null;
        var kendoParams = {
            dataSource: {
                data: App.DataModel.referential(this._schema).data(),
                pageSize: 8
            },
            sortable: true,
            selectable: this._sequenced ? 'multiple, row' : true, 
           navigatable: true,
            filterable: true,
            pageable: {  
                messages: {
                    display: "{0} - {1} de {2} éléments",
                    empty: "Aucun élément",
                    page: "Page",
                    of: "de {0}",
                    itemsPerPage: "éléments par page",
                    first: "Première page",
                    previous: "Page précédente",
                    next: "Page suivante",
                    last: "Dernière page"
                }
            },
            columns: [{
                field: 't',
                title: 'Libellé',
                width: 120,
                filterable: true
            }],
            columnMenu: {
                messages: {
                    refresh: "Rafraîchir",
                    columns: "Choisir les colonnes",
                    filter: "Appliquer",
                    sortAscending: "Trier A-Z",
                    sortDescending: "Trier Z-A"
                }
            }
        };
        $list.kendoGrid(kendoParams);
        return $list;
    }
        
}
function CriterionIntervalInput(criterionInput) {
    
    this._criterionInput = criterionInput;
    this._exists = false;         
    this._input = {};
    
    this.value = function(value) {
        if (value != null) {
            this.$input().input1.value(value.split('-')[0]);
            this.$input().input2.value(value.split('-')[1]);
        } else { 
            return this.$input().input1.value()+'-'+
                   this.$input().input2.value();
        }
    }

    this.$input = function() {
        var that = this;                 
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var input1 = criterionInput.clone ? criterionInput.clone() : clone(criterionInput);
            var input2 = criterionInput.clone ? criterionInput.clone() : clone(criterionInput);
            var $input1 = input1.$input().$input;
            var $input2 = input2.$input().$input;
            $wrap.append(input1.$input().$input);            
            $wrap.append(' et ');
            $wrap.append(input2.$input().$input);
            $input1 = input1.init($input1);
            $input2 = input2.init($input2);
            this._input = {
                $wrap: $wrap,
                input1: input1,
                input2: input2
            };
            return this._input;
        }
    }
    
}



function CriterionSequenceInput(criterionInput) {

  this._criterionInput = criterionInput;
  this._exists = false;
  this._input = {};

  this.value = function (value) {
    var that = this;
    if (value != null) {
      if (this._criterionInput.constructor.name == 'CriterionLinkInput') {
        var values = value.replace(new RegExp('\'', 'gi'), '').split(',');
        this.$input().$input.data('kendoMultiSelect').value(values);
      } else if (this._criterionInput.constructor.name == 'CriterionHugeDataLinkInput') {
        var values = value.replace(new RegExp('\'', 'gi'), '').split(',');
        var dataSource = [];
        $.each(values, function (i, value) {
          dataSource.push(App.DataModel.referential(that._criterionInput._schema).row(value));
        });
        this.$input().$input.data('kendoMultiSelect').setDataSource(dataSource);
        this.$input().$input.data('kendoMultiSelect').value(values);
      } else if (this._criterionInput.constructor.name === 'CriterionDateInput') {
        var values = [];
        $.each(value.split(','), function (i, value) {
          value = value.replace(new RegExp('\'', 'gi'), '');
          values.push($.format.date(new Date(value.substr(0, 4), value.substr(4, 2), value.substr(6, 2)), 'dd/MM/yyyy'));
        });
        this.$input().$input.val(values.join(','));
      } else {
        if(value.file) {
          that.fileMode(value.file.name);
        } else {
          this.$input().$input.val(value.replace(new RegExp('\'', 'gi'), ''));
        }
      }
    } else {
      if (this._criterionInput.constructor.name == 'CriterionLinkInput' ||
        this._criterionInput.constructor.name == 'CriterionHugeDataLinkInput') {
        var values = this.$input().$input.data('kendoMultiSelect').value();
      } else if (this._criterionInput.constructor.name === 'CriterionDateInput') {
        var values = [];
        $.each(this.$input().$input.val().split(','), function (i, value) {
          values.push($.format.date(new Date(value.substr(6, 4), value.substr(3, 2), value.substr(0, 2)), 'yyyyMMdd'));
        });
      } else {
        var values = this.$input().$input.val().split(',');
      }
      var values2 = [];
      $.each(values, function (i, value) {
        values2.push('\'' + value + '\'');
      });
      return values2.join(',');
    }
  };

  this.fileMode = function(filename) {
    var $wrap = this.$input().$wrap;
    $wrap.find(".criterion-value-wrap").hide();
    $wrap.find(".criterion-sequence-add").hide();
    $wrap.find(".criterion-sequence-value").hide();
    $wrap.find(".criterion-value-input").hide();
    $wrap.find(".criterion-sequence-file").show().val(filename);
  },

  this.$input = function () {
    var that = this;
    if (this._exists) {
      return this._input;
    } else {
      this._exists = true;
      var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
      if (this._criterionInput.constructor.name == 'CriterionLinkInput') {
        var input = clone(criterionInput);
        var $input = input.$input().$input;
        $wrap.append($input);
        $input = input.init($input, 'sequence');
      } else if (this._criterionInput.constructor.name == 'CriterionHugeDataLinkInput') {
        var $input = criterionInput.$input().$input;
        $wrap.append(criterionInput.$input().$wrap);
      } else {
        var $add = $('<button class="k-button criterion-sequence-add"><i class="icon-plus" title="Ajouter une valeur"/></button>');
        //$add.css('marginTop', '-15px');
        var $input = $("<textarea>", {class: "k-textbox criterion-sequence-value", cols: 70, rows: 5});
        var value = criterionInput.clone ? criterionInput.clone() : clone(criterionInput);
        var $value = value.$input().$input;
        $wrap.append($value);
        $wrap.append($add);
        $wrap.append($input);
        $value = value.init($value);
        $add.click(function () {
          if ($value.val() !== '') {
            $input.text($input.text() + ($input.text() !== '' ? ',' : '') + $value.val());
            $value.val('');
          }
          $value.focus();
        });

        var $uploadButton = $("<button>", {class: "k-button", html: "<i class='icon-download-3'></i> Importer une liste"}).appendTo($wrap);

        var $fileName = $("<input>", {disabled: true, class:"criterion-sequence-file k-textbox"}).appendTo($wrap).hide();
        
        $uploadButton.on("click", function () {
          $fileInput.trigger("click");
        }).appendTo($wrap);
        
        var $fileInput = $("<input>", {
          class: "criteria-sequence-file-input",
          type: "file",
          accept: ".txt, .csv"
        }).appendTo($wrap);

        $fileInput.on("change", function () {  
          var formData = new FormData();
          var file = $fileInput[0].files[0];  
          formData.append('file', file);  
          that.fileMode(file.name);
          $fileName.val("Téléchargement...");
          $uploadButton.hide();
          $input.trigger("file:loading");
          App.Server.Criterion.file(formData).done(function(data) {
            $fileName.val(file.name);
            $uploadButton.show();
            data.name = file.name;
            that.file = data;
            $input.trigger("file:loaded");
          });          
        });

      }
      this._input = {
        $wrap: $wrap,
        $input: $input
      };
      return this._input;
    }
  };

}



function CriterionEnumInput(params) {

  if (params == null)
    params = {};
  
  this.enum = params.enum;
  this._exists = false;
  this._input = {};
  this._availableOperators = [
    'equalsTo', 'notEqualsTo',
    'greaterThan', 'sGreaterThan',
    'lessThan', 'sLessThan',
    'isEmpty', 'isNotEmpty',
    'between', 'notBetween',
    'in', 'notIn'
  ];

  this.value = function (value) {
    if (value != null) {
      this.$input().$input.data('kendoDropDownList').value(value);
    } else {
      return this.$input().$input.data('kendoDropDownList').value();
    }
  }

  this.$input = function () {
    var that = this, params;
    if (this._exists) {
      return this._input;
    } else {
      this._exists = true;
      var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
      var $input = $('<input class="criterion-value-input"/>');
      $wrap.append($input);
      $input = this.init($input);
      this._input = {
        $wrap: $wrap,
        $input: $input
      };
      return this._input;
    }
  }

  this.init = function ($input) {
    $input.kendoDropDownList({
      dataSource: this.enum,
      dataValueField: "value",
      dataTextField: "label"
    });
    return $input;
  }

  this.validation = function () {
    return this.value() != '';
  }
  
  this.clone = function() {
    if(typeof(this) != 'object' || this == null){
        return this;
    }
    var newInstance = new this.constructor();
    newInstance.enum = [];
    $.each(this.enum, function(i, v) {
      newInstance.enum.push({value: v.value, label: v.label});
    });
    return newInstance;
  }

}
function Operator(name) {
        
    this._name = name;
    
    this.dataOperators = {
        equalsTo    : { text: "est égal à"                 , type: 'comparaison', shortText: "="                 , value: "equalsTo"     , hasValue: true,  notAvailableTypes: []},
        notEqualsTo : { text: "est différent de"           , type: 'comparaison', shortText: "différent de"      , value: "notEqualsTo"  , hasValue: true,  notAvailableTypes: []},
        greaterThan : { text: "est supérieur ou égal à"    , type: 'comparaison', shortText: ">="                , value: "greaterThan"  , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        sGreaterThan: { text: "est strictement supérieur à", type: 'comparaison', shortText: ">"                 , value: "sGreaterThan" , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        lessThan    : { text: "est inférieur à"            , type: 'comparaison', shortText: "<="                , value: "lessThan"     , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        sLessThan   : { text: "est strictement inférieur à", type: 'comparaison', shortText: "<"                 , value: "sLessThan"    , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        isEmpty     : { text: "n'est pas renseigné"        , type: 'logic'      , shortText: "pas renseigné"     , value: "isEmpty"      , hasValue: false, notAvailableTypes: []},
        isNotEmpty  : { text: "est renseigné"              , type: 'logic'      , shortText: "renseigné"         , value: "isNotEmpty"   , hasValue: false, notAvailableTypes: []},
        contains    : { text: "contient"                   , type: 'comparaison', shortText: "contient"          , value: "contains"     , hasValue: true,  notAvailableTypes: ["link", "boolean", "integer"] },
        beginsWith  : { text: "commence par"               , type: 'comparaison', shortText: "commence par"      , value: "beginsWith"   , hasValue: true,  notAvailableTypes: ["link", "boolean", "integer"] },
        endsWith    : { text: "se termine par"             , type: 'comparaison', shortText: "se termine par"    , value: "endsWith"     , hasValue: true,  notAvailableTypes: ["link", "boolean", "integer"] },
        between     : { text: "est compris entre"          , type: 'interval'   , shortText: "compris entre"     , value: "between"      , hasValue: true,  notAvailableTypes: ["boolean"] },
        notBetween  : { text: "n'est pas compris entre"    , type: 'interval'   , shortText: "pas compris entre" , value: "notBetween"   , hasValue: true,  notAvailableTypes: ["boolean"] },
        in          : { text: "est compris dans"           , type: 'sequence'   , shortText: "compris dans"      , value: "in"           , hasValue: true,  notAvailableTypes: ["boolean"]},
        notIn       : { text: "n'est pas compris dans"     , type: 'sequence'   , shortText: "pas compris dans"  , value: "notIn"        , hasValue: true,  notAvailableTypes: ["boolean"]}
    };
    
    this.text = this.dataOperators[this._name].text;
    this.shortText = this.dataOperators[this._name].shorText;
    this.hasValue = this.dataOperators[this._name].hasValue;
    this.type = function() {
        return this.dataOperators[this._name].type;
    }
    this.notAvailableTypes = this.dataOperators[this._name].notAvailableTypes;
    
    this.name = function() {
        return this._name;
    }
    
}
function Operation(name) {
        
    this._name = name;
    
    this.dataOperations = {
        exists            : { text: 'Aucune'         , shortText: 'Aucune'         , value: 'exists'            },
        sum               : { text: 'Somme / Total'  , shortText: 'Somme'          , value: 'sum'               },
        average           : { text: 'Moyenne'        , shortText: 'Moyenne'        , value: 'average'           },
        standartDeviation : { text: 'Ecart-type'     , shortText: 'Ecart-type'     , value: 'standartDeviation' },
        minimal           : { text: 'Valeur minimale', shortText: 'Minimum'        , value: 'minimum'           },
        maximal           : { text: 'Valeur maximale', shortText: 'Maximum'        , value: 'maximum'           },
        count             : { text: 'Nombre'         , shortText: 'Nombre'         , value: 'count'             },
        countDistinct     : { text: 'Nombre distinct', shortText: 'Nombre distinct', value: 'countDistinct'     }
    };
    
    this.text = this.dataOperations[this._name].text;
    this.shortText = this.dataOperations[this._name].shorText;
    
    this.name = function() {
        return this._name;
    };
    
}
function Attribute(data) {
    
    // Propriétés autorisées
    this.allowedProperties = ['name', 'label', 'type', 'format', 'schema', 'path', 'dataType', 'linkCardinality', 'keyName', 'hugeData', 'enum', 'query'];    
            
    // Affectation des propriétés
    for (key in data) {  
        if ($.inArray(key, this.allowedProperties) > -1) {
            var obj = data[key];
            this['_'+key] = obj;
        }
    }
        
    // Getters / setters
    
    this.name = function(name) {
        if (name != null) { this._name = name; return this; }
        else { return this._name; }
    }    
    
    this.label = function(label) {
        if (label != null) { this._label = label; return this; }
        else { return this._label; }
    }   
    
    this.type = function(type) {
        if (type != null) { this._type = type; return this; }
        else { return this._type; }
    }    
    
    this.format = function(format) {
        if (format != null) { this._format = format; return this; }
        else { return this._format; }
    }
    
    this.path = function(path) {
        if (path != null) { this._path = path; return this; }
        else { return this._path; }
    }
    
    this.dataType = function(dataType) {
        if (dataType != null) { this._dataType = dataType; return this; }
        else { return this._dataType; }
    }
    
    this.linkCardinality = function(linkCardinality) {
        if (linkCardinality != null) { this._linkCardinality = linkCardinality; return this; }
        else { return this._linkCardinality; }
    }
    
    this.keyName = function(keyName) {
        if (keyName != null) { this._keyName = keyName; return this; }
        else { return this._keyName; }
    }
    
    this.schema = function(schema) {
        if (schema != null) { this._schema = schema; return this; }
        else { return this._schema; }
    }
    
    this.hugeData = function(hugeData) {
        if (hugeData != null) { this._hugeData = hugeData; return this; }
        else { return this._hugeData; }
    }
}
function TypeFunction(type, name) {
        
    this._type = type;
    this._name = name;
    
    this.dataTypeFunctions = {
        date: {
            dayOfWeek  : { text: 'Jour de la semaine' , shortText: 'Jour de la semaine' , value: 'dayOfWeek'  , returnType: 'integer', formula: 'dayOfWeek({0})'  , label: 'Jour de la semaine de {0}'   },
            dayOfMonth : { text: 'Jour du mois'       , shortText: 'Jour du mois'       , value: 'dayOfMonth' , returnType: 'integer', formula: 'dayOfMonth({0})' , label: 'Jour du mois de {0}'         },
            dayOfYear  : { text: 'Jour de l\'année'   , shortText: 'Jour de l\'année'   , value: 'dayOfYear'  , returnType: 'integer', formula: 'dayOfYear({0})'  , label: 'Jour de l\'année de {0}'     },
            weekOfYear : { text: 'Semaine de l\'année', shortText: 'Semaine de l\'année', value: 'weekOfYear' , returnType: 'integer', formula: 'weekOfYear({0})' , label: 'Semaine de l\'année de {0}'  },
            monthOfYear: { text: 'Mois de l\'année'   , shortText: 'Mois de l\'année'   , value: 'monthOfYear', returnType: 'integer', formula: 'monthOfYear({0})', label: 'Mois de l\'année de {0}'     },
            ageInDay   : { text: 'Age en jours'       , shortText: 'Age en jours'       , value: 'ageInDay'   , returnType: 'integer', formula: 'ageInDay({0})'   , label: 'Age en jours de {0}'         },
            ageInMonth : { text: 'Age en mois'        , shortText: 'Age en mois'        , value: 'ageInMonth' , returnType: 'integer', formula: 'ageInMonth({0})' , label: 'Age en mois de {0}'          },
            ageInYear  : { text: 'Age en années'      , shortText: 'Age en années'      , value: 'ageInYear'  , returnType: 'integer', formula: 'ageInYear({0})'  , label: 'Age en année de {0}'         },
            year       : { text: 'Année'   			  , shortText: 'Année'   			, value: 'year'	      , returnType: 'integer', formula: 'year({0})'		  , label: 'Année de {0}'		         },
        }
    };
    
    this.text = this.dataTypeFunctions[this._type][this._name].text;
    this.shortText = this.dataTypeFunctions[this._type][this._name].shorText;
    this.value = this.dataTypeFunctions[this._type][this._name].value;
    this.returnType = this.dataTypeFunctions[this._type][this._name].returnType;
    this.formula = this.dataTypeFunctions[this._type][this._name].formula;
    this.label = this.dataTypeFunctions[this._type][this._name].label;
    
    this.name = function() {
        return this._name;
    }
    
    this.type = function() {
        return this._type;
    }
    
}
if (!App.Model) {
  App.Model = {};
}

var Field = Backbone.Model.extend({  
});

var FieldCollection = Backbone.Collection.extend({
  model: Field
});

var Settings = Backbone.Model.extend({
  
  defaults: {    
    delimiter: ";",
    enclosure: "",
    header: true,
    targets: []
  },  
  
  initialize: function () {
    this.set("fields", new FieldCollection());
    this.set("targets", []);
  },
  
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.fields = this.get("fields").toJSON();
    return json;
  }
  
});

App.Model.Extraction = Backbone.Model.extend({
  
  defaults: {
    name: null,
    filename: null,
    description: null,
    limit: null,
    state: null,
    paymentStatus: null,
    sessionId: null
  },
  
  urlRoot: function() {
    return App.config.server.url + '/extractions';
  },
  
  sync: function (method, model, options) {
    var data = {};
    if (model && (method === 'create' || method === 'update' || method === 'patch')) {
      options.contentType = 'application/json';
      data = options.attrs || model.toJSON();
    }
    if(method === "read") {
      options.data = $.param({auth: App.account.auth});
    } else {
      _.extend(data, {auth: App.account.auth});
      options.data = JSON.stringify(data);
    }
    return Backbone.sync.call(this, method, model, options);
  },
  
  initialize: function () {
    this.set("settings", new Settings());
  },
  
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.settings = this.get("settings").toJSON();
    return json;
  }

});

App.Model.ExtractionCollection = Backbone.Collection.extend({
  url: function () {
    var param = $.param({auth: App.account.auth});
    return App.config.server.url + '/extractions?' + param;
  }
});