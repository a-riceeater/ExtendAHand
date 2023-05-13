_("#showPassword").addEventListener("click", () => {
    let checked = _("#showPassword").getAttribute("data") == "checked";

    if (checked) {
        _("#showPassword").style.backgroundColor = "transparent"
        _("#showPassword").setAttribute("data", "unchecked")
        _("#password").setAttribute("type", "password")
    } else {
        _("#showPassword").style.backgroundColor = "rgb(255, 123, 0)"
        _("#showPassword").setAttribute("data", "checked")
        _("#password").setAttribute("type", "text")
    }
})

document.addEventListener("keydown", () => {
    let result = ''
    setTimeout(() => {
        document.querySelectorAll("input").forEach(ele => {
            ele.value.trim() == "" ? result += '0' : result += '1'
        })

        if (result == '111') _("#confirm-btn").classList.remove("disabled")
        else _("#confirm-btn").classList.add("disabled")
    })
})

_("#confirm-btn").addEventListener("click", () => {
    if (_("#confirm-btn").classList.contains("disabled")) return

    const name = _("#name").value;
    const email = _("#email").value;
    const password = _("#password").value;

    _("#confirm-btn").innerHTML = `
    <img src="/accounts/loader-spinning.gif" height="30px" width="40px">
    `

    _("#confirm-btn").classList.add("disabled")

    fetch("/api/register", {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
        .then((d) => d.json())
        .then((d) => {
            _("#confirm-btn").innerHTML = `Register`
            _("#confirm-btn").classList.remove("disabled")

            if (d.error) {
                _("#error").innerText = d.error;
                setTimeout(() => _("#error").innerText = '', 3000)
            } else {
                window.location = '/'
            }
        })
})