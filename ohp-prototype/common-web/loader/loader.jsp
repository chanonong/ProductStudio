<%@ page session="false" contentType="application/javascript; charset=utf-8" pageEncoding="ISO-8859-1" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
/*global YAHOO*/

(function() {
	'use strict';
	
	var loader = new YAHOO.util.YUILoader({
		allowRollup: true,
		base: '${yui2Context}/'
	});

	<c:forEach var="clientResource" items="${clientResources}">
	loader.addModule({
		name: '${clientResource.name}',
		fullpath: '${clientResource.path}',
		type: '${clientResource.type}',
		requires: ${clientResource.requires}
	});
	</c:forEach>

	YAHOO.namespace('ORCHESTRAL', 'ORCHESTRAL.util');
	
	ORCHESTRAL.util.Loader = function() {
	};
	

	ORCHESTRAL.util.Loader.load = function(modules, callback) {
		loader.require(modules);

		loader.insert({
			onSuccess: callback,
			
			onFailure: function(msg, xhrobj) {
				 var m = "LOAD FAILED: " + msg;
		
		        // if the failure was from the Connection Manager, the object
       			 // returned by that utility will be provided.
        		if (xhrobj) {
            		m += ", " + YAHOO.lang.dump(xhrobj);
       		 	}
        
        		YAHOO.log(m);
			}
		});
	};
	
	ORCHESTRAL.use = ORCHESTRAL.util.Loader.load;
	
	YAHOO.register('orchestral-loader', ORCHESTRAL.util.Loader, {version: '6.9', build: '0'});
}())
