const { Row } = require("../models/row");
const { Column } = require("../models/column");
const { CostBenefit } = require("../models/costBenefit");

function costBenefit(no, widget, onlyInside) {
  onlyInside = onlyInside == null ? false : onlyInside;
  let bestPosition = 0;
  var runType = no.widget.type;
  let _bestCostBenefit = [];
  if (onlyInside) {
    bestPosition = 1;
    _bestCostBenefit = _costBenefit(no.children[0].widget, widget, runType);
  } else {
    runType = null;
    _bestCostBenefit = _costBenefit(no.widget, widget, runType);
  }
  let _auxCostBenefit = [];
  for (var i = bestPosition; i < no.children.length; i++) {
    _auxCostBenefit = _costBenefit(no.children[i].widget, widget, runType);
    let auxCB = _auxCostBenefit[0] + _auxCostBenefit[1];
    let bCB = _bestCostBenefit[0] + _bestCostBenefit[1];
    if ((auxCB <= bCB && onlyInside) || auxCB < bCB && !onlyInside) {
      onlyInside = true;
      bestPosition = i + 1;
      _bestCostBenefit = _auxCostBenefit;
    }
    if (_auxCostBenefit[0] + _auxCostBenefit[1] <= 0) {
      break;
    }
  }
  return new CostBenefit(
    bestPosition, _bestCostBenefit[0] > _bestCostBenefit[1] ? Row : Column);
}

function _costBenefit(ant, widget, type) {
  let item = [ant, widget];
  let above = 0;
  let left = 0;
  if (ant.y > widget.y) above = 1;
  if (ant.x > widget.x) left = 1;
  let distX = item[(left + 1) % 2].x - (item[left].x + item[left].gw);
  let distY = item[(above + 1) % 2].y - (item[above].y + item[above].gh);
  distX = distX < 0 ? -1 : distX;
  distY = distY < 0 ? -1 : distY;
  if (distY == -1 && type == Column) {
    distX = 0;
  } else if (distX == -1 && type == Row) {
    distY = 0;
  }
  return [distX, distY];
}

module.exports = { costBenefit };