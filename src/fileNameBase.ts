import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

export enum COMPONENT_TYPE {
    COMPONENT,
    DIRECTIVE,
    ANY
};

export class FileNameRule extends Lint.Rules.AbstractRule {
    constructor(ruleName: string,
                value: any,
                disabledIntervals: Lint.IDisabledInterval[],
                //private validator: Function,
                private failureString: string,
                public targetType: COMPONENT_TYPE = COMPONENT_TYPE.ANY) {
        super(ruleName, value, disabledIntervals);
    }


    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        let documentRegistry = ts.createDocumentRegistry();
        let languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        let languageService : ts.LanguageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(
            new FileNameValidatorWalker(
                sourceFile,
                languageService,
                this));
    }
}

class FileNameValidatorWalker extends Lint.RuleWalker {
    private languageService : ts.LanguageService;
    private typeChecker : ts.TypeChecker;

    constructor(sourceFile: ts.SourceFile, languageService : ts.LanguageService, private rule: FileNameRule) {
        super(sourceFile, rule.getOptions());
        this.typeChecker = languageService.getProgram().getTypeChecker();
    }

    visitClassDeclaration(node: ts.ClassDeclaration) {
        (node.decorators || []).forEach(this.validateDecorator.bind(this, node.name.text));
        super.visitClassDeclaration(node);
    }
    private validateDecorator(className: string, decorator: ts.Decorator) {
        let baseExpr = <any>decorator.expression || {};
        let expr = baseExpr.expression || {};
        let name = expr.text;
        let args = baseExpr.arguments || [];
        let arg = args[0];
        if (this.rule.targetType === COMPONENT_TYPE.ANY) {
            this.validateFileName(className, COMPONENT_TYPE.ANY, arg);
        } else if (this.rule.targetType === COMPONENT_TYPE.COMPONENT && name === 'Component' ) {
            this.validateFileName(className, COMPONENT_TYPE.COMPONENT, arg);
        } else if (this.rule.targetType === COMPONENT_TYPE.DIRECTIVE && name === 'Directive') {
            this.validateFileName(className, COMPONENT_TYPE.DIRECTIVE, arg);
        }
    }
    private validateFileName(className: string, type:COMPONENT_TYPE, arg: ts.Node) {
        let error = 'bad name failure';
        this.addFailure(this.createFailure(0, 0, error));
    }
}