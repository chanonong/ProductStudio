/*!
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
(function(){var c=YAHOO.util.Dom,i=YAHOO.lang,y="yui-pb",A=y+"-mask",x=y+"-bar",w=y+"-anim",n=y+"-tl",l=y+"-tr",k=y+"-bl",g=y+"-br",h="width",t="height",m="minValue",v="maxValue",j="value",a="anim",u="direction",e="ltr",q="rtl",D="ttb",p="btt",f="barEl",d="maskEl",s="ariaTextTemplate",z="start",C="progress",r="complete";var o=function(b){o.superclass.constructor.call(this,document.createElement("div"),b);this._init(b)};YAHOO.widget.ProgressBar=o;o.MARKUP=['<div class="',x,'"></div><div class="',A,'"><div class="',n,'"></div><div class="',l,'"></div><div class="',k,'"></div><div class="',g,'"></div></div>'].join("");i.extend(o,YAHOO.util.Element,{_init:function(b){},initAttributes:function(F){o.superclass.initAttributes.call(this,F);this.set("innerHTML",o.MARKUP);this.addClass(y);var E,b=["id",h,t,"class","style"];while((E=b.pop())){if(E in F){this.set(E,F[E])}}this.setAttributeConfig(f,{readOnly:true,value:this.getElementsByClassName(x)[0]});this.setAttributeConfig(d,{readOnly:true,value:this.getElementsByClassName(A)[0]});this.setAttributeConfig(u,{value:e,validator:function(G){if(this._rendered){return false}switch(G){case e:case q:case D:case p:return true;default:return false}},method:function(G){this._barSizeFunction=this._barSizeFunctions[this.get(a)?1:0][G]}});this.setAttributeConfig(v,{value:100,validator:i.isNumber,method:function(G){this.get("element").setAttribute("aria-valuemax",G);if(this.get(j)>G){this.set(j,G)}}});this.setAttributeConfig(m,{value:0,validator:i.isNumber,method:function(G){this.get("element").setAttribute("aria-valuemin",G);if(this.get(j)<G){this.set(j,G)}}});this.setAttributeConfig(h,{getter:function(){return this.getStyle(h)},method:this._widthChange});this.setAttributeConfig(t,{getter:function(){return this.getStyle(t)},method:this._heightChange});this.setAttributeConfig(s,{value:"{value}"});this.setAttributeConfig(j,{value:0,validator:function(G){return i.isNumber(G)&&G>=this.get(m)&&G<=this.get(v)},method:this._valueChange});this.setAttributeConfig(a,{validator:function(G){return !!YAHOO.util.Anim},setter:this._animSetter})},render:function(E,F){if(this._rendered){return}this._rendered=true;var G=this.get(u);this.addClass(y);this.addClass(y+"-"+G);var b=this.get("element");b.tabIndex=0;b.setAttribute("role","progressbar");b.setAttribute("aria-valuemin",this.get(m));b.setAttribute("aria-valuemax",this.get(v));this.appendTo(E,F);this._barSizeFunction=this._barSizeFunctions[0][G];this.redraw();this._previousValue=this.get(j);this._fixEdges();if(this.get(a)){this._barSizeFunction=this._barSizeFunctions[1][G]}this.on("minValueChange",this.redraw);this.on("maxValueChange",this.redraw);return this},redraw:function(){this._recalculateConstants();this._valueChange(this.get(j))},destroy:function(){this.set(a,false);this.unsubscribeAll();var b=this.get("element");if(b.parentNode){b.parentNode.removeChild(b)}},_previousValue:0,_barSpace:100,_barFactor:1,_rendered:false,_barSizeFunction:null,_heightChange:function(b){if(i.isNumber(b)){b+="px"}this.setStyle(t,b);this._fixEdges();this.redraw()},_widthChange:function(b){if(i.isNumber(b)){b+="px"}this.setStyle(h,b);this._fixEdges();this.redraw()},_fixEdges:function(){if(!this._rendered||YAHOO.env.ua.ie||YAHOO.env.ua.gecko){return}var G=this.get(d),I=c.getElementsByClassName(n,undefined,G)[0],F=c.getElementsByClassName(l,undefined,G)[0],H=c.getElementsByClassName(k,undefined,G)[0],E=c.getElementsByClassName(g,undefined,G)[0],b=(parseInt(c.getStyle(G,t),10)-parseInt(c.getStyle(I,t),10))+"px";c.setStyle(H,t,b);c.setStyle(E,t,b);b=(parseInt(c.getStyle(G,h),10)-parseInt(c.getStyle(I,h),10))+"px";c.setStyle(F,h,b);c.setStyle(E,h,b)},_recalculateConstants:function(){var b=this.get(f);switch(this.get(u)){case e:case q:this._barSpace=parseInt(this.get(h),10)-(parseInt(c.getStyle(b,"marginLeft"),10)||0)-(parseInt(c.getStyle(b,"marginRight"),10)||0);break;case D:case p:this._barSpace=parseInt(this.get(t),10)-(parseInt(c.getStyle(b,"marginTop"),10)||0)-(parseInt(c.getStyle(b,"marginBottom"),10)||0);break}this._barFactor=this._barSpace/(this.get(v)-(this.get(m)||0))||1},_animSetter:function(G){var F,b=this.get(f);if(G){if(G instanceof YAHOO.util.Anim){F=G}else{F=new YAHOO.util.Anim(b)}F.onTween.subscribe(this._animOnTween,this,true);F.onComplete.subscribe(this._animComplete,this,true);var H=F.setAttribute,E=this;switch(this.get(u)){case p:F.setAttribute=function(I,K,J){K=Math.round(K);H.call(this,I,K,J);c.setStyle(b,"top",(E._barSpace-K)+"px")};break;case q:F.setAttribute=function(I,K,J){K=Math.round(K);H.call(this,I,K,J);c.setStyle(b,"left",(E._barSpace-K)+"px")};break}}else{F=this.get(a);if(F){F.onTween.unsubscribeAll();F.onComplete.unsubscribeAll()}F=null}this._barSizeFunction=this._barSizeFunctions[F?1:0][this.get(u)];return F},_animComplete:function(){var b=this.get(j);this._previousValue=b;this.fireEvent(C,b);this.fireEvent(r,b);c.removeClass(this.get(f),w)},_animOnTween:function(b,E){var F=Math.floor(this._tweenFactor*E[0].currentFrame+this._previousValue);this.fireEvent(C,F)},_valueChange:function(G){var F=this.get(a),b=Math.floor((G-this.get(m))*this._barFactor),E=this.get(f);this._setAriaText(G);if(this._rendered){if(F){F.stop();if(F.isAnimated()){F._onComplete.fire()}}this.fireEvent(z,this._previousValue);this._barSizeFunction(G,b,E,F)}},_setAriaText:function(E){var b=this.get("element"),F=i.substitute(this.get(s),{value:E,minValue:this.get(m),maxValue:this.get(v)});b.setAttribute("aria-valuenow",E);b.setAttribute("aria-valuetext",F)}});var B=[{},{}];o.prototype._barSizeFunctions=B;B[0][e]=function(G,b,E,F){c.setStyle(E,h,b+"px");this.fireEvent(C,G);this.fireEvent(r,G)};B[0][q]=function(G,b,E,F){c.setStyle(E,h,b+"px");c.setStyle(E,"left",(this._barSpace-b)+"px");this.fireEvent(C,G);this.fireEvent(r,G)};B[0][D]=function(G,b,E,F){c.setStyle(E,t,b+"px");this.fireEvent(C,G);this.fireEvent(r,G)};B[0][p]=function(G,b,E,F){c.setStyle(E,t,b+"px");c.setStyle(E,"top",(this._barSpace-b)+"px");this.fireEvent(C,G);this.fireEvent(r,G)};B[1][e]=function(G,b,E,F){c.addClass(E,w);this._tweenFactor=(G-this._previousValue)/F.totalFrames/F.duration;F.attributes={width:{to:b}};F.animate()};B[1][q]=B[1][e];B[1][D]=function(G,b,E,F){c.addClass(E,w);this._tweenFactor=(G-this._previousValue)/F.totalFrames/F.duration;F.attributes={height:{to:b}};F.animate()};B[1][p]=B[1][D]})();YAHOO.register("progressbar",YAHOO.widget.ProgressBar,{version:"2.8.2r1",build:"7"});