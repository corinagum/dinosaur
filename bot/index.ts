import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';

import {
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication,
    ConfigurationBotFrameworkAuthenticationOptions,
    TurnContext,
} from 'botbuilder';

const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

if (!process.env.OpenAIKey || !process.env.BOT_ID || !process.env.BOT_DOMAIN || !process.env.BOT_ENDPOINT) {
    throw new Error(`Missing environment variables - please check following values:
    ${!process.env.OpenAIKey ? `\nOpenAIKey` : ''}
    ${!process.env.BOT_ID ? `\nBOT_ID` : ''}
    ${!process.env.BOT_DOMAIN ? `\nBOT_DOMAIN` : ''}
    ${!process.env.BOT_ENDPOINT ? `\nENDPOINT` : ''}
    `);
    // ${!process.env.xyz ? 'APPM?password' : ''}
}

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(
    process.env as ConfigurationBotFrameworkAuthenticationOptions,
);

const adapter = new CloudAdapter(botFrameworkAuthentication);

// Catch-all for errors.
const onTurnErrorHandler = async (context: TurnContext, error: Error) => {
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error.toString()}`);

    // Trace activity for BF Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error.toString()}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    await context.sendActivity('The bot encountered a development error or bug.');
};

adapter.onTurnError = onTurnErrorHandler;

const server = restify.createServer({
    name: 'Dinosaur Agent'
});
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo test your bot in Teams, sideload the app manifest.json within Teams Apps.');
});

// Listen for incoming server requests and forward to bot.
import * as app from './ai';
server.post('/api/messages', async (req, res, next) => {
    // Route received a request to adapter for processing
    await adapter.process(req, res as any, async (context: TurnContext) => {
        // Dispatch to application for routing
        await app.run(context);
    });
    return next();
});