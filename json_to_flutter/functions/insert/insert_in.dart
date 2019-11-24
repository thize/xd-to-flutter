import '../../models/index.dart';
import '../checkRelationAndInsert.dart';
import '../costBenefit.dart';
import '../insert/insert.dart';

insertInside(No father, Widget widget) {
  if (father.children.length == 0) {
    father.children.add(new No(father, widget, []));
  } else {
    No inside;
    // Checking if it's inside something inside
    for (var child in father.children) {
      Relation vd = checkIfIsInside(child.widget, widget);
      if (vd == Relation.stack || vd == Relation.inside) {
        inside = child;
        break;
      }
    }
    if (inside != null) {
      // It's inside something inside
      checkRelationAndInsert(inside, widget);
    } else {
      // It isn't inside something inside
      // Cost benefit to know where put
      CostBenefit cost = costBenefit(father, widget, onlyInside: true);
      No putOn = cost.bestPosition == 0
          ? father
          : father.children[cost.bestPosition - 1];
      insert(putOn, widget, cost.type);
    }
  }
}
