/*
 * Copyright (c) Orchestral Developments Ltd (2001 - 2014).
 *
 * This document is copyright. Except for the purpose of fair reviewing, no part
 * of this publication may be reproduced or transmitted in any form or by any
 * means, electronic or mechanical, including photocopying, recording, or any
 * information storage and retrieval system, without permission in writing from
 * the publisher. Infringers of copyright render themselves liable for
 * prosecution.
 */
YUI.add('ohp-annotation-freehand-model', function (Y, NAME) {

"use strict";
/**
Extension of DrawingModel for creating Freehand Drawings

@module ohp-annotation-freehand-model
**/

var Geometry = Y.OHP.Annotation.Geometry,
	FreehandModel;

/*
Returns true if the given point is within 10 units from a line segment defined by the line's start and end points
*/
function closeToLine(lineStartPoint, lineEndPoint, point) {
	var distance = Geometry.distanceFromLine(lineStartPoint, lineEndPoint, point);
	return distance < 10;
}

/**
Extension of DrawingModel for creating Freehand Drawings

@class FreehandModel
@namespace OHP.Annotation
@constructor
@extends OHP.Annotation.DrawingModel
**/
FreehandModel = Y.Base.create('ohp-annotation-freehand-model', Y.OHP.Annotation.DrawingModel, [], {

	/*
	 * Add new point to end of points array for this Drawing.
	 * Only adds if its not too close to the last point. Returns true if it added the point.
	 */
	addPoint: function(point) {
		var points = this.get('points'),
			lastPointIndex = points.length - 1;

		if (lastPointIndex < 0) {
			points.push(point);
			this.set('bounds', {
				left: point.x,
				top: point.y,
				right: point.x,
				bottom: point.y
			});
			return true;
		} else {
			// optimisation - only add the point if its further than 3 pixels
			if (Geometry.getDistanceBetweenPoints(point, points[lastPointIndex]) > 3) {
				points.push(point);
				// TODO: consider whether this should only be done at the end, or as we go
				this._updateBounds(point);
				return true;
			} else {
				return false;
			}
		}
	},

	end: function(point) {
		var points = this.get('points'),
			lastPoint;

		// User interaction might have ended outside bounds of the container,
		// in which case, point is null, and we should use last point added
		if (point) {
			points.push(point);
			lastPoint = point;
		} else {
			lastPoint = points[points.length - 1];
		}

		this._updateBounds(lastPoint);
		this._calculateHitSamplePoints();
	},

	_updateBounds: function(point) {
		var bounds = this.get('bounds');

		if (bounds.left > point.x) {
			bounds.left = point.x;
		} else if (bounds.right < point.x) {
			bounds.right = point.x;
		}

		if (bounds.top > point.y) {
			bounds.top = point.y;
		} else if (bounds.bottom < point.y) {
			bounds.bottom = point.y;
		}
	},

	/*
	 * Instead of checking if points are close to every line segment, we calculate a sample set of points
	 * where points closer than 7 pixels to the previous point are skipped.
	 */
	_calculateHitSamplePoints: function() {
		var points = this.get('points'),
			prevPoint = points[0],
			hitSamplePoints = [prevPoint],
			n = points.length,
			i,
			point;

		for (i = 1; i < n; i += 1) {
			point = points[i];
			if (Geometry.getDistanceBetweenPoints(point, prevPoint) > 7) {
				hitSamplePoints.push(point);
				prevPoint = point;
			}
		}

		hitSamplePoints.push(points[points.length - 1]);

		this.set('hitSamplePoints', hitSamplePoints);
	},

	addShapes: function(layer) {
		var points = this.get('points'),
			point = points[0],
			lastIndex = points.length - 1,
			lastPoint = points[lastIndex],
			negative,
			path,
			i;

		layer.set('stroke', {
			weight: 3
		});
		path = layer.addPath();

		path.moveTo(point.x, point.y);

		// To prevent bug in IE where lines of length 0 are not visible,
		// when start and end points are the same, shift x co-ordinate of last point by 1.
		if (lastIndex === 1 && point.x === lastPoint.x && point.y === lastPoint.y) {

			// Ensure point is not added out of bounds.
			negative = lastPoint.x >= (layer.get('width') - 2);

			lastPoint = {
				x: (negative ? (lastPoint.x - 1) : (lastPoint.x + 1)),
				y: lastPoint.y
			};
		}

		for (i = 1; i < lastIndex; i += 1) {
			point = points[i];
			path.lineTo(point.x, point.y);
		}

		path.lineTo(lastPoint.x, lastPoint.y);

		path.end();

		return [path];
	},

	hit: function(point) {
		var hit, prevPoint;

		hit = Y.Array.some(this.get('hitSamplePoints'), function (nextPoint){
			if (prevPoint) {
				if (closeToLine(prevPoint, nextPoint, point)) {
					return true;
				}
			}
			prevPoint = nextPoint;
		});
		return hit;
	}

}, {
	ATTRS: {
		/*
		 * points to draw
		 */
		points: {
			value: []
		},

		/*
		 * reduced set of points to check hit
		 */
		hitSamplePoints: {}
	}
});

Y.namespace('OHP.Annotation').FreehandModel = FreehandModel;


}, '7.9.0', {
    "requires": [
        "ohp-annotation-geometry",
        "model",
        "ohp-annotation-drawing-model",
        "base",
        "ohp-annotation-layer"
    ]
});
