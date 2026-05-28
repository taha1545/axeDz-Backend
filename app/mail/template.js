const fs = require('fs');
const path = require('path');

const templateCache = new Map();

const loadTemplate = (templateName) => {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  const filePath = path.join(
    __dirname,
    '../../public/templates',
    `${templateName}.html`
  );
  const content = fs.readFileSync(filePath, 'utf8');
  templateCache.set(templateName, content);
  return content;
};

const renderTemplate = (template, data = {}) => {
  return Object.entries(data).reduce(
    (html, [key, value]) => html.replace(new RegExp(`{{${key}}}`, 'g'), String(value ?? '')),
    template
  );
};

const getTemplateHtml = (templateName, data = {}) => {
  const template = loadTemplate(templateName);
  return renderTemplate(template, data);
};

module.exports = {
  getTemplateHtml,
};
