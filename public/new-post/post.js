document.addEventListener("keydown", () => {
    setTimeout(() => {
        if (_("#title").value.trim() != "" && _("#body").value.trim() != "") {
            _(".post").classList.remove("disabled")
        } else {
            _(".post").classList.add("disabled")
        }
    })
})

fetch("/api/get-user-groups", {
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    method: 'GET'
})
    .then((d) => d.json())
    .then((d) => {
        const groups = d.groups;

        if (groups.every(e => e == null || !e)) return

        if (groups.length == 0) return

        for (let i = 0; i < groups.length; i++) {

            const option = document.createElement("option")
            option.innerText = groups[i];

            _("#group").appendChild(option);
        }
    })

_(".post").addEventListener("click", () => {
    if (_(".post").classList.contains("disabled")) return;
    
    const group = _("#group").options[_("#group").selectedIndex].text;

    _(".post").innerHTML = "<img src='/accounts/loader-spinning.gif' height='25px' width='35px'>"

    fetch('/api/create-post', {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            group: group,
            title: _("#title").value,
            body: _("#body").value
        })
    })
        .then((d) => d.json())
        .then((d) => {
            if (d.posted) window.location = `/groups/${group}/post/${d.id}`
            else {
                alert("An error occured.")
            }
        })
})