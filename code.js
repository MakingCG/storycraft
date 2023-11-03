// Show the plugin UI
figma.showUI(__html__, { width: 400, height: 800 });

// Listen for changes in selection
figma.on('selectionchange', async () => {
    const selectedNodes = figma.currentPage.selection;

    if (!selectedNodes[0]) {
        figma.ui.postMessage({ type: 'clear-image' });
    }

    if (selectedNodes.length === 1 && ['FRAME', 'COMPONENT', 'INSTANCE', 'GROUP', 'RECTANGLE'].includes(selectedNodes[0].type)) {
        const frame = selectedNodes[0];

        const exportedFrame = await frame.exportAsync();

        figma.ui.postMessage({ type: 'convert-image', exportedFrame });
    }
});

// Retrieve message from UI
figma.ui.onmessage = async (message) => {

    // Set OpenAI token
    if (message.type === 'set-openai-token') {
        await figma.clientStorage.setAsync('openAIToken', message.data)
    }
}

// Load OpenAI token from client storage
figma.clientStorage.getAsync('openAIToken').then(openAIToken => {
    figma.ui.postMessage({ type: 'get-openai-token', openAIToken });
});

// Get active user's avatar
const activeUserAvatar = figma.currentUser.photoUrl;

// Send active user's avatar to UI
figma.ui.postMessage({ type: 'active-user-avatar', activeUserAvatar });





