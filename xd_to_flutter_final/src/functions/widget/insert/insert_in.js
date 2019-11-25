const { checkIfIsInside, checkRelationAndInsert } = require("../checkRelationAndInsert");
const { insertWidgetAtNoWithType } = require("./insert");
const { No } = require("../models/no");

function insertInside(father, widget) {
    if (father.children.length == 0) {
        father.children.push(new No(father, widget, []));
    } else {
        let inside;
        // Checking if it's inside something inside
        for (let i = 0; i < father.children.length; i++) {
            let child = father.children[i];
            let vd = checkIfIsInside(child.widget, widget, false, false);
            if (vd == Relation.STACK || vd == Relation.INSIDE) {
                inside = child;
                break;
            }
        }
        if (inside != null) {
            // It's inside something inside
            checkRelationAndInsert(inside, widget);
        } else {
            // It isn't inside something inside
            // Cost benefit to know where put
            let cost = costBenefit(father, widget, true);
            let putOn = cost.bestPosition == 0
                ? father
                : father.children[cost.bestPosition - 1];
            insertWidgetAtNoWithType(widget, putOn, cost.type);
        }
    }
}

module.exports = { insertInside };

