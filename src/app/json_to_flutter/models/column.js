const { choiceBestAlignment, generateDistances } = require("./alignmentRowAndColumn");

class Column {
  constructor(x, y, w, h, gw, gh) {
    this.type = Column;
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
    generateDistances(bestAlignment, widgets, this.distances, false);
    bestAlignment = bestAlignment == "" ? "" : `mainAxisAlignment: ${bestAlignment},`;
    let wid = `${widgets}`;
    return `Column(${bestAlignment}children:<Widget>[${wid}],)`;
  }

  _addDistance(i, child, no) {
   if (i == 0) {
      this.distances.push(child.widget.y - this.y);
    } else {
      this.distances.push(child.widget.y - (no.children[i - 1].widget.y + no.children[i - 1].widget.h));
    }
    if (i == no.children.length - 1) {
      this.distances.push((this.y + this.h) - (no.children[i].widget.y + no.children[i].widget.h));
    }
  }
}

module.exports = { Column };