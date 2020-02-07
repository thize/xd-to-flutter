function showMessageWithColor(text, color, tag) {
    tag = tag == null ? "messageWidget" : tag;
    const message = document.querySelector(`#${tag}`);
    message.innerHTML = text;
    message.style.color = color;
    setTimeout(function () { message.innerHTML = ""; }, 1500);
}


module.exports = { showMessageWithColor }