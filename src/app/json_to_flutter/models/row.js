const { choiceBestAlignment, generateDistances } = require("./alignmentRowAndColumn");

class Row {
  constructor(x, y, w, h, gw, gh) {
    this.type = Row;
    this.id = "-1";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.gw = gw;
    this.gh = gh;
  }

  generateWidget(no) {
    let widgets = [];
    let distances = [];
    for (let i = 0; i < no.children.length; i++) {
      let child = no.children[i];
      this._addDistance(i, distances, child, no);
      widgets.push(`${child.widget.generateWidget(child)}`);
    }
    let bestAlignment = choiceBestAlignment(distances);
    generateDistances(bestAlignment, widgets, distances, true);
    bestAlignment = bestAlignment == "" ? "" : `mainAxisAlignment: ${bestAlignment},`;
    let wid = `${widgets}`;
    return `Row(${bestAlignment}children:<Widget>[${wid}],)`;
  }

  _addDistance(i, distances, child, no) {
    if (i == 0) {
      distances.push(child.widget.x - this.x);
    } else {
      distances.push(child.widget.x - (no.children[i - 1].widget.x + no.children[i - 1].widget.gw));
    }
    if (i == no.children.length - 1) {
      distances.push((this.x + this.gw) - (no.children[i].widget.x + no.children[i].widget.gw));
    }
  }
}

module.exports = { Row };