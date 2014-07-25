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
YUI.add('ohp-annotation-geometry', function (Y, NAME) {

"use strict";
/**
Geometry math functions

@module ohp-annotation-geometry
**/

/**
Geometry math functions

@class Geometry
@namespace OHP.Annotation
@constructor
**/
var Geometry = {
	/*
	 * Calculates the distance between these two points just like Pythagoras told me
	 */
	getDistanceBetweenPoints: function (p1, p2) {
		var a = p2.x - p1.x,
			b = p2.y - p1.y;
		return Math.sqrt(a*a + b*b);
	},

	/*
	 * Calculates the distance of a point from a line segment defined by the line's start and end points.
	 * General algorithm lifted from http://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment
	 */
	distanceFromLine: function (lineStartPoint, lineEndPoint, point) {
		// I hope this helps:
		//
		//      lineStartPoint
		//      |\
		//      | \
		//      |  \
		//     a|   \c
		//      |    \
		//      |     \
		// point|______\lineEndPoint
		//         b

		var a = Geometry.getDistanceBetweenPoints(lineStartPoint, point),
			b, c, a2, b2, c2, s;

		// the start and end are the same, use the distance from the point to that line point
		if (lineStartPoint.x === lineEndPoint.x && lineStartPoint.y === lineEndPoint.y) {
			return a;
		}

		b = Geometry.getDistanceBetweenPoints(lineEndPoint, point);
		c = Geometry.getDistanceBetweenPoints(lineStartPoint, lineEndPoint);
		a2 = a*a;
		b2 = b*b;
		c2 = c*c;

		if (b2 >= a2 + c2) {
			// the point is at an obtuse or right angle to the start, so return distance to the start
			return a;
		} else if (a2 > b2 + c2) {
			// ditto, but for the end
			return b;
		} else {
			// between the ends, use the 2D point-line distance equation
			s = (a + b + c)/2;
			return 2/c * Math.sqrt(s*(s - a)*(s - b)*(s - c));
		}
	}
};

Y.namespace('OHP.Annotation').Geometry = Geometry;


}, '7.9.0');
