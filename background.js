chrome.action.onClicked.addListener(async (tab) => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      await chrome.tabs.sendMessage(tab.id, { action: 'enable-selector' });
    } catch (error) {
      console.error('Errore:', error);
    }
  });
  