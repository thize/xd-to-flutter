import '../models/index.dart';

CostBenefit costBenefit(No node, Widget prox, {bool onlyInside = false}) {
  int bestPosition = 0;
  var runType = node.widget.runtimeType;
  List<double> _bestCostBenefit = [];
  if (onlyInside) {
    bestPosition = 1;
    _bestCostBenefit = _costBenefit(node.children[0].widget, prox, runType);
  } else {
    runType = null;
    _bestCostBenefit = _costBenefit(node.widget, prox, runType);
  }
  List<double> _auxCostBenefit = [];
  for (var i = bestPosition; i < node.children.length; i++) {
    _auxCostBenefit = _costBenefit(node.children[i].widget, prox, runType);
    if (_auxCostBenefit[0] + _auxCostBenefit[1] <=
        _bestCostBenefit[0] + _bestCostBenefit[1]) {
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

List<double> _costBenefit(Widget ant, Widget widget, type) {
  List<Widget> item = [ant, widget];
  int above = 0;
  int left = 0;
  if (ant.y > widget.y) above = 1;
  if (ant.x > widget.x) left = 1;
  double distX = item[(left + 1) % 2].x - (item[left].x + item[left].gw);
  double distY = item[(above + 1) % 2].y - (item[above].y + item[above].gh);
  distX = distX < 0 ? -1 : distX;
  distY = distY < 0 ? -1 : distY;
  if (distY == -1 && type == Column) {
    distX = 0;
  } else if (distX == -1 && type == Row) {
    distY = 0;
  }
  return [distX, distY];
}
