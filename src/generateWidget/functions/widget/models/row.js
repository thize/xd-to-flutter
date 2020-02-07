class Row {
  constructor(x, y, w, h, gw, gh, id) {
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
    if (no.children != null) {
      no.children.forEach(function (f) {
        widgets.push(`${f.widget.generateWidget(f)}`);
      });
    }
    let wid = `${widgets}`;
    return `Row(children:<Widget>[${wid}],)`;
  }
}


module.exports = { Row };