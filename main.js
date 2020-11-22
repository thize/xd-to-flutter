const { update, show } = require("./src/ui/main_panel_ui");
const { onTapGenerate } = require("./src/generate");
const { exportColor } = require("./src/color");

module.exports = {
    panels: {
        main_panel: {
            show,
            update
        }
    },
    commands: {
        onTapGenerate: onTapGenerate,
        exportColor: exportColor
    }
};


/*
CHANGELOG:
Bordered Text
Fix Container Decoration
Added Column/Row Cross Alignment

TODO:
! Use Color from Asset Panel
! Use TextStyle from Asset Panel
! Android Adaptive icon
! Mask
! Repeat Grid
! List View

TODO: Simple Type:
* Text
* Svg
* Children
* InkWell
! Text Rich
! Container
! Mask
! Grid
*/
