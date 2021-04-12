/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

// Serialization methods related to Container BoxDecoration

const xd = require("scenegraph");

const { getColor } = require("./color");
const { getGradientParam } = require("./gradients");
const { changeOutputUiText } = require("../../ui/components/output_ui");

/** BOXDECORATION */
function getColorOrDecorationParam(xdNode, parameters) {
	let noCorner = !(xdNode instanceof xd.Ellipse);
	if (noCorner) {
		const radii = xdNode.cornerRadii;
		const tl = radii.topLeft, tr = radii.topRight, br = radii.bottomRight, bl = radii.bottomLeft;
		noCorner = tl == 0 && tl === tr && tl === br && tl === bl;
	}
	if (!xdNode.strokeEnabled && noCorner && (xdNode.shadow == null || !xdNode.shadow.visible) && xdNode.fill instanceof xd.Color) {
		return _getFillParam(xdNode, parameters);
	} else {
		return getDecorationParam(xdNode, parameters);
	}
}

exports.getColorOrDecorationParam = getColorOrDecorationParam;

function getDecorationParam(o, parameters) {
	return `decoration: ${_getBoxDecoration(o, parameters)}, `;
}

exports.getDecorationParam = getDecorationParam;


function getStyledDecoration(xdNode, parameters) {
	const { fix, getOpacity } = require("../../util");
	//! border
	let s = !xdNode.strokeEnabled ? '' : `
    border: Border.all(
        width: ${xdNode.strokeWidth},
        color:  ${getColor(xdNode.stroke, getOpacity(xdNode))},
        ),`;
	//! shadow
	let bs = xdNode.shadow;
	if (!bs || !bs.visible) { bs = ""; } else {
		bs = `boxShadow: [BoxShadow(color: ${getColor(bs.color, getOpacity(xdNode))}, offset: Offset(${fix(bs.x)}, ${fix(bs.y)}), blurRadius: ${fix(bs.blur)}, ), ], `;
	}
	//! radius
	let br = _getBorderRadiusParam(xdNode);
	//! Result
	return `.decoration(
         ${_getFillParam(xdNode, parameters)}${s}${bs}${br}
    )`;
}

exports.getStyledDecoration = getStyledDecoration;

function _getBoxDecoration(xdNode, parameters) {
	const { getParamList } = require("../../util");
	let str = getParamList([
		_getBorderRadiusParam(xdNode, parameters),
		_getFillParam(xdNode, parameters),
		_getBorderParam(xdNode, parameters),
		_getBoxShadowParam(xdNode, parameters)
	]);
	return "BoxDecoration(" + str + ")";
}

/** FILL & STROKE */
function _getFillParam(xdNode, parameters) {
	if (!xdNode.fillEnabled || !xdNode.fill) { return ""; }
	let fill = xdNode.fill, blur = xdNode.blur;
	let fillOpacityFromBlur = (blur && blur.visible && blur.isBackgroundEffect) ? blur.fillOpacity : 1.0;
	const { getOpacity } = require("../../util");
	let opacity = getOpacity(xdNode) * fillOpacityFromBlur;
	if (fill instanceof xd.Color) {
		let colorParameter = parameters["fill"].isOwn
			? getColor(xdNode.fill, opacity)
			: parameters["fill"].name;
		return `color: ${colorParameter}, `;
	}
	if (fill instanceof xd.ImageFill) {
		return `
		image: DecorationImage( 
			image: AssetImage(''),
			fit: ${getBoxFit(fill.scaleBehavior)},
			${_getOpacityColorFilterParam(opacity)}
		), 
		`;
	}
	let gradient = getGradientParam(fill, opacity);
	if (gradient) { return gradient; }
	changeOutputUiText(`Unrecognized fill type ('${fill.constructor.name}').`, 'red');
}

function _getOpacityColorFilterParam(opacity) {
	if (opacity >= 1) { return ''; }
	return `colorFilter: new ColorFilter.mode(Colors.black.withOpacity(${opacity}), BlendMode.dstIn), `;
}

function _getBorderParam(xdNode, parameters) {
	const isLine = xdNode instanceof xd.Line;
	if (!isLine && xdNode.strokeEnabled && xdNode.strokePosition !== xd.GraphicNode.INNER_STROKE) {
		changeOutputUiText('Only inner strokes are supported on rectangles & ellipses.', 'Brown');
	}
	if (xdNode.strokeEnabled && xdNode.strokeJoins !== xd.GraphicNode.STROKE_JOIN_MITER) {
		changeOutputUiText('Only miter stroke joins are supported on rectangles & ellipses.', 'Brown');
	}
	let dashes = xdNode.strokeDashArray;
	if (xdNode.strokeEnabled && dashes && dashes.length && dashes.reduce((a, b) => a + b)) {
		changeOutputUiText('Dashed lines are not supported on rectangles & ellipses.', 'Brown');
	}
	let strokeEnableParamRef = parameters["strokeEnabled"];
	let strokeEnableParam = strokeEnableParamRef.parameter;
	const { getOpacity } = require("../../util");
	let strokeParam = parameters["stroke"].isOwn
		? xdNode.stroke && getColor(xdNode.stroke, getOpacity(xdNode))
		: parameters["stroke"].name;
	if (!strokeParam) { return ""; }

	if (strokeEnableParamRef.isOwn) {
		if (!xdNode.strokeEnabled || !xdNode.stroke) { return ""; }
		return `border: Border.all(width: ${xdNode.strokeWidth}, color: ${strokeParam},), `;
	} else {
		return `border: ${strokeEnableParam.name} ? Border.all(width: ${xdNode.strokeWidth}, color: ${strokeParam},) : null, `;
	}
}


/** BORDERRADIUS */
function _getBorderRadiusParam(o) {
	let radiusStr;
	if (o instanceof xd.Ellipse) {
		const x = o.radiusX;
		const y = o.radiusY;
		if (x == y) return 'shape: BoxShape.circle,';
		radiusStr = _getBorderRadiusForEllipse(o);
	} else if (o.hasRoundedCorners) {
		radiusStr = _getBorderRadiusForRectangle(o);
	}
	return radiusStr ? `borderRadius: ${radiusStr}, ` : "";
}

function _getBorderRadiusForEllipse(o) {
	return `BorderRadius.all(Radius.elliptical(${o.radiusX}, ${o.radiusY}))`;
}

function _getBorderRadiusForRectangle(o) {
	let radii = o.cornerRadii;
	let tl = radii.topLeft, tr = radii.topRight, br = radii.bottomRight, bl = radii.bottomLeft;
	if (tl === tr && tl === br && tl === bl) {
		let withStyledWidget = document.querySelector('input[name="simpleType"]');
		withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
		if (withStyledWidget) return `${tl}.circularBorderRadius()`;
		return `BorderRadius.circular(${tl})`;
	} else {
		if ((tl == tr || (tl <= 1 && tr <= 1)) && (br == bl || (br <= 1 && bl <= 1))) {
			return `BorderRadius.vertical(
				${_getRadiusParam("top", tl)}
				${_getRadiusParam("bottom", br)}
			)`;
		}

		if ((tl == bl || (tl <= 1 && bl <= 1)) && (br == tr || (br <= 1 && tr <= 1))) {
			return `BorderRadius.horizontal(
				${_getRadiusParam("left", tl)}
				${_getRadiusParam("right", br)}
			)`;
		}
		return 'BorderRadius.only(' +
			_getRadiusParam("topLeft", tl) +
			_getRadiusParam("topRight", tr) +
			_getRadiusParam("bottomRight", br) +
			_getRadiusParam("bottomLeft", bl) +
			')';
	}
}

function _getRadiusParam(param, value) {
	if (value <= 1) { return ''; }
	let withStyledWidget = document.querySelector('input[name="simpleType"]');
	withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
	if (withStyledWidget) return `${param}: ${value}.circularRadius(), `;
	return `${param}: Radius.circular(${value}), `;
}


/** SHADOWS */
function _getBoxShadowParam(xdNode) {
	const { getOpacity } = require("../../util");
	let s = xdNode.shadow;
	if (!s || !s.visible) { return ""; }
	return `boxShadow: [BoxShadow(color: ${getColor(s.color, getOpacity(xdNode))}, offset: Offset(${s.x}, ${s.y}), blurRadius: ${s.blur}, ), ], `;
}

function getBoxFit(scaleBehavior) {
	return `BoxFit.${scaleBehavior === xd.ImageFill.SCALE_COVER ? 'cover' : 'fill'}`;
}
