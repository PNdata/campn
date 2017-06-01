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