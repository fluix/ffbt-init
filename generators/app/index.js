const Generator = require('yeoman-generator');

const templatesToCopy = [
    'src/index.ts',
    'src/index.scss',
    'src/index.ejs',
    'tsconfig.json',
    'ffbt-config.js',
    'stylelint.config.js',
    'tslint.json',
];

module.exports = class extends Generator {
    installDependencies() {
        this.npmInstall(['ffbt']);
        this.npmInstall(['npm-run-all'], { 'save-dev': true });
    }

    writing() {
        templatesToCopy.forEach((path) => {
            this.fs.copyTpl(
                this.templatePath(path),
                this.destinationPath(path),
            );
        });

        const packageJson = {
            scripts: {
                start: "ffbt dev src --server",
                build: "ffbt build src",
                lint: "npm-run-all --parallel lint-ts lint-scss",
                "lint:ts": "ffbt lint ts src --force",
                "lint:ts:fix": "ffbt lint ts src --fix",
                "lint:styles": "ffbt lint styles src"
            }
        };

        this.fs.extendJSON(this.destinationPath('package.json'), packageJson);
    }

    end() {
        this.spawnCommand("npm", ["start"]);
    }
};
