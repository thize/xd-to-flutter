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
TODO:
! Android Adaptive icon
! Mask
! Repeat Grid
! List View
! Styled Widget
*/
