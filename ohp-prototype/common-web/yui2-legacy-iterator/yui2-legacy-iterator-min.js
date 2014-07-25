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
YUI.add("yui2-legacy-iterator",function(e,t){
/*!(C) ORCHESTRAL*/
function s(e){this.index=0,e==null||typeof e=="undefined"?this.len=0:typeof e.length=="undefined"?(this.len=1,this.collection=new Array(1),this.collection[0]=e):(this.len=e.length,this.collection=e),this.hasNext=function(){return this.index<this.len},this.next=function(){return this.collection[this.index++]}}var n=e.YUI2,r=n.ORCHESTRAL;window.Iterator=s},"7.9.0");
