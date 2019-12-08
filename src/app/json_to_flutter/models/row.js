const { choiceBestAlignment, generateDistances } = require("./alignmentRowAndColumn");

class Row {
  constructor(x, y, w, h, gw, gh) {
    this.type = Row;
    this.id = "-1";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.distances = [];
  }

  generateWidget(no) {
    let widgets = [];
    for (let i = 0; i < no.children.length; i++) {
      let child = no.children[i];
      this._addDistance(i, child, no);
      widgets.push(`${child.widget.generateWidget(child)}`);
    }
    let bestAlignment = choiceBestAlignment(this.distances);
    generateDistances(bestAlignment, widgets, this.distances, true);
    bestAlignment = bestAlignment == "" ? "" : `mainAxisAlignment: ${bestAlignment},`;
    let wid = `${widgets}`;
    return `Row(${bestAlignment}children:<Widget>[${wid}],)`;
  }

  _addDistance(i, child, no) {
    if (i == 0) {
      this.distances.push(child.widget.x - this.x);
    } else {
      this.distances.push(child.widget.x - (no.children[i - 1].widget.x + no.children[i - 1].widget.w));
    }
    if (i == no.children.length - 1) {
      this.distances.push((this.x + this.w) - (no.children[i].widget.x + no.children[i].widget.w));
    }
  }
}

module.exports = { Row };