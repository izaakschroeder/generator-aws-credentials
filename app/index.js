
var generators = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var ini = require('ini');

function getHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getCredentials() {
	var file = path.join(getHome(), '.aws', 'credentials');
	return ini.parse(fs.readFileSync(file, 'utf8'));
}


module.exports = generators.Base.extend({
	initializing: function() {
		try {
			this.profiles = Object.keys(getCredentials());
		} catch (e) {

		}
	},
	prompting: function () {
		var done = this.async();
		this.prompt({
			type: 'list',
			name: 'profile',
			message: 'AWS profile',
			choices: this.profiles
		}, function (answers) {
			this.profile = answers.profile;
			done();
		}.bind(this));
	},
	writing: function() {
    var env = '# AWS Profile' + '\n' + 'AWS_PROFILE=' + this.profile;
    this.fs.write(this.destinationPath('.env'), env);
	},
	end: function() {

	}
});
