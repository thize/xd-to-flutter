class Stack {
  constructor(x, y, w, h, gw, gh) {
    this.type = Stack;
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
    widgets.reverse();
    let wid = `${widgets}`;
    return `Stack(alignment: Alignment.center,children:<Widget>[${wid}],)`;
  }
}

module.exports = { Stack };