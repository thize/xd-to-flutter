const { choiceBestAlignment, generateDistances } = require("./alignmentRowAndColumn");

class Column {
  constructor(x, y, w, h, gw, gh) {
    this.type = Column;
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
    generateDistances(bestAlignment, widgets, distances, false);
    bestAlignment = bestAlignment == "" ? "" : `mainAxisAlignment: ${bestAlignment},`;
    let wid = `${widgets}`;
    return `Column(${bestAlignment}children:<Widget>[${wid}],)`;
  }

  _addDistance(i, distances, child, no) {
    if (i == 0) {
      distances.push(child.widget.y - this.y);
    } else {
      distances.push(child.widget.y - (no.children[i - 1].widget.y + no.children[i - 1].widget.gh));
    }
    if (i == no.children.length - 1) {
      distances.push((this.y + this.gh) - (no.children[i].widget.y + no.children[i].widget.gh));
    }
  }
}

module.exports = { Column };