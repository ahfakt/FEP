$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

var dc = {};

var homeHtml = "snippets/home-snippet.html";

dc.loadCategories = function(url) {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(url+".json", buildAndShowCategories);
};
function buildAndShowCategories(categories) {
	var titleHtml = categories.snippet+"-title.html";
	var contentHtml = categories.snippet+".html"
	$ajaxUtils.sendGetRequest(titleHtml,
		function (titleHtml) {
			$ajaxUtils.sendGetRequest(contentHtml,
				function (contentHtml) {
					//switchMenuToActive();
					insertHtml("#main-content", buildCategoriesView(categories, titleHtml, contentHtml));
				},
				false);
			},
			false);
}
function buildCategoriesView(categories, titleHtml, contentHtml) {

  var finalHtml = titleHtml;
  finalHtml = insertProperty(finalHtml, "title", categories.title);
  finalHtml = insertProperty(finalHtml, "description", categories.description);
  finalHtml += "<section class='row'>";

	var width = Math.ceil(Math.sqrt(categories.content.length));
	var wmd = Math.min(4, width);//medium gorunumde en fazla 4 tane sigmali
        var wsm = Math.min(3, width);//small gorunumde en fazla 3 tane sigmali
        var wxs = Math.min(2, width);//xsmall gorunumde en fazla 2 tane sigmali
  // Loop over categories
  for (var i = 0; i < categories.content.length; i++) {
    // Insert category values
    var html = contentHtml;
    var name = "" + categories.content[i].name;
    var short_name = categories.content[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);

    html = insertProperty(html, "type", categories.content[i].type);
    html = insertProperty(html, "url", categories.content[i].url);

	//arta kalan sonuncu satir icin yeniden duzenleme
    html = insertProperty(html, "md", (categories.content.length - i <= categories.content.length % wmd) ? 12/(categories.content.length%wmd):12/wmd);
    html = insertProperty(html, "sm", (categories.content.length - i <= categories.content.length % wsm) ? 12/(categories.content.length%wsm):12/wsm);
    html = insertProperty(html, "xs", (categories.content.length - i <= categories.content.length % wxs) ? 12/(categories.content.length%wxs):12/wxs);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

dc.loadItems = function(url) {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(url+".json", buildAndShowItems);
};
function buildAndShowItems (items) {
	var titleHtml = items.snippet+"-title.html";
	var contentHtml = items.snippet+".html"
	$ajaxUtils.sendGetRequest(titleHtml,
		function (titleHtml) {
			$ajaxUtils.sendGetRequest(contentHtml,
				function (contentHtml) {
					//switchMenuToActive();
					insertHtml("#main-content", buildItemsView(items, titleHtml, contentHtml));
				},
				false);
			},
			false);
}
function buildItemsView(items, titleHtml, contentHtml) {

  var finalHtml = titleHtml;
  finalHtml = insertProperty(finalHtml, "title", items.title);
  finalHtml = insertProperty(finalHtml, "description", items.description);
  finalHtml += "<section class='row'><table><tbody>";

  for(var i = 0; i < items.content.length; i++) {
	  var html = contentHtml;
	  for(var j = 0; j < items.content[i].length; j++) {
        	html = insertProperty(html, "i"+j.toString(), items.content[i][j]);
          }
	  finalHtml += html;
  }
  finalHtml += "</tbody></table></section>";
  return finalHtml;
}

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}
/*
// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navPersonelButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navPersonelButton").className = classes;
  }
  classes = document.querySelector("#navEgitimButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navEgitimButton").className = classes;
  }
};*/

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});


global.$dc = dc;

})(window);
