import '../../functions/util.dart';

class Radius {
  double topLeft;
  double topRight;
  double bottomRight;
  double bottomLeft;

  Radius({this.topLeft, this.topRight, this.bottomRight, this.bottomLeft});

  Radius.fromJson(Map<String, dynamic> json) {
    topLeft = fixDouble(json['topLeft']);
    topRight = fixDouble(json['topRight']);
    bottomRight = fixDouble(json['bottomRight']);
    bottomLeft = fixDouble(json['bottomLeft']);
  }
  bool isCircular() {
    return topLeft == topRight &&
        topRight == bottomRight &&
        bottomRight == bottomLeft;
  }
}
