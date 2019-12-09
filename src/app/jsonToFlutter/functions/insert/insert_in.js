const { insertWidgetAtNoWithType } = require("./insert");
const { No } = require("../../models/no");
var Relation = require("../../jsonToFlutter");
var checkIfIsInside = require("../checkRelation");
var checkRelation = require("../checkRelation");
const { costBenefit } = require("../costBenefit");

function insertInside(father, widget) {
    if (father.children.length == 0) {
        father.children.push(new No(father, widget, []));
    } else {
        let inside;
        // Checking if it's inside something inside
        for (let i = 0; i < father.children.length; i++) {
            let child = father.children[i];
            let vd = checkIfIsInside.checkIfIsInside(child.widget, widget);
            if (vd == Relation.Relation.STACK || vd == Relation.Relation.INSIDE) {
                inside = child;
                break;
            }
        }

        if (inside != null) {
            // It's inside something inside
            checkRelation.checkRelation(inside, widget);
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