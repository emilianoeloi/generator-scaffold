(function() {

    'use strict';

    var yeoman = require('yeoman-generator'),
        chalk = require('chalk'),
        path = require('path'),
        gift = require('gift');

    module.exports = yeoman.generators.Base.extend({

        constructor: function () {
            yeoman.generators.Base.apply(this, arguments);
        },

        initTask: function() {
            this.log(chalk.cyan('\t \t  ___           __  __     _    _ '));
            this.log(chalk.cyan('\t \t / __| __ __ _ / _|/ _|___| |__| |'));
            this.log(chalk.cyan('\t \t \\__ \\/ _/ _` |  _|  _/ _ \\ / _` |'));
            this.log(chalk.cyan('\t \t |___/\\__\\__,_|_| |_| \\___/_\\__,_| \n'));
            this.log(chalk.cyan('\t \t [ Welcome to Scaffold Generator ] \n \n'));
            this.log(chalk.green('I will guide you to generate your best workflow. Come with me... \n \n'));
        },

        promptTask: function() {
            var cb = this.async(),
                choices = ['Mobile Only', 'Web Only', 'Responsive', 'Single Page', 'Single Page Mobile', 'Single Page Responsive'],
                prompts = [{
                    name: 'projectName',
                    message: 'What is the name of your project?',
                    validate: function(input) {
                        var done = this.async();

                        if (input.trim() === '') {
                            done('Hey dude! You forgot to enter the project name!');

                            return;
                        }

                        done(true);
                    }
                }, {
                    name: 'projectDescription',
                    message: 'What is the description?',
                    validate: function(input) {
                        var done = this.async();

                        if (input.trim() === '') {
                            done('You forgot the description. Write here.');

                            return;
                        }

                        done(true);
                    }
                }, {
                    name: 'projectMember',
                    message: 'What are people going to work on this project? (Separated by commas)',
                    validate: function(input) {
                        var done = this.async();

                        if (input.trim() === '') {
                            done('Hey man. Who will work with you on this? Write separating the names with commas.');

                            return;
                        }

                        done(true);
                    }
                }, {
                    type: 'list',
                    name: 'projectType',
                    message: 'What kind of project?',
                    choices: choices,
                    default: 0
                }, {
                    type: 'checkbox',
                    name: 'components',
                    message: 'What components do you like to include?',
                    choices: [{
                        name: 'Modernizr',
                        value: 'addModernizr',
                        checked: true
                    }, {
                        name: 'jQuery',
                        value: 'addjQuery',
                        checked: false
                    }]
                }, {
                    type: 'confirm',
                    name: 'hasGit',
                    message: 'Do you like to configure and init a git repository?',
                    default: 0
                }, {
                    name: 'gitUrl',
                    message: 'What is the git repository of the project? (Paste repository URL)',
                    when: function (answers) {
                        return answers.hasGit;
                    },
                    validate: function(input) {
                        var done = this.async();

                        if (input.trim() === '') {
                            done('Hey. Paste that URL dude!');

                            return;
                        }

                        done(true);
                    }
                }];

            this.prompt(prompts, function(answers) {
                var components = answers.components;

                function hasComponent(component) {
                    return components && components.indexOf(component) !== -1;
                }

                for(var answer in answers) {
                    this[answer] = answers[answer];
                }

                this.hasAssemble = true;
                this.isSinglePage = false;
                this.needFastclick = false;
                this.createJs = false;

                switch (this.projectType) {
                    case choices[0]:
                        this.projectType = 'mobile';
                        this.needFastclick = true;
                        break;
                    case choices[1]:
                        this.projectType = 'web';
                        break;
                    case choices[2]:
                        this.projectType = 'responsive';
                        this.needFastclick = true;
                        break;
                    case choices[3]:
                        this.projectType = 'singlepage';
                        this.isSinglePage = true;
                        this.hasAssemble = false;
                        break;
                    case choices[4]:
                        this.projectType = 'singlepage-mobile';
                        this.needFastclick = true;
                        this.isSinglePage = true;
                        this.hasAssemble = false;
                        break;
                    case choices[5]:
                        this.projectType = 'singlepage-responsive';
                        this.needFastclick = true;
                        this.isSinglePage = true;
                        this.hasAssemble = false;
                        break;
                }

                this.addModernizr = hasComponent('addModernizr');
                this.addjQuery = hasComponent('addjQuery');

                this.projectSlug = this._.slugify(this.projectName.toLowerCase());

                this.config.set({
                    'hasAssemble': this.hasAssemble
                });

                this.log(chalk.yellow(' \nGood! Now I will create and install everything you need. Time to take a coffee! \n \n'));

                cb();
            }.bind(this));
        },

        corePath: function () {
            this.sourceRoot(path.join(__dirname, '../../templates/core/'));
        },

        core: function() {
            this.log(chalk.yellow(' \nConfiguring Grunt tasks and Bower packages \n \n'));

            this.fs.copy(
                this.templatePath('grunt/**/*'),
                this.destinationPath('grunt')
            );
        },

        coreFiles: function() {
            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            );
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('gitattributes'),
                this.destinationPath('.gitattributes')
            );
            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );
            this.fs.copy(
                this.templatePath('htmlhintrc'),
                this.destinationPath('.htmlhintrc')
            );
            this.fs.copy(
                this.templatePath('jsbeautifyrc'),
                this.destinationPath('.jsbeautifyrc')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
            this.fs.copy(
                this.templatePath('GruntFile.js'),
                this.destinationPath('GruntFile.js')
            );
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                this
            );
        },

        bower: function() {
            var bower = {
                projectName: this.projectName,
                version: '0.0.0',
                name: this._.slugify(this.projectName.toLowerCase()),
                dependencies: {
                    'jquery': '~2.1.1',
                    'fastclick': '~1.0.3',
                    'modernizr': '~2.8.3',
                    'normalize-css': '~3.0.2'
                }
            };

            if (!this.needFastclick) {
                delete bower.dependencies.fastclick;
            }

            if (!this.addjQuery) {
                delete bower.dependencies.jquery;
            }

            this.fs.write(
                this.destinationPath('bower.json'),
                JSON.stringify(bower, null, 2)
            );
        },

        grunt: function() {
            this.fs.delete(
                this.destinationPath('tasks/build.js')
            );
            this.fs.delete(
                this.destinationPath('tasks/default.js')
            );
            this.fs.delete(
                this.destinationPath('options/watch.js')
            );

            this.fs.copyTpl(
                this.templatePath('grunt/tasks/build.js'),
                this.destinationPath('grunt/tasks/build.js'),
                this
            );

            this.fs.copyTpl(
                this.templatePath('grunt/tasks/default.js'),
                this.destinationPath('grunt/tasks/default.js'),
                this
            );

            this.fs.copyTpl(
                this.templatePath('grunt/options/watch.js'),
                this.destinationPath('grunt/options/watch.js'),
                this,
                {
                    evaluate: /<#([\s\S]+?)#>/g,
                    interpolate: /<#=([\s\S]+?)#>/g
                }
            );
        },

        assemble: function() {
            if (this.isSinglePage) {
                this.fs.delete(
                    this.destinationPath('assemble.js')
                );
            }

            this.log(chalk.yellow(' \nConfiguring grunt tasks \n \n'));
        },

        devPath: function () {
            this.sourceRoot(path.join(__dirname, '../../templates/', this.projectType));

            this.log(chalk.yellow(' \nCreating project files \n \n'));
        },

        dev: function() {
            this.mkdir('dev');
            this.mkdir('dev/partials');
        },

        assets: function() {
            this.fs.copy(
                this.templatePath('../assets/**/*'),
                this.destinationPath('dev/assets')
            );
            this.mkdir('dev/assets/img');
        },

        less: function() {
            this.fs.copy(
                this.templatePath('assets/less/**/*'),
                this.destinationPath('dev/assets/less')
            );
            this.mkdir('dev/assets/less/components');
        },

        html: function() {
            if (this.hasAssemble) {
                this.fs.copyTpl(
                    this.templatePath('templates/default.html'),
                    this.destinationPath('dev/templates/default.html'),
                    this
                );
            }

            this.fs.copyTpl(
                this.templatePath('index.html'),
                this.destinationPath('dev/index.html'),
                this
            );
        },

        setupGitTask: function() {
            if (this.hasGit) {
                var repository,
                    done = this.async();

                this.log(chalk.yellow('\n \nConfiguring the git repository and commiting Scaffold'));

                gift.init('.', function(err, _repo) {
                    this.log(chalk.green('  Init GIT repository'));

                    repository = _repo;

                    repository.add('--all', function() {
                        this.log(chalk.green('  Adding all files'));

                        repository.commit('Add Scaffold', function() {
                            this.log(chalk.green('  Commiting'));

                            this.spawnCommand('git', ['remote', 'add', 'origin', this.gitUrl]).on('exit', function () {
                                this.log(chalk.green('  Add origin remote'));
                            }.bind(this));

                            this.spawnCommand('git', ['config', 'credential.helper', 'store']).on('exit', function () {
                                this.log(chalk.green('  Configuring credentials'));

                                repository.remote_push('origin', 'master', function() {
                                    this.log(chalk.green('  Push commits'));
                                    done();
                                }.bind(this));
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }
        },

        install: function() {
            this.installDependencies({ skipInstall: this.options.skipInstall });
        },

        end: function() {
            var _this = this,
                glob = this.spawnCommand('npm', ['install', 'glob']);

            glob.on('exit', function() {
                _this.log(chalk.cyan(' \n \n All done and no errors! Enjoy! \n \n'));

                _this.spawnCommand('grunt', ['default']);
            });
        }

    });

})();
