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

        if (groups.every(e => e == null || !e)) return _("#youHaveNo").show();

        if (groups.length == 0) return _("#youHaveNo").show();

        for (let i = 0; i < groups.length; i++) {

            const el = document.createElement("div")
            el.innerHTML = `
                <span class="g-title">${groups[i]}</span>
                <br>
                <span class="g-desc">The group help for ${groups[i]}.</span>`
            
            el.classList.add("dft-group-btn");

            _("#groups").appendChild(el);
        }
    })

_("#confirm-gj").addEventListener("click", () => {
    if (_("#confirm-gj").style.opacity == "1") {
        const group = _("#jag-input").value;
        
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
    }
})

_("#jag-input").addEventListener("keydown", () => {
    setTimeout(() => {
        if (_("#jag-input").value.trim() != "") {
            _("#confirm-gj").style.cursor = "pointer"
            _("#confirm-gj").style.opacity = "1"
        } else {
            _("#confirm-gj").style.cursor = "not-allowed"
            _("#confirm-gj").style.opacity = "0.5"
        }
    })
})

_(".mc-close").addEventListener("click", () => {
    _(".modal-confirm").hide();
})

_(".joinGroup").addEventListener("click", () => {
    _(".modal-confirm").show();
})