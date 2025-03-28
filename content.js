let isSelecting = false;

function startSelecting() {
  if (isSelecting) return;
  isSelecting = true;
  document.body.style.cursor = 'crosshair';
  document.addEventListener('click', handleClick, true);
}

function stopSelecting() {
  isSelecting = false;
  document.body.style.cursor = '';
  document.removeEventListener('click', handleClick, true);
}

function handleClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const element = event.target.closest('[data-message-id]');
  if (!element) {
    alert('Seleziona un messaggio valido.');
    stopSelecting();
    return;
  }

  const messageElement = element.querySelector('.markdown.prose');
  if (!messageElement) {
    alert('Contenuto messaggio non trovato.');
    stopSelecting();
    return;
  }

  const originalContent = document.body.innerHTML;

  document.body.innerHTML = `
    <html>
      <head>
        <title>ChatGPT Message</title>
        <style>
          @page {
            margin: 0;
          }

          body {
            margin: 0;
            padding: 30px;
            background-color: white;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #222;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
          }

          p, ol, ul, pre {
            margin-bottom: 1rem;
          }

          pre {
            background-color: #f6f8fa;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
          }

          code {
            background-color: #f1f3f5;
            padding: 2px 4px;
            border-radius: 3px;
          }

          ol, ul {
            padding-left: 2rem;
          }

          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }

          img {
            max-width: 100%;
          }
        </style>
      </head>
      <body>${messageElement.innerHTML}</body>
    </html>
  `;

  window.print();
  document.body.innerHTML = originalContent;

  stopSelecting();
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'enable-selector') {
    startSelecting();
  }
});
