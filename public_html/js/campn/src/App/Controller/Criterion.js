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
