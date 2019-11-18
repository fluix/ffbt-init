const path = require("path");
const Generator = require("yeoman-generator");

const templatesToCopy = [
    "src/index.ts",
    "src/index.scss",
    "src/index.ejs",
    "tsconfig.json",
    "ffbt-config.js",
    "stylelint.config.js",
    "tslint.json",
];

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument("destination", { type: String, required: false });
    }

    initializing() {
        if (this.options.destination) {
            this.destinationRoot(path.resolve(this.contextRoot, this.options.destination));
        }
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "confirm",
                name: "addTests",
                message: "Would you like to add unit testing functionality?",
            }
        ]);
    }

    install() {
        this.npmInstall(["ffbt"]);

        if (this.answers.addTests) {
            this.npmInstall(["jest", "ts-jest", "@types/jest"], { "save-dev": true });
        }
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
                "lint:ts": "ffbt lint ts src --force",
                "lint:ts:fix": "ffbt lint ts src --fix",
                "lint:styles": "ffbt lint styles src",
            }
        };

        if (this.answers.addTests) {
            packageJson.scripts.test = "jest --watchAll";
            packageJson.scripts["test:once"] = "jest";
            packageJson.scripts["test:ci"] = "jest --ci";

            this.fs.copyTpl(
                this.templatePath("src/index.spec.ts"),
                this.destinationPath("src/index.spec.ts"),
            );
        }

        this.fs.extendJSON(this.destinationPath("package.json"), packageJson);

        if (this.answers.addTests) {
            this.spawnCommandSync("npx", ["ts-jest", "config:init"]);
        }
    }

    end() {
        this.spawnCommand("npm", ["start"]);
    }
};
