export interface CommandOptions {
    type: 'both' | 'invoke' | 'slash';
    // better name?
    commands: string[] | string;
}

export class Commands {
    // == REGEX
    private static INVOKE_SLASH_REGEX = /^(?:.*\s)?\/(${values})|^(${values})\(?\)?$/gims;
    private static INVOKE_REGEX = /^(?:.*\s)?(${values})\(\)/gims;
    private static SLASH_REGEX;
    // == END REGEX

    public static getRegexPhrase(options: CommandOptions): RegExp {
      let commands: string;
       if (typeof options['commands'] === 'string') {
           commands = options['commands'];
       } else {
           commands = options['commands'].join('|');
       }

        let regexPhrase;
        switch (options['type']) {
            case 'invoke':
                regexPhrase = this.INVOKE_REGEX.source.replace(/\${values}/g, commands);
                break;
            case 'slash':
                regexPhrase = this.SLASH_REGEX.source.replace(/\${values}/g, commands);
                break;
            default:
                regexPhrase = this.INVOKE_SLASH_REGEX.source.replace(/\${values}/g, commands);
                break;
        }
        return regexPhrase;
    }
}

const slashCommandGetStatus = Commands.getRegexPhrase({type: 'slash', commands: 'getStatus'});
const invokeCommandCreateOrder = Commands.getRegexPhrase({type: 'invoke', commands: ['create', 'createOrder']})
