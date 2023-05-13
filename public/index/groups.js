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