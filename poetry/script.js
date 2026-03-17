
const content = document.getElementById("content");
const buttons = document.querySelectorAll(".article-button");

async function loadFile(name) {

    const response = await fetch(`poems/${name}.html`);
    const text = await response.text();

    content.innerHTML = text;

    buttons.forEach(b => b.classList.remove("active"));
    document
        .querySelector(`[data-file="${name}"]`)
        ?.classList.add("active");
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.file;
        location.hash = name;
    });
});

window.addEventListener("hashchange", () => {
    const name = location.hash.substring(1);
    if (name) loadFile(name);
});

if (location.hash) {
    loadFile(location.hash.substring(1));
}

