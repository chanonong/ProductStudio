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
function StringBuffer(){this.s=new Array,this.append=function(){var e=this.append.arguments;for(var t=0;t<e.length;t++)this.s[this.s.length]=e[t]},this.toString=function(){return this.s.join("")}}window.StringBuffer=StringBuffer
