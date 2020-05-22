function build_css() {
    return `
    <style>
    .outputDiv {
        margin: 5px;
    }
    .uiTextField {
        width: 100%;
        margin: 0;
    }
    .uiTextFieldWithButton {
        width: 74%;
        margin: 10;
    }
    input[type="radio"]{
        vertical-align: baseline;
    }
    .incrementText{
        width: 20%;
    }
    </style>
    `;
}

module.exports = {
    build_css: build_css,
};


