_(".confirmJoin").addEventListener("click", () => {
    let group = document.URL.split("/").pop();
    fetch(`/api/join-group/${group}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((d) => d.json())
        .then((d) => {
            console.dir(d);
            console.log(d.error)

            if (d.error) {
                _("#error-jg").style.opacity = '1';
                _("#error-jg").innerHTML = d.error;

                setTimeout(() => {
                    _("#error-jg").style.opacity = '0'
                }, 1000)
            } else {
                if (d.joined) window.location = '/groups/' + group;
            }
        })
})

_(".cancelJoin").addEventListener("click", () => window.location = '/')