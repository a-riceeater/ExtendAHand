let el = _(".search");

_(".search").addEventListener("keydown", (ev) => {
    setTimeout(() => {
        if (el.innerText == '' && ev.key == "Backspace") {
            if (!el.contains(_(".search-place"))) {
                const e = document.createElement("span");
                e.classList.add("search-place")
                e.innerText = "Search for a group or post"

                el.appendChild(e);
            }

        }
        else if (el.contains(_(".search-place")) && ev.key.toString().length > 1) { ev.preventDefault(); moveCaretToStart(el) }
        else {
            if (el.contains(_(".search-place")) && ev.key.toString().length == 1 && !ev.ctrlKey ) {
                _(".search-place").remove();
                el.innerText = ev.key;
                setEndOfContenteditable(el)
            }
        }
    })
})

_(".search").addEventListener("focus", () => {
    setTimeout(() => moveCaretToStart(el))
}, true);

function moveCaretToStart(element) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
}

function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    else if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(contentEditableElement);
        range.collapse(false);
        range.select();
    }
}
