/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("arraylist-add",function(e,t){e.mix(e.ArrayList.prototype,{add:function(t,n){var r=this._items;return e.Lang.isNumber(n)?r.splice(n,0,t):r.push(t),this},remove:function(e,t,n){n=n||this.itemsAreEqual;for(var r=this._items.length-1;r>=0;--r)if(n.call(this,e,this.item(r))){this._items.splice(r,1);if(!t)break}return this},itemsAreEqual:function(e,t){return e===t}})},"3.17.2",{requires:["arraylist"]});