import '../models/index.dart';

CostBenefit costBenefit(No node, Widget prox, {bool onlyInside = false}) {
  int bestPosition = 0;
  var _cb;
  var _bcb;
  var tipoUsado = node.widget.runtimeType;
  if (onlyInside) {
    bestPosition = 1;
    _bcb = _custoBeneficio(node.children[0].widget, prox, tipoUsado);
  } else {
    tipoUsado = null;
    _bcb = _custoBeneficio(node.widget, prox, tipoUsado);
  }
  for (var i = bestPosition; i < node.children.length; i++) {
    _cb = _custoBeneficio(node.children[i].widget, prox, tipoUsado);
    if (_cb[0] + _cb[1] <= _bcb[0] + _bcb[1]) {
      bestPosition = i + 1;
      _bcb = _cb;
    }
    if (_cb[0] + _cb[1] <= 0) {
      break;
    }
  }

  return new CostBenefit(bestPosition, _bcb[0] > _bcb[1] ? Row : Column);
}

List<double> _custoBeneficio(Widget ant, Widget widget, tipo) {
  List<Widget> itens = [ant, widget];
  int acima = 0;
  int esq = 0;
  if (ant.y > widget.y) {
    acima = 1;
  }
  if (ant.x > widget.x) {
    esq = 1;
  }
  if ((itens[esq].x + itens[esq].gw) > itens[(esq + 1) % 2].x &&
      (tipo == Row || tipo == null)) {
    return [-1, 0];
  }
  if ((itens[acima].y + itens[acima].gh) > itens[(acima + 1) % 2].y &&
      (tipo == Column || tipo == null)) {
    return [0, -1];
  }
  double alt;
  double larg;
  larg = (itens[(esq + 1) % 2].x - (itens[esq].x + itens[esq].gw));
  if (larg < 0) {
    larg = 0;
  }

  alt = (itens[(acima + 1) % 2].y - (itens[acima].y + itens[acima].gh));
  if (alt < 0) {
    alt = 0;
  }
  return [larg, alt];
}
