const { fixDouble } = require("../utils");

class Bounds {
    /**
    * @param {number} x1
    * @param {number} x2
    * @param {number} y1
    * @param {number} y2
    */
    constructor(x1, x2, y1, y2) {
        this.x1 = fixDouble(x1);
        this.x2 = fixDouble(x2);
        this.y1 = fixDouble(y1);
        this.y2 = fixDouble(y2);
    }
}

module.exports = {
    Bounds: Bounds,
};