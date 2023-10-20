// Show the plugin UI
figma.showUI(__html__, { width: 400, height: 800 });

// Listen for changes in selection
figma.on('selectionchange', async () => {
    const selectedNodes = figma.currentPage.selection;

    console.log(selectedNodes[0].type)

    if (selectedNodes.length === 1 && ['FRAME', 'COMPONENT', 'INSTANCE'].includes(selectedNodes[0].type)) {
        const frame = selectedNodes[0];

        const exportedFrame = await frame.exportAsync();

        figma.ui.postMessage({ type: 'convert-image', exportedFrame });
    }
});

