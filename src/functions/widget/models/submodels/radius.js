const { fixDouble } = require("../../util");

class Radius {
  constructor(json) {
    this.topLeft = fixDouble(json['topLeft']);
    this.topRight = fixDouble(json['topRight']);
    this.bottomRight = fixDouble(json['bottomRight']);
    this.bottomLeft = fixDouble(json['bottomLeft']);
  }

  isCircular() {
    return this.topLeft == this.topRight &&
      this.topRight == this.bottomRight &&
      this.bottomRight == this.bottomLeft;
  }
}

module.exports = { Radius };