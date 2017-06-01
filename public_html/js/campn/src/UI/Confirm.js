

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