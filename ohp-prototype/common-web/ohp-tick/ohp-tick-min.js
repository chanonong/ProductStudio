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
YUI.add("ohp-tick",function(e,t){var n=0,r=new e.EventTarget;r.name="ohp-tick",r.publish("ohp:tick",{broadcast:2,emitFacade:!0}),r.publish("ohp:tick-5",{broadcast:2,emitFacade:!0}),r.publish("ohp:tick-10",{broadcast:2,emitFacade:!0}),r.publish("ohp:tick-30",{broadcast:2,emitFacade:!0}),r.publish("ohp:tick-60",{broadcast:2,emitFacade:!0}),e.later(1e3,this,function(){r.fire("ohp:tick"),n%5===0&&r.fire("ohp:tick-5"),n%10===0&&r.fire("ohp:tick-10"),n%30===0&&r.fire("ohp:tick-30"),n%60===0&&r.fire("ohp:tick-60"),n+=1},{},!0)},"7.9.0",{requires:["base","event-custom"]});
