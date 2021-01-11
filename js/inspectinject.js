var inspectpopup = open("", "", "resizable,scrollbars=yes,width=550,height=520");
var html =`
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ext-beautify.js" type="text/javascript" charset="utf-8"></script>
<style type="text/css">
    .editor{
        position:absolute;
        top:0;
        right:0;
        bottom:0;
        left:0;
    }
</style>
<div class="editor" id="editor"></div>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.1/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8">
</script>
<script>
    
    var editor=ace.edit("editor");
    var beautify = ace.require("ace/ext/beautify"); // get reference to extension
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");
    oDom = check();
    editor.setValue(get_document_html(oDom));
    editor.commands.addCommand({
        name: 'myCommand',
        bindKey: {win: 'Ctrl-B',  mac: 'Command-B'},
        exec: function(editor) {
            beautify.beautify(editor.session);
        },
        readOnly: true // false if this command should not apply in readOnly mode
    });
    function check() {
        var opener = window.opener;
        if (opener) {
            var Dom = opener.document;
            return Dom;
            } else {
                window.close();
            }
        }           
    }
    function update() {
        check();
        window.opener.document.documentElement.outerHTML = editor.getValue().split(doctypeToString(opener.document.doctype))[0]
    }
    function get_document_html(htmldocument) {
        return doctypeToString(htmldocument.doctype) + '\n' + htmldocument.documentElement.outerHTML
    
    function doctypeToString(doctype) {
        if (doctype === null) {
            return ''
        }
        // Checking with instanceof DocumentType might be neater, but how to get a
        // reference to DocumentType without assuming it to be available globally?
        // To play nice with custom DOM implementations, we resort to duck-typing.
        if (!doctype
            || doctype.nodeType !== doctype.DOCUMENT_TYPE_NODE
            || typeof doctype.name !== 'string'
            || typeof doctype.publicId !== 'string'
            || typeof doctype.systemId !== 'string'
        ) {
            throw new TypeError('Expected a DocumentType')
        }
        const doctypeString = '<!DOCTYPE ${doctype.name}'
            + (doctype.publicId ? ' PUBLIC "${doctype.publicId}"' : '')
            + (doctype.systemId
                ? (doctype.publicId ? '' : ' SYSTEM') + ' "${doctype.systemId}"'
                : '')
            + '>'
        return doctypeString;
    } 
    setInterval(update,50)
</script>
`;
inspectpopup.document.write(html);
inspectpopup.document.close();
