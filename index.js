const template = require('lodash/template');
const path = require('path');
const fs = require('fs-extra');

const OPTION_DEFAULT = {
  includePath: process.cwd(),
  includeExt: '.template',
};

function includeHandler(str, templateOption) {
  const reg = /^\s*<%\s+includes?\s+(.*?)\s+%>/mg;
  let templateContent = str;
  let isMatched = false;

  while(true) {
    const match = reg.exec(str);
    if (!match) return templateContent;

    const templatePath = path.resolve(
      process.cwd(),
      templateOption.includePath,
      match[1] + templateOption.includeExt,
    );

    let includeContent = fs.readFileSync(templatePath, 'utf8');
    includeContent = includeHandler(includeContent, templateOption);
    templateContent = templateContent.replace(match[0], includeContent)
  }
}

function templateEngine(str, option) {
  const templateOption = Object.assign({}, OPTION_DEFAULT, option);
  let templateContent = str;
  templateContent = includeHandler(templateContent, templateOption);
  return template(templateContent, templateOption);
}

module.exports = templateEngine;
