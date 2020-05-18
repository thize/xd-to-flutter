function outputUi() {
    const title = '<h2>Console:</h2>';
    const outputText = `<div class="outputDiv"><p id="outputText" style="white-space: pre-line">Nothing...</p></div>`;
    return title + outputText;
}

function changeOutputUiText(newText, color) {
    const redColor = 'LightCoral';
    const greenColor = 'MediumSeaGreen';
    const element = document.getElementById('outputText');
    element.textContent = newText;
    if (!color) {
        element.style.color = greenColor;
    } else {
        if (color == 'red') {
            color = redColor;
        }
        element.style.color = color;
    }
}

module.exports = {
    outputUi: outputUi,
    changeOutputUiText: changeOutputUiText,
};