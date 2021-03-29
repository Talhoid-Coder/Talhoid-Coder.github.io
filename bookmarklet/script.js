function minify(code) {
	code = removeCodeComments(code);
    function trim(text) {
		var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
		return text == null ?
			"" :
			(text + "").replace(rtrim, "");
	}
	code = code.split(/\r\n|\r|\n/g);
	var i = 0,
		len = code.length,
		noSemiColon = {},
		t,
		lastChar;

	"} { ; ,".split(" ").forEach(function (x, i) {
		noSemiColon[x] = 1;
	});

	for (; i < len; i++) {
		t = trim(code[i]);
		code[i] = t;
	}
	return code.join("").replace(/;$/, "");
}

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
    var code = 'javascript: ' + encodeURIComponent(minify(input.getSession().getValue()));
    output.getSession().setValue(code);
});
