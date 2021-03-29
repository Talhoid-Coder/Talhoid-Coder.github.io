function removeCodeComments(code) {
    var inQuoteChar = null;
    var inBlockComment = false;
    var inLineComment = false;
    var inRegexLiteral = false;
    var newCode = '';
    for (var i=0; i<code.length; i++) {
        if (!inQuoteChar && !inBlockComment && !inLineComment && !inRegexLiteral) {
            if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
                inQuoteChar = code[i];
            }
            else if (code[i] === '/' && code[i+1] === '*') {
                inBlockComment = true;
            }
            else if (code[i] === '/' && code[i+1] === '/') {
                inLineComment = true;
            }
            else if (code[i] === '/' && code[i+1] !== '/') {
                inRegexLiteral = true;
            }
        }
        else {
            if (inQuoteChar && ((code[i] === inQuoteChar && code[i-1] != '\\') || (code[i] === '\n' && inQuoteChar !== '`'))) {
                inQuoteChar = null;
            }
            if (inRegexLiteral && ((code[i] === '/' && code[i-1] !== '\\') || code[i] === '\n')) {
                inRegexLiteral = false;
            }
            if (inBlockComment && code[i-1] === '/' && code[i-2] === '*') {
                inBlockComment = false;
            }
            if (inLineComment && code[i] === '\n') {
                inLineComment = false;
            }
        }
        if (!inBlockComment && !inLineComment) {
            newCode += code[i];
        }
    }
    return newCode;
}

class urlEncoder {
  constructor() {
    return;
  }
  encode(str) {
    var r = [];
    for (var n = 0, l = str.length; n < l; n++) {
      if (!(/[a-zA-Z0-9\._]/g.test(str.charAt(n)))) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        r.push((hex.length == 1 ? '%0' : '%') + hex.toUpperCase());
      } else {
        r.push(str.charAt(n))
      }
    }
    return r.join('');
  }
}
var active = 0,
  input = ace.edit("inputEditor", {
    theme: "ace/theme/monokai",
    mode: "ace/mode/javascript",
    maxLines: 20,
    minLines: 10,
    wrap: false,
  }),
  output = ace.edit("outputEditor", {
    theme: "ace/theme/monokai",
    mode: "ace/mode/txt",
    maxLines: 20,
    minLines: 10,
    wrap: false,
    readOnly: true
  }),
  editors = document.querySelectorAll('[name="editor"]'),
  buttons = [document.getElementById('input'), document.getElementById('output')];
buttons[0].addEventListener('click', function() {
  editors[0].classList.remove('hidden')
  editors[1].classList.add('hidden')
});
buttons[1].addEventListener('click', function() {
  editors[1].classList.remove('hidden')
  editors[0].classList.add('hidden')
});
input.session.on('change', function(delta) {
  const encoder = new urlEncoder()
  output.getSession().setValue('javascript: ' + encoder.encode(removeCodeComments(input.getSession().getValue())).replace(/%0A/g, '').replace(/%0D/g, ''));
});
