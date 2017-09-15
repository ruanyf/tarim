'use strict';

var test = require('tape');
var template = require('../index');
const path = require('path');

test('template basic tests', function (t) {
  t.plan(9);

  t.equal(
    template('hello world')(),
    'hello world'
  );

  t.equal(
    template('hello <%= user %>!')({user: 'world'}),
    'hello world!'
  );

  t.equal(
    template('hello <%- user %>!')({user: '<b>world</b>'}),
    'hello &lt;b&gt;world&lt;/b&gt;!'
  );

  t.equal(
    template('<% users.forEach(u => { %><li><%- u %></li><% }) %>')({ 'users': ['fred', 'barney'] }),
    '<li>fred</li><li>barney</li>'
  );

  t.equal(
    template('<% users.forEach(u => print("<li>" + u + "</li>")) %>')({ 'users': ['fred', 'barney'] }),
    '<li>fred</li><li>barney</li>'
  );

  t.equal(
    template('hello ${ user }!')({ 'user': 'pebbles' }),
    'hello pebbles!'
  );

  t.equal(
    template('<%= "\\<%- value %\\>" %>')({ 'value': 'ignored' }),
    '<%- value %>'
  );

  t.equal(
    template('hello {{ user }}!', {
      'interpolate': /{{([\s\S]+?)}}/g
    })({ 'user': 'mustache' }),
    'hello mustache!'
  );

  t.equal(
    template('hello <%= data.user %>!', {
      'variable': 'data'
    })({ 'user': 'mustache' }),
    'hello mustache!'
  );
});

test('template function\'s source', function (t) {
  t.plan(1);

  const str = 'hello world';
  const tmpl = template(str);
  t.equal(
    tmpl.source,
    'function(obj) {\nobj || (obj = {});\nvar __t, __p = \'\';\nwith (obj) {\n__p += \'hello world\';\n\n}\nreturn __p\n}'
  );
});

test('include test', function (t) {
  t.plan(7);

  const templateOption = {
    includePath: './test/fixture',
    includeExt: '.template',
  };

  const str1 = 'hello world\n<% include simple %>';
  t.equal(
    template(str1, templateOption)(),
    'hello world\nhello world\n'
  );

  const str2 = 'hello world<% include simple %>';
  t.equal(
    template(str2, templateOption)(),
    'hello worldhello world\n'
  );

  const str3 = 'hello world\n<% includes simple %>';
  t.equal(
    template(str3, templateOption)(),
    'hello world\nhello world\n'
  );

  const str4 = '<% includes simple %>\n<% include simple %>';
  t.equal(
    template(str4, templateOption)(),
    'hello world\n\nhello world\n'
  );

  const str5 = 'hello world\n<% include composite %>';
  t.equal(
    template(str5, templateOption)(),
    'hello world\nhello world\nhello world\n\n'
  );

  const str6 = 'hello world\n<% include simple %>';
  t.equal(
    template(str6, { includePath: './test/fixture', includeExt: '.tmpl' })(),
    'hello world\nabc\n'
  );

  const str7 = 'hello\n<% include data %>';
  t.equal(
    template(str7, templateOption)({ user: 'Trump' }),
    'hello\nTrump\n'
  );
});

test('default option', function (t) {
  t.plan(1);

  const str1 = 'hello\n<% include data %>';
  const originPath = process.cwd();
  process.chdir(path.resolve(originPath, 'test', 'fixture'));
  t.equal(
    template(str1)({ user: 'Trump' }),
    'hello\nTrump\n'
  );
  process.chdir(originPath);
});
