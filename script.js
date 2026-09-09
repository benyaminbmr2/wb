window.addEventListener("load", () => {

    const enterBtn =
    document.getElementById("enterBtn");

    const music =
    document.getElementById("bgMusic");

    const modal =
    document.getElementById("welcomeModal");

    enterBtn.addEventListener("click", () => {

        music.play();

        modal.style.display = "none";

    });

});