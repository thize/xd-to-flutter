function outputUi(two) {
    const title = '<h2>Console:</h2>';
    if (two) {
        return title + `<div class="outputDiv"><p id="outputText2" style="white-space: pre-line">Nothing...</p></div>`;
    }
    const outputText = `<div class="outputDiv"><p id="outputText" style="white-space: pre-line">Nothing...</p></div>`;
    return title + outputText;
}

function changeOutputUiText(newText, color, stop = false) {
    const redColor = 'LightCoral';
    const greenColor = 'MediumSeaGreen';
    const element = document.getElementById('outputText');
    const element2 = document.getElementById('outputText2');
    element.textContent = newText;
    element2.textContent = newText;
    if (!color) {
        element.style.color = greenColor;
        element2.style.color = greenColor;
    } else {
        if (color == 'red') {
            color = redColor;
        }
        element.style.color = color;
        element2.style.color = color;
    }
    if (stop) alert('error to stop the app');
}

function getOutputUiText() {
    const element = document.getElementById('outputText');
    if (!element) return '';
    return element.textContent;
}



module.exports = {
    outputUi: outputUi,
    changeOutputUiText: changeOutputUiText,
    getOutputUiText: getOutputUiText,
};