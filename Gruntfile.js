var grunt = require('grunt');
require('load-grunt-tasks')(grunt);
grunt.loadNpmTasks('grunt-contrib-uglify');

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
      separator: ''
    },
    dist: {
      src: [
        'src/intro.js',
        '.tmp/es5/**/*.js',
        'node_modules/gl-matrix/src/gl-matrix/common.js',
        'node_modules/gl-matrix/src/gl-matrix/mat3.js',
        'node_modules/gl-matrix/src/gl-matrix/mat4.js',
        'node_modules/gl-matrix/src/gl-matrix/vec4.js',
        'node_modules/gl-matrix/src/gl-matrix/vec3.js',
        'src/outro.js'
      ],
      dest: 'dist/lithree.js'
    }
  },
  uglify: {
    my_target: {
      files: {
        'dist/lithree.min.js': ['dist/lithree.js']
      }
    }
  }
});

grunt.registerTask('default', ['6to5', 'concat']);
grunt.registerTask('compress', ['uglify']);

grunt.registerTask('build', ['default', 'compress']);