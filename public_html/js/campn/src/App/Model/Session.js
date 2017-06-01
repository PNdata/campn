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