<%@ page session="false" contentType="text/html; charset=utf-8" pageEncoding="ISO-8859-1" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<%
	final java.util.Locale locale = pageContext.getRequest().getLocale();
	final String lang = String.valueOf(locale).replace('_', '-');
	pageContext.setAttribute("lang", lang);
%>
<html lang="<c:out value="${lang}" />">
<head>
	<title>
		<fmt:message key="cow.unsupportedBrowser.title" var="title"/>
		<c:out value="${title}"/>
	</title>

	<%-- Minimum set of copied styles from hive --%>
	<style>
		body {
			margin: 0;
			padding: 9px 12px;
			font: 13px Arial,Helvetica,MingLiU,sans-serif;
		}
		p {
			margin: 0 0 6px;
			padding: 0;
		}
		a, a:visited {
			text-decoration: none;
			color: #0062ae;
		}
		a:hover {
			text-decoration: underline;
		}

		.information-notification {
			margin: 6px 0;
			border: 1px solid #0062ae;
			padding: 10px 10px 10px 44px;
			background: #d8e7f2 url("assets/skins/hive/icon-large/notification-information.png") no-repeat 10px center;
		}
	</style>

	<%-- Yes... I know... I'm sorry --%>
	<script>
		function showMoreInformation(event) {
			document.getElementById('ohp-more-information').style.display = 'block';
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		};
	</script>
</head>
<body>
	<div class="information-notification">
		<fmt:message key="cow.unsupportedBrowser.message.summary" var="summaryMessage"/>
		<c:out value="${summaryMessage}"/><br>

		<a href="#" onclick="showMoreInformation(event)">
			<fmt:message key="cow.unsupportedBrowser.action.moreInformation" var="moreInformationAction"/>
			<c:out value="${moreInformationAction}"/>
		</a>
	</div>
	<div id="ohp-more-information" style="display: none">
		<p>
			<fmt:message key="cow.unsupportedBrowser.message.moreInformation" var="moreInformationMessage"/>
			<c:out value="${moreInformationMessage}"/>
		</p>
		<c:if test="${not empty param.url}">
			<p>
				<fmt:message key="cow.unsupportedBrowser.message.accessedUrl" var="accessedUrlMessage">
					<fmt:param value="${param.url}" />
				</fmt:message>
				<c:out value="${accessedUrlMessage}"/>
			</p>
		</c:if>
	</div>
</body>
</html>
