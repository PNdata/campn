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
