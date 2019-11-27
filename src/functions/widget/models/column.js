class Column {
  constructor(x, y, w, h, gw, gh, id) {
    this.type = Column;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.gw = gw;
    this.gh = gh;
    this.id = "-1";
  }

  generateWidget(no) {
    let widgets = [];
    if (no.children != null) {
      no.children.forEach(function (f) {
        widgets.push(`${f.widget.generateWidget(f)}`);
      });
    }
    let wid = `${widgets}`;
    return `Column(children:<Widget>[${wid}],)`;
  }
}

module.exports = { Column };