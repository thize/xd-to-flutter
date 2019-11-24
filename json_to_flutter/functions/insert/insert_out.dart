import '../../models/index.dart';
import 'insert.dart';
import '../costBenefit.dart';

insertOutside(No father, Widget widget) {
  CostBenefit cost = costBenefit(father, widget);
  No putOn =
      cost.bestPosition == 0 ? father : father.children[cost.bestPosition - 1];
  insert(putOn, widget, cost.type);
}
