_(".confirmJoin").addEventListener("click", () => {
    let group = document.URL.split("/").pop();
    fetch(`/api/join-group/${group}`)
        .then(() => window.location = "/groups/" + group)
})

_(".cancelJoin").addEventListener("click", () => window.location = '/')