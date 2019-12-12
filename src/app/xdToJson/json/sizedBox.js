const { fixDouble } = require("../util");

function sizedBox(node) {
    let x = -1, y = -1, w = -1, h = -1, gw = -1, gh = -1;
    node.itemsIncludingLocked.forEach(function (item) {
        if (x == -1) {
            x = item.globalBounds.x;
            y = item.globalBounds.y;
            w = x + item.localBounds.width;
            h = y + item.localBounds.height;
            gw = x + item.globalBounds.width;
            gh = y + item.globalBounds.height;
        } else {
            x = Math.min(x, item.globalBounds.x);
            y = Math.min(y, item.globalBounds.y);
            w = Math.max(w, item.globalBounds.x + item.localBounds.width);
            h = Math.max(h, item.globalBounds.y + item.localBounds.height);
            gw = Math.max(w, item.globalBounds.x + item.globalBounds.width);
            gh = Math.max(h, item.globalBounds.y + item.globalBounds.height);
        }
    });
    gh = gh - y;
    gw = gw - x;
    h = h - y;
    w = w - x;
    const json = JSON.parse(`
    { 
        "type": "sizedBox",
        "name": "Selection",
        "x": ${fixDouble(x)},
        "y": ${fixDouble(y)},
        "gw": ${fixDouble(gw)},
        "gh": ${fixDouble(gh)},
        "w": ${fixDouble(w)},
        "h": ${fixDouble(h)}
    }`);
    return JSON.stringify(json);
}


module.exports = { sizedBox };