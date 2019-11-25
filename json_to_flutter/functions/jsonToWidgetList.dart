import 'dart:convert';
import 'dart:io';
import '../models/index.dart';
import '../debug.dart';

Future<List<Widget>> jsonToWidgetList() async {
  List<Widget> widgets = [];
  try {
    await new File('widgets.json').readAsString().then((fileContents) async {
      var parsedJson = json.decode(fileContents);
      var aux;
      for (int i = 0; i < 9999999; i++) {
        aux = _addWidgetOnList(parsedJson["$i"]);
        if (aux == null) break;
        widgets.add(aux);
      }
    });
  } catch (e) {
    print(red("Without JSON"));
    return null;
  }
  return widgets;
}

Widget _addWidgetOnList(var json) {
  if (json == null) return null;
  switch (json["type"]) {
    case "container":
      return Container.fromJson(json);
    case "svg":
      return Svg.fromJson(json);
    default:
      return Text.fromJson(json);
  }
}
