import 'dart:math';
import 'models/index.dart';
import 'package:ansicolor/ansicolor.dart';
import './main.dart';

logTree(No node, int dist) {
  if (verbose) {}
  var ant = 0;
  var start = "";
  for (var i = 0; i < dist; i++) {
    start += "|  ";
  }
  if (ant == dist) {
    print(green("\nStructure:"));
  }
  print(blue(
      "$start${node.widget.runtimeType} - ${node.widget.id}, w = ${node.widget.gw}, h = ${node.widget.gh}, x = ${node.widget.x}, y = ${node.widget.y}"));
  node.children.forEach((f) {
    logTree(f, dist + 1);
  });
}

logCode(String code) {
  if (verboseCode) {
    print(green("\nCode:"));
    print(blue("$code"));
  }
}

randomizrCor() {
  String color = "Colors.${[
    "blue",
    "yellow",
    "red",
    "green",
    "bwidget.runtimeType ==n",
    "purple",
    "orange",
    "cyan",
    "indigo",
    "pink",
    "teal",
    "amber",
  ][Random().nextInt(12)]}";
  return color;
}

var red = new AnsiPen()
  ..white()
  ..xterm(009);
var green = new AnsiPen()
  ..white()
  ..xterm(010);
var blue = new AnsiPen()
  ..white()
  ..xterm(014);
printB(String text) {
  print('\t\x1b[90m$text\x1b[0m');
}

printr(String text) {
  print('\t\x1b[91m$text\x1b[0m');
}

printg(String text) {
  print('\t\x1b[92m$text\x1b[0m');
}

printy(String text) {
  print('\t\x1b[93m$text\x1b[0m');
}

printb(String text) {
  print('\t\x1b[94m$text\x1b[0m');
}

printm(String text) {
  print('\t\x1b[95m$text\x1b[0m');
}

printc(String text) {
  print('\t\x1b[96m$text\x1b[0m');
}

printw(String text) {
  print('\t\x1b[97m$text\x1b[0m');
}
