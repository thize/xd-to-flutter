const { fixDouble, sz, widthHeight } = require("../functions/util");

class Stack {
  constructor(x, y, w, h, gw, gh) {
    this.type = Stack;
    this.id = "-1";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.top = [];
    this.left = [];
    this.bot = [];
    this.right = [];
  }

  generateWidget(no) {
    let widgets = [];
    for (let i = 0; i < no.children.length; i++) {
      let child = no.children[i];
      this._addDistance(child.widget);
      widgets.push(`${_positioned(child.widget.generateWidget(child), this.top[i], this.left[i], this.bot[i], this.right[i])}`);
    }
    widgets.reverse();
    let wid = `${widgets}`;
    return `SizedBox(${widthHeight(this.w, true)}${widthHeight(this.h, false)}child:Stack(children:<Widget>[${wid}],),)`;
  }

  _addDistance(widget) {
    const wL = widget.x;
    const wT = widget.y;
    const wR = wL + widget.w;
    const wB = wT + widget.h;
    this.top.push(fixDouble(wT - this.y));
    this.left.push(fixDouble(wL - this.x));
    this.bot.push(fixDouble((this.y + this.h) - wB));
    this.right.push(fixDouble((this.x + this.w) - wR));
  }
}


function _positioned(child, top, left, bot, right) {
  if (top == 0 && left == 0) return child;
  const topBot = top <= bot ? top == 0 ? "" : `top:${sz(top)},` : `bottom:${sz(bot)},`;
  const leftRight = left <= right ? left == 0 ? "" : `left:${sz(left)},` : `right:${sz(right)},`;
  return `Positioned(
    ${topBot}
    ${leftRight}
    child:${child},
  )`;
}

module.exports = { Stack };