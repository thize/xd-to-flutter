const { costBenefit } = require("../costBenefit");
const { insertWidgetAtNoWithType } = require("./insert");

function insertOutside(father, widget) {
    let cost = costBenefit(father, widget);
    let putOn =
        cost.bestPosition == 0 ? father : father.children[cost.bestPosition - 1];
    insertWidgetAtNoWithType(widget, putOn, cost.type);
}

module.exports = { insertOutside };