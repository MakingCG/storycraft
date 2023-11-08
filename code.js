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

        let exportedFrame = await frame.exportAsync({
            format: 'JPG',
            constraint: {
                type: 'SCALE',
                value: 1
            },
        });

        // Split the exportedFrame array into chunks of 10000 items each
        let chunks = [];

        for (let i = 0; i < exportedFrame.length; i += 10000) {
            chunks.push(exportedFrame.slice(i, i + 10000));
        }

        // Send each chunk separately
        for (let i = 0; i < chunks.length; i++) {
            figma.ui.postMessage({
                type: 'convert-image',
                chunk: chunks[i],
                index: i + 1,
                totalChunks: chunks.length
            });
        }
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





