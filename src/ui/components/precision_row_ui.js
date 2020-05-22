const { customButtom, rowUi } = require("./util");

function precisionRowUi() {
    const title = '<h1>Double Precision: </h1>';
    const decrementPrecisionButton = customButtom('decrementPrecisionButton');
    const incrementPrecisionButton = customButtom('incrementPrecisionButton');
    const precisionValue = '<p class="incrementText", id="incrementText" >2</p>';
    const content = rowUi(decrementPrecisionButton + precisionValue + incrementPrecisionButton);
    return title + content;
}

module.exports = {
    precisionRowUi: precisionRowUi,
};
