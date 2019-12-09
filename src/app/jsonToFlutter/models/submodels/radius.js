class Radius {
  constructor(json) {
    this.topLeft = json['topLeft'];
    this.topRight = json['topRight'];
    this.bottomRight = json['bottomRight'];
    this.bottomLeft = json['bottomLeft'];
  }

  isCircular() {
    return this.topLeft == this.topRight &&
      this.topRight == this.bottomRight &&
      this.bottomRight == this.bottomLeft;
  }
}

module.exports = { Radius };