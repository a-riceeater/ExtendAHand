const group = document.URL.endsWith("/") ? document.URL.split("/").slice(0, -1).pop() : document.URL.split("/").pop();

fetch("/api/get-posts/" + group)
    .then((d) => d.json())
    .then((d) => {
        for (let i = 0; i < d.length; i++) {
            const da = d[i];

            const post = document.createElement("div")
            post.innerHTML = `
                <h1 class="post-title">${da.title}</h1>
                <p class="post-body">
                    ${da.body.slice(0, 1120)}
                </p>

                <div class="postControls">
                    <a href="/groups/${group}/post/${da.id}">
                        <button class="viewpostBtn" align="right">View Post</button>
                    </a>
                </div>
            `

            post.classList.add("post");
            _(".posts > .wrapper").appendChild(post);
        }
    })

function createPost() {
    fetch("/api/create-post", {
        method: "POST",
        body: JSON.stringify({
            title: "titleee",
            body: "bodyd",
            group: "a"
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}