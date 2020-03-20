const { exportWidget } = require("./src/export_widget");
const { exportColor } = require("./src/export_color");
const { update, show } = require("./src/ui");

module.exports = {
    panels: {
        createWidgets: {
            show,
            update
        }
    },
    commands: {
        exportWidget: exportWidget,
        exportColor: exportColor
    }
};
