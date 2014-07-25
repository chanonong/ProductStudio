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
YUI.add("cow-activity-syncer",function(e,t){"use strict";function u(e){n.addEventListener?n.addEventListener("storage",e,!1):r.attachEvent&&r.attachEvent("onstorage",e)}function a(e){n.removeEventListener?n.removeEventListener("storage",e,!1):r.detachEvent&&r.detachEvent("onstorage",e)}var n=e.config.win,r=e.config.doc,i={setItem:function(){},removeItem:function(){},getItem:function(){return null}},s=e.config.win.Modernizr.localstorage?e.config.win.localStorage:i,o;o=function(e){this._storageKey=e,this._listeners={},this._lastModifiedTime=null},o.prototype.broadcast=function(t){var n={payload:t||{},timestamp:e.Lang.now()};s.setItem(this._storageKey,e.JSON.stringify(n))},o.prototype.get=function(){var e=this._getWrappedValue();return e&&e.payload},o.prototype._getWrappedValue=function(){return e.JSON.parse(s.getItem(this._storageKey))},o.prototype.clear=function(){s.removeItem(this._storageKey)},o.prototype.attachListener=function(t,n){var r=e.bind(function(e){var r=this._getWrappedValue()||{},i=r.timestamp;i&&i!==this._lastModifiedTime&&(t.call(n,{originalEvent:e,key:this._storageKey,value:this.get()}),this._lastModifiedTime=i)},this);this._listeners[t]=r,u(r)},o.prototype.detachListener=function(e){a(this._listeners[e])},o.prototype.detachAllListeners=function(){for(var e in this._listeners)this._listeners.hasOwnProperty(e)&&this.detachListener(e)},e.namespace("COW").ActivitySyncer=o},"7.9.0",{requires:["json-stringify","json-parse"]});
