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
  output.getSession().setValue('javascript: ' + encoder.encode(input.getSession().getValue()).replace(/%0A/g, ''));
});
input.getSession().on("changeAnnotation", function () {
  var annotations = input.getSession().getAnnotations(), errors = [];
  /* for (var anno in annotations) {
    if (anno.type != 'info') {
      errors.push(`${anno.row}${anno.column === undefined ? '' : ':' + anno.column} ${anno.text}`);
    }
  } */
    alert(JSON.stringify(annotations))
});
