const { getManifest, getNearestIcon } = require('./manifest.js');

let manifest;

function strToHtml(str) {
    if (Array.isArray(str)) {
        return str.map(str => strToHtml(str)).join('');
    }
    if (typeof str !== 'string') {
        return strToHtml(`${str}`);
    }

    let html = str;

    // handle some markdown stuff
    if (html.substr(0, 2) === '##') {
        html = `<h3>${html.substr(2).trim().toUpperCase()}</h3>`;
    } else if (html.substr(0, 1) === '#') {
        html = `<h2>${html.substr(1).trim()}</h2>`;
    } else if (html.substr(0, 2) === '* ') {
        html = `<p class="list"><span class="bullet margin">•</span><span class="margin">${html.substr(2).trim()}</span></p>`;
    } else if (html.substr(0, 4) === '----') {
        html = `<hr class="small"/>${html.substr(5).trim()}`;
    } else if (html.substr(0, 3) === '---') {
        html = `<hr/>${html.substr(4).trim()}`;
    } else {
        html = `<p>${html.trim()}</p>`;
    }

    // handle links -- the catch here is that the link will transform the entire paragraph!
    const regex = /\[([^\]]*)\]\(([^\)]*)\)/;
    const matches = str.match(regex);
    if (matches) {
        const title = matches[1];
        const url = matches[2];
        html = `<p><a href="${url}">${html.replace(regex, title).replace(/\<\|?p\>/g, '')}</a></p>`;
    }

    return html;
}

async function createDialog({
    title,
    buttonText,
    icon = 'plugin-icon',
    msgs,
    prompt,
    multiline = false,
    render,
    template,
    isError = false,
    buttons = [
        { label: 'Cancel', variant: 'cta', type: 'submit' }
    ] } = {},
    width = 360,
    height = 'auto',
    iconSize = 18
) {

    let messages = Array.isArray(msgs) ? msgs : [msgs];

    try {
        if (!manifest) {
            manifest = await getManifest();
        }
    } catch (err) {
        // do nothing
    }

    let usingPluginIcon = false;
    if (icon === 'plugin-icon') {
        if (manifest.icons) {
            usingPluginIcon = true;
            iconSize = 24;
            icon = getNearestIcon(manifest, iconSize);
        }
    }

    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
<style>
    form {
        width: ${width}px;
    }
    .h1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .h1 img {
        width: ${iconSize}px;
        height: ${iconSize}px;
        flex: 0 0 ${iconSize}px;
        padding: 0;
        margin: 0;
    }
    img.plugin-icon {
        border-radius: 4px;
        overflow: hidden;
    }
    .list {
        display: flex;
        flex-direction: row;
    }
    .list .margin {
        margin-bottom: 0;
        margin-left: 0;
    }
    .list span {
        flex: 0 0 auto;
        border: 1px solid transparent;
    }
    .list .bullet {
        text-align: center;
    }
    .list + .list {
        margin-top: 0;
    }
    textarea {
        height: 200px;
    }
    .container {
        zoverflow-x: hidden;
        overflow-y: auto;        
        height: ${height === 'auto' ? height : `${height}px`};
    }
    .button {
        color: green !important;
    }
</style>
<form method="dialog">
    <h1 class="h1">
        <span ${isError || title == 'Error' || title == 'Invalid Tapped' ? `class="color-red"` : title == 'Sucess' ? `class="color-green"` : ""}>${title}</span>
        ${icon ? `<img ${usingPluginIcon ? `class="plugin-icon" title="${manifest.name}"` : ''} src="${icon}" />` : ''}
    </h1>
    <hr />
    <div class="container">
        ${
        !render && (
            template ? template() : (
                messages.map(msg => strToHtml(msg)).join('') +
                (prompt ? `<label>${
                    multiline ?
                        `<textarea id="prompt" placeholder="${prompt}"></textarea>` :
                        `<input type="text" id="prompt" placeholder="${prompt}" />`
                    }</label>` : '')
            )
        )
        }
    </div>
    <footer>
        ${buttons.map(({ label, type, variant } = {}, idx) => `<button id="btn${idx}" type="${type}" uxp-variant="${variant}">${buttonText}</button>`).join('')}
    </footer>
</form>
    `;

    // if render fn is passed, we'll call it and attach the DOM tree
    if (render) {
        dialog.querySelector(".container").appendChild(render());
    }

    // The "ok" and "cancel" button indices. OK buttons are "submit" or "cta" buttons. Cancel buttons are "reset" buttons.
    // Ensure that the form can submit when the user presses ENTER (we trigger the OK button here)
    const form = dialog.querySelector('form');
    form.onsubmit = () => dialog.close('ok');

    // Attach button event handlers and set ok and cancel indices
    buttons.forEach(({ } = {}, idx) => {
        const button = dialog.querySelector(`#btn${idx}`);
        button.onclick = e => {
            e.preventDefault();
            dialog.close('ok');
        }
    });
    const listener = function () {
        document.removeEventListener(listener);
        dialog.close();
    };
    document.addEventListener('keydown', listener);
    try {
        document.appendChild(dialog);
        await dialog.showModal();
    } catch (err) {
        // system refused the dialog
        return { which: cancelButtonIdx, value: '' };
    } finally {
        dialog.remove();
    }
}

async function exportDialog(title, buttonText, ...msgs) {
    return createDialog({ title, buttonText, msgs, });
}

module.exports = {
    createDialog,
    exportDialog
};