
const content = document.getElementById("content");
const buttons = document.querySelectorAll(".project-button");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        window.location.hash = button.dataset.project;
    });
});

