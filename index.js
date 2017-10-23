const template = require('lodash/template');
const path = require('path');
const fs = require('fs-extra');

function includeHandler(str, templateOption) {
  const reg = /<%\s+includes?\s+(.*?)\s+%>/mg;
  let templateContent = str;
  let isMatched = false;

  while(true) {
    const match = reg.exec(str);
    if (!match) return templateContent;

    const templatePath = path.resolve(
      templateOption.includePath,
      match[1] + templateOption.includeExt
    );

    let includeContent = fs.readFileSync(templatePath, 'utf8');
    includeContent = includeHandler(includeContent, templateOption);
    templateContent = templateContent.replace(match[0], includeContent)
  }
}

function templateEngine(str, option) {
  const OPTION_DEFAULT = {
    includePath: process.cwd(),
    includeExt: '.template',
  };
  if (option && option.includePath && option.includePath.substr(0, 1) !== '/') {
    option.includePath = path.resolve(process.cwd(), option.includePath);
  }
  const templateOption = Object.assign({}, OPTION_DEFAULT, option);
  let templateContent = str;
  templateContent = includeHandler(templateContent, templateOption);
  return template(templateContent, templateOption);
}

module.exports = templateEngine;
