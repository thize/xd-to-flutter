function initial(item) {
    let x = item.globalBounds["x"];
    let y = item.globalBounds["y"];
    let w = item.globalBounds.width;
    let h = item.globalBounds.height;
    const json = JSON.parse(`
    { 
        "type": "rectangle",
        "name": "initialItem",
        "x": ${x},
        "y": ${y},
        "w": ${w},
        "h": ${h},
        "gbW": ${w},
        "gbH": ${h},
        "rotation": null,
        "opacity": null,
        "border": null,
        "shadow": null,
        "blend": null,
        "color": null,
        "radius": null,
        "shape": "initial",
        "gradient": null
    }`);
    return JSON.stringify(json);
}

module.exports = { initial };