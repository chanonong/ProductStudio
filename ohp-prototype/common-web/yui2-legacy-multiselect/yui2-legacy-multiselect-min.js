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
YUI.add("yui2-legacy-multiselect",function(e,t){
/*!(C) ORCHESTRAL*/
function s(e,t,n){this.actualSelect=e,this.selectedItemsSelect=t,this.unselectedItemsSelect=n,this.selectedItemsSelect.className+=" Derived",this.unselectedItemsSelect.className+=" Derived",this.getActualOptions=function(){return new Iterator(this.actualSelect)},this.getSelectedItemsOptions=function(){return new Iterator(this.selectedItemsSelect)},this.selectItems=function(){this.resetShowSelected();for(var e=new Iterator(this.unselectedItemsSelect);e.hasNext();){var t=e.next();if(t.selected)for(var n=this.getActualOptions();n.hasNext();){var r=n.next();if(r.value==t.value){r.selected=!0,r.showSelected=!0;break}}}this.update()},this.unselectItems=function(){this.resetShowSelected();for(var e=this.getSelectedItemsOptions();e.hasNext();){var t=e.next();if(t.selected)for(var n=this.getActualOptions();n.hasNext();){var r=n.next();if(r.value==t.value){r.selected=!1,r.showSelected=!0;break}}}this.update()},this.update=function(){for(var e=0;e<this.selectedItemsSelect.length;)this.selectedItemsSelect.remove(this.selectedItemsSelect[e]);for(var e=0;e<this.unselectedItemsSelect.length;)this.unselectedItemsSelect.remove(this.unselectedItemsSelect[e]);for(var t=this.getActualOptions();t.hasNext();){var n=t.next(),r=n.cloneNode(!0);n.showSelected&&(r.selected=!0),n.selected?this.selectedItemsSelect.appendChild(r):this.unselectedItemsSelect.appendChild(r)}},this.resetShowSelected=function(){for(var e=this.getActualOptions();e.hasNext();)e.next().showSelected=!1},this.update();for(var r=this.getSelectedItemsOptions();r.hasNext();)r.next().defaultSelected=!0}var n=e.YUI2,r=n.ORCHESTRAL;window.MultiSelect=s},"7.9.0",{requires:["yui2-legacy-iterator"]});
