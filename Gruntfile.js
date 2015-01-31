var grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  '6to5': {
    options: {
      sourceMap: true,
      modules: 'ignore'
    },
    dist: {
      files:  [{
        src: '.tmp/es6/concat.js',
        dest: 'dist/lithree.js'
      }]
    }
  },
  concat: {
    options: {
      sourceMap: true,
      separator: '\n'
    },
    es6: {
      src: ['src/**/*.js', '!src/intro.js', '!src/outro.js'],
      dest: '.tmp/es6/concat.js'
    }
  },
  uglify: {
    options: {
      sourceMap: true
    },
    build: {
      files: {
        'dist/lithree.min.js': ['dist/lithree.js']
      }
    }
  },
  watch: {
    scripts: {
      files: ['src/**/*.js'],
      tasks: ['default'],
      options: {
        livereload: true,
        spawn: false
      }
    },
    examples: {
      files: ['examples/**/*'],
      options: {
        livereload: true,
        spawn: false
      }
    }
  },
  jshint: {
    options: {
      jshintrc: '.jshintrc',
    },
    allFiles: [
      'src/**/*.js', '!src/intro.js', '!src/outro.js'
    ]
  },
  clean: {
    tmp: ['.tmp']
  }
});

grunt.registerTask('default', ['clean', 'concat:es6', '6to5']);

grunt.registerTask('build', ['default', 'uglify']);