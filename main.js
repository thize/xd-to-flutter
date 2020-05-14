const { exportWidget } = require("./src/export_widget");
const { exportColor } = require("./src/export_color");
const { update, show } = require("./src/panel_ui");

module.exports = {
    panels: {
        createWidgets: {
            show,
            update
        }
    },
    commands: {
        exportColor: exportColor
    }
};