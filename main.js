const apiUrl = 'https://a0b7-14-98-125-202.ngrok-free.app/api/messages'; // Replace with the appropriate API endpoint URL
import * as adaptivecards from 'adaptivecards';

fetch(apiUrl)
    .then(response => response.json(), console.log("sahil"))
    .then(data => {
        const messages = data.filter(message => {
            return (
                message.channelData &&
                message.channelData.channel === 'msteams' &&
                message.attachments &&
                message.attachments.length > 0
            );
        });

        if (messages.length > 0) {
            const adaptiveCard = messages[0].attachments[0].content;
            displayCardActions(adaptiveCard);
        }
    })
    .catch(error => {
        console.error('Error fetching messages:', error);
    });

function displayCardActions(adaptiveCard) {
    const container = document.getElementById('cardActionsContainer');
    container.innerHTML = ''; // Clear the container

    const cardElement = document.createElement('div');
    cardElement.classList.add('adaptive-card');
    container.appendChild(cardElement);

    // Render the Adaptive Card using a suitable rendering library or framework
    // Example: You can use the Adaptive Cards JavaScript SDK to render the card
    // Replace the following code with the appropriate rendering logic

    // Adapt the code below based on the rendering library/framework you are using
    adaptivecards.AdaptiveCard.onProcessMarkdown = function (text, result) {
        result(undefined, text);
    };
    const card = new adaptivecards.AdaptiveCard();
    card.parse(adaptiveCard);
    const renderedCard = card.render();
    cardElement.appendChild(renderedCard);
}
