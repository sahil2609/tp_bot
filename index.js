const path = require('path');
const express = require('express');
const cors = require('cors');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const PORT = process.env.PORT || 3978;
const server = express();
const {SuggestedActionsBot} = require("./bots/adaptivecardActionsBot");

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({
    extended: true
}));


const { MsTeamsApiRouter, MsTeamsPageRouter } = require('express-msteams-host')

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');
const { TeamsInfo, DialogSet, TextPrompt } = require('botbuilder-dialogs');
// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights. See https://aka.ms/bottelemetry for telemetry 
    //       configuration instructions.
    // console.error(`\n [onTurnError] unhandled error: ${error}`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`, 
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

   // Uncomment below commented line for local debugging.
   // await context.sendActivity(`Sorry, it looks like something went wrong. Exception Caught: ${error}`);

};

// Create the bot that will handle incoming messages.
const bot = new SuggestedActionsBot();

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

server.use("/Images", express.static(path.resolve(__dirname, 'Images')));

server.get('*', (req, res) => {
    res.json({ error: 'Route not found' });
});


server.post('/api/messages', (req, res) => {
         
    adapter.processActivity(req, res, async (context) => {
        //console.log(context)
            //console.log(context)

            console.log(context.activity?.value)
            await bot.run(context);
        
    });
});
 

 
