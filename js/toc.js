$(function() {
  var navSelector = "#toc";
  var $myNav = $(navSelector);
  Toc.init({
    $nav: $("#toc"),
    $scope: $("h2,h3")
  });
  $("body").scrollspy({
    target: navSelector
  });
});