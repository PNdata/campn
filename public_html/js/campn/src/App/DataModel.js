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
