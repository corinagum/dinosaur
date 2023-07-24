import {
    Application,
    DefaultPromptManager,
    DefaultTempState,
    DefaultTurnState,
    DefaultUserState,
    OpenAIPlanner,
} from '@microsoft/teams-ai';
import { ConversationState, MemoryStorage, TurnContext } from 'botbuilder';
import * as path from 'path';

export interface TempState extends DefaultTempState {
  prompt: string
}

type ApplicationTurnState = DefaultTurnState<ConversationState, DefaultUserState, TempState>;

const planner = new OpenAIPlanner<ApplicationTurnState>({
    apiKey: process.env.OpenAIKey || '',
    defaultModel: 'gpt-3.5-turbo',
    logRequests: true,
});

const promptManager = new DefaultPromptManager<ApplicationTurnState>(path.join(__dirname, '../prompts'));

const storage = new MemoryStorage();
const history = {
    userPrefix: '👤',
    assistantPrefix: '🤖',
    maxTurns: 5,
    maxTokens: 600
};
const app = new Application<ApplicationTurnState>({
    storage,
    ai: {
        planner,
        promptManager,
        prompt: async (context: TurnContext, state: ApplicationTurnState) => state.temp.value.prompt,
        history
    },
});

export const run = (context: TurnContext) => app.run(context);
