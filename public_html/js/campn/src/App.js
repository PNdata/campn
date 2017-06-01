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
