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
