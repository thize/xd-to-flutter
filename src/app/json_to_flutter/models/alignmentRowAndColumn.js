const { SizedBox } = require("./sizedBox");

function generateDistances(bestAlignment, widgets, distances, isRow) {
    let aux = 0;
    if (bestAlignment == "MainAxisAlignment.center" || bestAlignment == "MainAxisAlignment.end" || bestAlignment == "") {
        if (bestAlignment != "MainAxisAlignment.center") {
            aux = 0;
        }
        let dist = aux;
        for (let i = aux; i < widgets.length - aux; i++ , dist++) {
            if (distances[dist] != 0) {
                widgets.splice(i, 0, new SizedBox(isRow ? distances[dist] : 0, isRow ? 0 : distances[dist]).generateWidget());
                i++;
            }
        }
    }
}

function choiceBestAlignment(distances) {
    return "MainAxisAlignment.center";
    const size = new Set(distances).size;
    const first = distances[0];
    const last = distances[distances.length - 1];
    if (size == 1 && first != 0) {
        return "MainAxisAlignment.spaceEvenly";
    } else if (size == 2 && first == 0) {
        return "MainAxisAlignment.spaceBetween";
    } else if (size == 2 && first == last && new Set(distances.slice[1, distances.length - 2]).size == 1) {
        return "MainAxisAlignment.spaceAround";
    } else if (last != 0 && first != 0) {
        return "MainAxisAlignment.center";
    } else if (last == 0 && first != 0) {
        return "MainAxisAlignment.end";
    }
    //Start
    return "";
}


module.exports = { generateDistances, choiceBestAlignment };