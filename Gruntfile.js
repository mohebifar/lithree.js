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
        expand: true,
        cwd: 'src',
        src: ['**/*.js', '!intro.js', '!outro.js'],
        dest: '.tmp/es5',
        ext: '.js'
      }]
    }
  },
  concat: {
    options: {
      sourceMap: true,
      separator: ''
    },
    dist: {
      src: [
        'src/intro.js',
        '.tmp/es5/**/*.js',
        'src/outro.js'
      ],
      dest: 'dist/lithree.js'
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
    }
  },
  jshint: {
    options: {
      jshintrc: '.jshintrc',
    },
    allFiles: [
      'src/**/*.js', '!src/intro.js', '!src/outro.js'
    ]
  }
});

grunt.registerTask('default', ['6to5', 'concat']);

grunt.registerTask('build', ['default', 'uglify']);