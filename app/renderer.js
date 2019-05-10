const marked = require('marked');
const path = require('path');
const { remote, ipcRenderer } = require('electron');
const { getFileFromUser } = remote.require('./main');

let filePath = null;
let originalContent = '';
const currentWindow = remote.getCurrentWindow();

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

const updateUserInterface = isEdited => {
  let title = 'Fire Sale';

  if (filePath) {
    title = `${title} - ${path.basename(filePath)}`;
  }

  if (isEdited) {
    title = `${title} \u2022`;
  }

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;
  currentWindow.setTitle(title);
};

markdownView.addEventListener('keyup', event => {
  const currentContent = event.target.value;

  renderMarkdownToHtml(currentContent);
  updateUserInterface(currentContent != originalContent);
});

openFileButton.addEventListener('click', () => {
  getFileFromUser();
});

ipcRenderer.on('file-opened', (event, file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);

  updateUserInterface();
});
