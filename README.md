Tarim is a template engine, using [Lodash](https://lodash.com/docs/4.17.4#template)'s template syntax and supporting `include` other templates.

## Usage

```javascript
const tmplEngine = require('tarim');

let str;
let tmpl;

// string
str = 'hello <%= user %>!';
tmpl = tmplEngine(str);
tmpl({ 'user': 'fred' })
// 'hello fred!'

// escaped string
str = '<b><%- value %></b>';
tmpl = tmplEngine(str);
tmpl({ 'value': '<script>' })
// '<b>&lt;script&gt;</b>'

// array
str = `
  <% users.forEach(u => { %>
    <li><%- u %></li>
  <% }) %>
`;
tmpl = tmplEngine(str);
tmpl({ 'users': ['fred', 'barney'] })
// '<li>fred</li><li>barney</li>'

// ES6 template string
str = 'hello ${ user }!';
tmpl = tmplEngine(str);
tmpl({ 'user': 'pebbles' })
// 'hello pebbles!'

// escaping delimiters
str = '<%= "\\<%- value %\\>" %>';
tmpl = tmplEngine(str);
tmpl({ 'value': 'ignored' })
// => '<%- value %>'
```

## Advanced usage

```javascript
const tmplEngine = require('tarim');

let str;
let tmpl;

// print() function
str = '<% users.forEach(u => print("<li>" + u + "</li>")) %>';
tmpl = tmplEngine(str);
tmpl({ 'users': ['fred', 'barney'] })
// '<li>fred</li><li>barney</li>'

// template function's source
str = 'hello world';
tmpl = tmplEngine(str);
tmpl.source
// 'function(obj) {\nobj || (obj = {});\nvar __t, __p = \'\';\nwith (obj) {\n__p += \'hello world\';\n\n}\nreturn __p\n}'
```

## Including Templates

A template could be included into another template.

```javascript
<% include templateFileName %>
```

The above line will be replaced by the content of file `templateFileName.template`.

The default path of included template files is the current working directory `process.cwd()`, and the default extension of template files is `.template`. You could customize them by setting `Option.includePath` and `Option.includeExt`.

`Option.includePath` is to specify the location of a directory of template files relative to `process.cwd()` directory. It could also be an absolute path.

```javascript
const tmplEngine = require('tarim');
const str = '<% include data %>';
const tmpl = tmplEngine(str, {
  includePath: './templates',
  includeExt: '.template',
});
```

## Config

```javascript
const tmplEngine = require('tarim');

let str;
let option;
let tmpl;

// data object
str = 'hello <%= data.user %>!';
option = { 'variable': 'data' };
tmpl = tmplEngine(str, option);
tmpl({ user: 'world'})
// 'hello world!'

// sourceURL option
str = 'hello <%= user %>!';
option = {
  'sourceURL': '/basic/greeting.jst'
};
tmpl = tmplEngine(str, option);
// => source file "greeting.jst" will be
// => under the Sources tab or Resources panel of the web inspector.

// custom template delimiters
option = {
  'interpolate': /{{([\s\S]+?)}}/g
}
str = 'hello {{ user }}!';
tmpl = tmplEngine({ 'user': 'mustache' });
// 'hello mustache!'
```

## API

```javascript
tmplEngine([string=''], [options={}])
```

**Arguments**

- [string=''] (string): The template string.
- [options={}] (Object): The options object.
- [options.escape=_.templateSettings.escape] (RegExp): The HTML "escape" delimiter.
- [options.evaluate=_.templateSettings.evaluate] (RegExp): The "evaluate" delimiter.
- [options.imports=_.templateSettings.imports] (Object): An object to import into the template as free variables.
- [options.interpolate=_.templateSettings.interpolate] (RegExp): The "interpolate" delimiter.
- [options.sourceURL='lodash.templateSources[n]'] (string): The sourceURL of the compiled template.
- [options.variable='obj'] (string): The data object variable name.
- [options.includePath=process.cwd()] (string): The path of included templates.
- [options.includeExt='.template'] (string): The file extension of included templates.

**Returns**

(Function): Returns the compiled template function.

## License

MIT
