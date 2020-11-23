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
* Done
? Have to do
! To Do

TODO:
! Android Adaptive icon
! Use TextStyle from Asset Panel
! Mask
! Repeat Grid
! List View

TODO: Simple Type:
* Text
* Svg
* Children
* InkWell
* Mask
* Grid
* Container
! Text Rich
*/
