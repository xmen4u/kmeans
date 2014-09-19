/*
 * Gruntfile.js
 */

'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    jshint: {  // grunt-contrib-jshint
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '**/*.js',
        '!node_modules/**/*'
      ]
    },
   lint: {
      files: ['lib/*.js']
    },
    watch: {  // grunt-contrib-watch
      all: {
        files: [
          '**/*.js',
          '!node_modules/**/*'
        ],
        tasks: ['default']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.registerTask('travis', 'lint')
  grunt.registerTask('default', [
    'jshint'//,
 //   'watch'
  ]);
};
