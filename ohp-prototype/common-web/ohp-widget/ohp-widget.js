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
YUI.add('ohp-widget', function (Y, NAME) {

var BaseWidget = Y.Base.create('widget', Y.Widget, [Y.WidgetStdMod] );
BaseWidget.NAME = 'ohp-widget';
Y.namespace('OHP').Widget = BaseWidget;


}, '7.9.0', {"requires": ["widget-stdmod", "base", "widget"]});
