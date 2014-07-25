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
YUI.add("ohp-class-name-manager",function(e,t){"use strict";var n=function(){var t=e.Array(arguments);return{getClassName:function(){return e.ClassNameManager.getClassName.apply(e.ClassNameManager,t.concat(e.Array(arguments),!0))},create:function(){return n.apply(this,t.concat(e.Array(arguments)))}}};e.namespace("OHP.ClassNameManager").create=n},"7.9.0",{requires:["classnamemanager"]});
