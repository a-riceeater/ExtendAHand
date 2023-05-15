const id = document.URL.endsWith("/") ? document.URL.slice(0, -1).split("/").pop() : document.URL.split("/").pop();

_("#commentBody").addEventListener("keydown", () => {
    if (_("#commentBody").value.trim() != "") {
        _(".answer").classList.remove("disabled")
    }
})

_(".answer").addEventListener("click", () => {
    if (_(".answer").classList.contains("disabled")) return;

    fetch("/api/create-comment", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            group: _("#gname").innerText,
            comment: _("#commentBody").value,
            id: id
        })
    })

    .then((d) => d.json())
    .then((d) => {
        if (!d.posted) alert("An error occured!")
        else window.location = ''
    })
})

_("#a").addEventListener("click", () => {
    _(".shade").show()
    _(".newcomment").show();
})

fetch("/api/fetch-comments", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        group: _("#gname").innerText,
        id: id
    })
})
.then((da) => da.json())
.then((da) => {

    let a = eval(da.com);

    console.dir(a)

    for (let i = 0; i < a.length; i++) {
        let b = JSON.parse(a[i])

        const e = document.createElement("p")
        e.innerHTML = `<pre>${b.user} - ${b.comment}</pre>`
        e.classList.add("comment")
        _(".comments > div").appendChild(e);
    }
})