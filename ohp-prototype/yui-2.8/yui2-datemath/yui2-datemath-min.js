YUI.add('yui2-datemath', function(Y) {
    var YAHOO    = Y.YUI2;
    /*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
YAHOO.widget.DateMath={DAY:"D",WEEK:"W",YEAR:"Y",MONTH:"M",ONE_DAY_MS:1000*60*60*24,WEEK_ONE_JAN_DATE:1,add:function(a,e,c){var g=new Date(a.getTime());switch(e){case this.MONTH:var f=a.getMonth()+c;var b=0;if(f<0){while(f<0){f+=12;b-=1;}}else{if(f>11){while(f>11){f-=12;b+=1;}}}g.setMonth(f);g.setFullYear(a.getFullYear()+b);break;case this.DAY:this._addDays(g,c);break;case this.YEAR:g.setFullYear(a.getFullYear()+c);break;case this.WEEK:this._addDays(g,(c*7));break;}return g;},_addDays:function(e,c){if(YAHOO.env.ua.webkit&&YAHOO.env.ua.webkit<420){if(c<0){for(var b=-128;c<b;c-=b){e.setDate(e.getDate()+b);}}else{for(var a=96;c>a;c-=a){e.setDate(e.getDate()+a);}}}e.setDate(e.getDate()+c);},subtract:function(a,c,b){return this.add(a,c,(b*-1));},before:function(c,b){var a=b.getTime();if(c.getTime()<a){return true;}else{return false;}},after:function(c,b){var a=b.getTime();if(c.getTime()>a){return true;}else{return false;}},between:function(b,a,c){if(this.after(b,a)&&this.before(b,c)){return true;}else{return false;}},getJan1:function(a){return this.getDate(a,0,1);},getDayOffset:function(b,d){var c=this.getJan1(d);var a=Math.ceil((b.getTime()-c.getTime())/this.ONE_DAY_MS);return a;},getWeekNumber:function(d,b,g){b=b||0;g=g||this.WEEK_ONE_JAN_DATE;var h=this.clearTime(d),l,m;if(h.getDay()===b){l=h;}else{l=this.getFirstDayOfWeek(h,b);}var i=l.getFullYear();m=new Date(l.getTime()+6*this.ONE_DAY_MS);var f;if(i!==m.getFullYear()&&m.getDate()>=g){f=1;}else{var e=this.clearTime(this.getDate(i,0,g)),a=this.getFirstDayOfWeek(e,b);var j=Math.round((h.getTime()-a.getTime())/this.ONE_DAY_MS);var k=j%7;var c=(j-k)/7;f=c+1;}return f;},getFirstDayOfWeek:function(d,a){a=a||0;var b=d.getDay(),c=(b-a+7)%7;return this.subtract(d,this.DAY,c);},isYearOverlapWeek:function(a){var c=false;var b=this.add(a,this.DAY,6);if(b.getFullYear()!=a.getFullYear()){c=true;}return c;},isMonthOverlapWeek:function(a){var c=false;var b=this.add(a,this.DAY,6);if(b.getMonth()!=a.getMonth()){c=true;}return c;},findMonthStart:function(a){var b=this.getDate(a.getFullYear(),a.getMonth(),1);return b;},findMonthEnd:function(b){var d=this.findMonthStart(b);var c=this.add(d,this.MONTH,1);var a=this.subtract(c,this.DAY,1);return a;},clearTime:function(a){a.setHours(12,0,0,0);return a;},getDate:function(e,a,c){var b=null;if(YAHOO.lang.isUndefined(c)){c=1;}if(e>=100){b=new Date(e,a,c);}else{b=new Date();b.setFullYear(e);b.setMonth(a);b.setDate(c);b.setHours(0,0,0,0);}return b;}};YAHOO.register("datemath",YAHOO.widget.DateMath,{version:"2.8.2r1",build:"7"});
}, '2.8.2' ,{"requires": ["yui2-yahoo"]});