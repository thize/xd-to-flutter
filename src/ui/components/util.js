

function rowUi(content) {
    return `<label class="row">${content}</label>`;
}

function buttonUi(id, title, active) {
    const button = `<button id="${id}" type="submit" uxp-variant="${active ? 'cta' : ''}">${title}</button>`;
    return rowUi(button);
}

function customButtom(id) {
    const folderIconPath = id == 'decrementPrecision' ? '../../images/decrement.png' : '../../images/increment.png';
    const button = `<button uxp-variant="action" id="${id}" /><img src="${folderIconPath}"></button>`;
    return rowUi(button);
}

module.exports = {
    rowUi: rowUi,
    buttonUi: buttonUi,
    customButtom: customButtom,
};
