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
        dest: '.tmp/es5/concat.js'
      }]
    }
  },
  concat: {
    options: {
      sourceMap: true,
      separator: '\n'
    },
    dist: {
      src: [
        'src/intro.js',
        '.tmp/es5/concat.js',
        'src/outro.js'
      ],
      dest: 'dist/lithree.js'
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
    options: {
      spawn: false
    },
    livereload: {
      files: ['src/**/*.js', 'examples/**/*'],
      options: {
        livereload: true
      }
    },
    scripts: {
      files: ['src/**/*.js'],
      tasks: ['default']
    },
    examples: {
      files: ['examples/**/*']
    }
  },
  jshint: {
    options: {
      jshintrc: '.jshintrc'
    },
    allFiles: [
      'src/**/*.js', '!src/intro.js', '!src/outro.js'
    ]
  },
  clean: {
    tmp: ['.tmp']
  }
});

grunt.registerTask('default', ['clean', 'concat:es6', '6to5', 'concat:dist']);

grunt.registerTask('build', ['default', 'uglify']);