function rowUi(content) {
    return `<label class="row">${content}</label>`;
}

function buttonUi(id, title, active) {    
    const button = `<button id="${id}" type="submit" uxp-variant="${active ? 'cta' : ''}">${title}</button>`;
    return rowUi(button);
}

module.exports = {
    rowUi: rowUi,
    buttonUi: buttonUi,
};
