/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("series-spline-stacked",function(e,t){e.StackedSplineSeries=e.Base.create("stackedSplineSeries",e.SplineSeries,[e.StackingUtil],{setAreaData:function(){e.StackedSplineSeries.superclass.setAreaData.apply(this),this._stackCoordinates.apply(this)}},{ATTRS:{type:{value:"stackedSpline"}}})},"3.17.2",{requires:["series-stacked","series-spline"]});
