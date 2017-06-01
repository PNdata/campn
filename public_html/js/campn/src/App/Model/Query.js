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