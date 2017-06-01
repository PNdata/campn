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
