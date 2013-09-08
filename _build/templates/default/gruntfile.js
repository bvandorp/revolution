module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		dirs: { /* just defining some properties */
			lib: './lib/',
			scss: './sass/',
			css: '../../../manager/templates/default/css/',
			template: '../../../manager/templates/default/'
		},
		bower: {
			install: {
				options: {
					targetDir: './lib',
					layout:'byComponent'
				}
			}
		},
		copy: { /* move files */
			bourbon: {
				files:[
					{src:'bourbon/**/*',cwd:'<%= dirs.lib %>',dest:'<%= dirs.scss %>',expand:true}
				]
			},
			fontawesome: {
				files:[
					{src: '<%= dirs.lib %>font-awesome/scss/**/*.scss',dest:'<%= dirs.scss %>font-awesome/',expand:true,flatten:true},
					{src: 'font/**/*',cwd:'<%= dirs.lib %>font-awesome/',dest:'<%= dirs.template %>',expand:true}
				]
			}
		},
		asciify: {
			revolution: {
				options: {
					font: 'larry3d'
				},
				text: 'MODX Revolution'
			}
		},
		csso: {
			compress: {
				options: {
					report: 'min',
					banner: '/*!\n <%= asciify_revolution %> \n see https://github.com/modxcms/revolution/tree/develop/_build/templates/default\n*/\n'
				},
				files: {
					'<%= dirs.css %>index.css': '<%= dirs.css %>index.css',
					'<%= dirs.css %>login.css': '<%= dirs.css %>login.css'
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed',
					compass: false,
					banner: '/*\n <%= asciify_revolution %> learn how to contribute at https://github.com/modxcms/revolution/tree/develop/_build/templates/default\n*/\n'
				},
				files: {
					'<%= dirs.css %>index.css': 'sass/index.scss',
					'<%= dirs.css %>login.css': 'sass/login.scss'
				}
			},
			dev: {
				options: {
					style: 'expanded',
					compass: false,
					banner: '/*\n <%= asciify_revolution %> learn how to contribute at https://github.com/modxcms/revolution/tree/develop/_build/templates/default\n*/\n'
				},
				files: {
					'<%= dirs.css %>index.css': 'sass/index.scss',
					'<%= dirs.css %>login.css': 'sass/login.scss'
				}
			}
		},
		autoprefixer: { /* this expands the css so it needs to get compressed with csso afterwards */
			options: {
				// Task-specific options go here.
			},

			// just prefix the specified file
			index: {
				options: {},
				src: '<%= dirs.css %>index.css',
				dest: '<%= dirs.css %>index.css'
			},
			login: {
				options: {},
				src: '<%= dirs.css %>login.css',
				dest: '<%= dirs.css %>login.css'
			}
		},
		csslint: {
		  strict: {
		    options: {
		      import: 2
		    },
		    src: ['<%= dirs.css %>*.css']
		  }
		},
		watch: { /* trigger tasks on save */
			options: {
				livereload: true
			},
			scss: {
				files: '<%= dirs.scss %>*',
				tasks: ['sass:dist', 'autoprefixer', 'asciify', 'csso', 'growl:sass']
			}
		},
		clean: { /* take out the trash */
			prebuild: ['<%= dirs.scss %>bourbon','<%= dirs.scss %>font-awesome'],
			postbuild: ['<%= dirs.lib %>']
		},
		growl: {
			sass: {
				message: "Sass files created.",
				title: "grunt"
			},
			build: {
				title: "grunt",
				message: "Build complete."
			},
			prefixes: {
				title: "grunt",
				message: "CSS prefixes added."
			},
			watch: {
				title: "grunt",
				message: "Watching. Grunt has its eye on you."
			},
			expand: {
				title: "grunt",
				message: "CSS Expanded. Don't check it in."
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-growl');
	grunt.loadNpmTasks('grunt-asciify');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-contrib-csslint');


	// Tasks
	grunt.registerTask('default', ['sass:dist', 'autoprefixer', 'growl:prefixes', 'growl:sass', 'asciify', 'csso', 'growl:watch', 'watch']);
	grunt.registerTask('build', ['clean:prebuild','bower', 'copy', 'sass:dist','autoprefixer', 'growl:prefixes', 'growl:sass','asciify','csso','clean:postbuild']);
	grunt.registerTask('expand', ['sass:dev', 'autoprefixer', 'growl:prefixes', 'growl:sass', 'growl:expand']);
};
