module.exports = function(grunt) {
    
  var version = '1.0.4';  
  var buildName = 'campn-ext-client-' + version;
  var baseDir = 'C:/Users/matthieu.PNDATA/Projets/campn-v1/campn-ext-client/dist';
  var dest = baseDir;
      
  grunt.initConfig({
        
    clean: {
      dist: [dest + "/"],
      options: {
        force: true
      }
    },
    
    mkdir: {
      dist: {
        options: {
          create: [dest, dest + '/css', dest + '/images', dest + '/js']
        }
      }
    },
        
    processhtml: {
      dist: {
        files: [{
          src: ['public_html/index.html'],
          dest: dest + '/index.html'
        }]
      }
    },
    
    concat: {
      
      css: {
        src: [
          'public_html/css/common.css',
          'public_html/css/app.css',
          'public_html/css/login.css'
        ],
        dest: dest + '/css/campn.min.css'
      },
      
      js: {
        separator: ';',
        src: [
          'public_html/js/campn/src/Utils.js',
          'public_html/js/campn/src/UI/UI.js',
          'public_html/js/campn/src/UI/Dialog.js',
          'public_html/js/campn/src/UI/Confirm.js',
          'public_html/js/campn/src/UI/Alert.js',
          'public_html/js/campn/src/App.js',
          'public_html/js/campn/src/App/global.js',  
          'public_html/js/campn/src/App/UI.js',    
          'public_html/js/campn/src/App/DataModel.js',  
          'public_html/js/campn/src/App/DataReferential.js', 
          'public_html/js/campn/src/App/Plugin.js',
          'public_html/js/campn/src/App/Server.js', 
          'public_html/js/campn/src/App/Server/Session.js', 
          'public_html/js/campn/src/App/Server/Query.js', 
          'public_html/js/campn/src/App/Server/Node.js', 
          'public_html/js/campn/src/App/Server/Criterion.js', 
          'public_html/js/campn/src/App/Server/DataModel.js', 
          'public_html/js/campn/src/App/Server/Auth.js', 
          'public_html/js/campn/src/App/Controller.js',          
          'public_html/js/campn/src/App/Controller/Session.js',
          'public_html/js/campn/src/App/Controller/Query.js',
          'public_html/js/campn/src/App/Controller/Node.js',
          'public_html/js/campn/src/App/Controller/Criterion.js',
          'public_html/js/campn/src/App/Model/Session.js',
          'public_html/js/campn/src/App/Model/Query.js',
          'public_html/js/campn/src/App/Model/Node.js',
          'public_html/js/campn/src/App/Model/Criterion.js',
          'public_html/js/campn/src/App/Model/CriterionNumberInput.js',
          'public_html/js/campn/src/App/Model/CriterionStringInput.js',
          'public_html/js/campn/src/App/Model/CriterionBooleanInput.js',
          'public_html/js/campn/src/App/Model/CriterionDateInput.js',
          'public_html/js/campn/src/App/Model/CriterionLinkInput.js',
          'public_html/js/campn/src/App/Model/CriterionHugeDataLinkInput.js',
          'public_html/js/campn/src/App/Model/CriterionIntervalInput.js',
          'public_html/js/campn/src/App/Model/CriterionSequenceInput.js',
          'public_html/js/campn/src/App/Model/CriterionEnumInput.js',
          'public_html/js/campn/src/App/Model/Operator.js',
          'public_html/js/campn/src/App/Model/Operation.js',
          'public_html/js/campn/src/App/Model/Attribute.js',
          'public_html/js/campn/src/App/Model/TypeFunction.js',
          'public_html/js/campn/src/App/Model/Extraction.js'
        ],
        dest: dest + '/js/campn.js'
      }
    },
    
    
    
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: [dest + '/js/campn.js'],
        dest: dest + '/js/campn.min.js'
      }
    },
    
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'public_html/js',
            src: ['*'], 
            filter: 'isFile',
            dest: dest + '/js'
          },
          {
            expand: true,
            cwd: 'public_html/js',
            src: ['jquery/**'], 
            dest: dest + '/js'
          },
          {
            expand: true,
            cwd: 'public_html/js',
            src: ['kendoui/**'], 
            dest: dest + '/js'
          },
          {
            expand: true,
            cwd: 'public_html/css',
            src: ['icomoon/**'], 
            dest: dest + '/css'
          },
          {
            expand: true,
            cwd: 'public_html/css',
            src: ['kendoui/**'], 
            dest: dest + '/css'
          },
          {
            expand: true,
            cwd: 'public_html',
            src: ['images/**'], 
            dest: dest
          },
          {
            expand: true,
            cwd: 'public_html/',
            src: ['app.html', 'login.html', 'favicon.ico'], 
            dest: dest 
          },
          {
            expand: true,
            cwd: 'public_html/css',
            src: ['jquery-ui.css'], 
            dest: dest + '/css'
          }/*,
          {
            expand: true,
            cwd: 'public_html/',
            src: ['config.json'],
            dest: dest
          }*/
        ]
      }
    },
    compress: {
      main: {
        options: {
          archive: dest + '/' + buildName + '.zip'
        },
        files: [{
          expand: true,
          cwd: dest,
          src: ['**/*']
        }]
      }
    }
        
    /*copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'public_html/',
            src: ['**'], 
            dest: '//serveur-civ1/E/apps_campn/df-tandem/www/client'
          }
        ]
      }
    }*/
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['clean:dist', 'mkdir', 'concat:js', 'concat:css', 'uglify:dist', 'copy:main', 'processhtml:dist', 'compress:main']);    
  
};