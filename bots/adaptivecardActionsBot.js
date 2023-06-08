// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const { TeamsActivityHandler } = require('botbuilder');
const { ActionTypes } = require('botframework-schema');
const  ACData =  require( "adaptivecards-templating");
const templatePayload = require('./adaptiveCardSample.json')
const { TeamsInfo, DialogSet, TextPrompt } = require('botbuilder-dialogs');
var template = new ACData.Template(templatePayload);
const loginAdaptiveCard = require('./loginAdaptiveCard.json');

var cardData ={

    "title": "Publish Adaptive Card Schema",

    "description": "Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.",

    "creator": {

        "name": "Matt Hidinger",

        "profileImage": "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg"

    },

    "imageDescription":"https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",

    "createdUtc": "2017-02-14T06:08:39Z",

    "requestId":"121234"

}; 
 
let func=(args)=>{
    return template.expand({$root: args })
}

let idd=null;
class SuggestedActionsBot extends TeamsActivityHandler {
    constructor() {
        super();
        
        let tp1 = null;
        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
     
        this.onMessage(async (context, next) => {
            // if (context.activity.type === 'invoke' && context.activity.name === 'task/fetch') {
            //     const invokeResponse = await this.handleInvokeActivity(context.activity);
                
            //     // Set the invoke response in the turn state
            //     context.turnState.set(botbuilder_core_1.INVOKE_RESPONSE_KEY, invokeResponse);
            // } 
            const text = context.activity.text;
            
            if (text.includes("Card Actions")) {
                const userCard = CardFactory.adaptiveCard(func(cardData));
                await context.sendActivity({ attachments: [userCard] });
            }
            else if (text.includes("Suggested Actions")) {
                const userCard = CardFactory.adaptiveCard(this.SuggestedActionsCard());
                await context.sendActivity({ attachments: [userCard] });
            }
            else if (text.includes("Red") || text.includes("Blue") || text.includes("Yellow")) {
                // Create an array with the valid color options.
                const validColors = ['Red', 'Blue', 'Yellow'];

                // If the `text` is in the Array, a valid color was selected and send agreement.
                if (validColors.includes(text)) {
                    await context.sendActivity(`I agree, ${text} is the best color.`);
                }
                await this.sendSuggestedActions(context);
            }
            else if (text.includes("Login")) {
                const userCard = CardFactory.adaptiveCard(loginAdaptiveCard);
                await context.sendActivity({ attachments: [userCard] });
            }
            else {
                await context.sendActivity("Please use one of these commands: **Card Actions** for  Adaptive Card Actions, **Suggested Actions** for Bot Suggested Actions and **ToggleVisibility** for Action ToggleVisible Card");
            }
            // By calling next() you ensure that the next BotHandler is run.
             await next();
        });
        
    }

    

    async handleTeamsTaskModuleFetch(context, taskModuleRequest) {
        // Implementation of handleTeamsTaskModuleFetch method
        // ...
        console.log("hare hare")
        console.log(context.activity?.value,"fetch")
        let adaptiveCard= {
            "type":"AdaptiveCard",
            "title":"Sorry, We ran into a problem"
        }
       if(context.activity?.value === "connect"){
            adaptiveCard = {
            "type": "AdaptiveCard",
            "body": [
                {
                    "type": "TextBlock",
                    "size": "Medium",
                    "weight": "Bolder",
                    "text": "Welcome"
                },
                {
                    "type": "TextBlock",
                    "text": "Description",
                    "wrap": true
                }
            ],
            "actions": [
                {
                    "type": "Action.ShowCard",
                    "title": "Connect Your Sprinklr Account",
                    "card": {
                        "type": "AdaptiveCard",
                        "body": [
                            {
                                "type": "Input.Text",
                                "id": "userId",
                                "placeholder": "Enter User Id"
                            },
                            {
                                "type": "Input.Text",
                                "id": "password",
                                "placeholder": "Enter Password"
                            }
                        ],
                        "actions": [
                            {
                                "type": "Action.Submit",
                                "title": "Login",
                                "data":{
                                    "action":"login"
                                }
                            }
                        ],
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
                    }
                }
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.2"
        };
       }
        // Return the task module response
        
        else {
             adaptiveCard = {
                "type": "AdaptiveCard",
                "body": [
                    {
                        "type": "TextBlock",
                        "size": "Medium",
                        "weight": "Bolder",
                        "text": "Welcome"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Description",
                        "wrap": true
                    },
                    {
                        "type": "Input.Text",
                        "id":"approvalResponse",
                        "placeholder": "comment"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Submit"
                    }
                ],
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.2"
            }
        }
          
          const adaptiveCardAttachment = CardFactory.adaptiveCard(adaptiveCard);
          const card =CardFactory.adaptiveCard(func(adaptiveCard))
          card.id=context.activity.replyToId;
          const message = MessageFactory.attachment(card);
          message.id = context.activity.replyToId;
          idd=context.activity.replyToId;
          console.log(idd)
          const taskModuleResponse = {
            task: {
              type: 'continue',
              value: {
                card: adaptiveCardAttachment,
                height: 'medium',
                width: 'medium',
                title: 'Pop-up Card'
              }
            }
          };
        await context.sendActivity({
            type: 'invokeResponse',
            value: {
              status: 200,
              body: taskModuleResponse
            }
          })

        
        //   console.log(context.actions.replyToId)
        //   await context.deleteActivity(context.actions.replyToId)
        // return {
        //     task: {
        //         type: 'message',
        //         value: {
        //             title:" POp PoP",
        //             card: popadpcard,
        //             width:700,
        //             height:1000
        //         }
        //     }
        // };
        
    }
    
    async handleTeamsTaskModuleSubmit(context, taskModuleRequest) {
        // Called when data is being returned from the selected option (see `handleTeamsTaskModuleFetch').
    
        // Echo the users input back.  In a production bot, this is where you'd add behavior in
        // response to the input.
        console.log(context.activity?.value,"submit")
        await context.deleteActivity(idd)
        await context.sendActivity('Submiteddddddddd');
    
        // Return TaskModuleResponse
        return {
            // TaskModuleMessageResponse
            task: {
                type: 'message',
                value: 'Thanks!'
            }
        };
    }


    /**
     * Send a welcome message along with suggested actions for the user to click.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;
        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                const welcomeMessage = `Welcome to Adaptive Card Action and Suggested Action Bot. This bot will introduce you to suggested actions.` +
                    'Please select an option:';

                await turnContext.sendActivity(welcomeMessage);
                await turnContext.sendActivity("Please use one of these commands: **1** for  Adaptive Card Actions, **2** for Bot Suggested Actions and **3** for Toggle Visible Card");
                await this.sendSuggestedActions(turnContext);
            }
        }
    }

    async sendSuggestedActions(turnContext) {
        const cardActions = [
            {
                type: ActionTypes.ImBack,
                title: 'Red',
                value: 'Red'
            },
            {
                type: ActionTypes.ImBack,
                title: 'Yellow',
                value: 'Yellow'
            },
            {
                type: ActionTypes.ImBack,
                title: 'Blue',
                value: 'Blue'
            }
        ];

        var reply = MessageFactory.text("What is your favorite color ?");
        reply.suggestedActions = { "actions": cardActions, "to": [turnContext.activity.from.id] };
        await turnContext.sendActivity(reply);
    }
    adaptiveCard=()=>cardPayload;
    

    // Toggle Visible Card
    ToggleVisibleCard = () => ({
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "TextBlock",
                "text": "**Action.ToggleVisibility example**: click the button to show or hide a welcome message"
            },
            {
                "type": "TextBlock",
                "id": "helloWorld",
                "isVisible": false,
                "text": "**Hello World!**",
                "size": "extraLarge"
            }
        ],
        "actions": [
            {
                "type": "Action.ToggleVisibility",
                "title": "Click me!",
                "targetElements": ["helloWorld"]
            }
        ]
    })

    // Suggest Actions Card
    SuggestedActionsCard = () => ({

        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "TextBlock",
                "text": "**Welcome to bot Suggested actions** please use below commands."
            },
            {
                "type": "TextBlock",
                "text": "please use below commands, to get response form the bot."
            },
            {
                "type": "TextBlock",
                "text": "- Red \r- Blue \r - Yellow",
                "wrap": true
            }
        ]
    })
}

module.exports.SuggestedActionsBot = SuggestedActionsBot;
