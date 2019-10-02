function showMessageWithColor(text, color) {
    const message = document.querySelector("#message");
    message.innerHTML = text;
    message.style.color = color;
    setTimeout(function () { message.innerHTML = "";}, 1500);
}

module.exports = { showMessageWithColor };