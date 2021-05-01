window.addLinesUnderHeaders = function(show) {

  var headers = $('h2');
  headers.each(function() {
    var horizontalLine = $("<hr>");
    $(this).after(horizontalLine);
  });

  var headers = $('h3');
  headers.each(function() {
    var horizontalLine = $("<hr>");
    $(this).after(horizontalLine);
  });

  var headers = $('h4');
  headers.each(function() {
    var horizontalLine = $("<hr>");
    $(this).after(horizontalLine);
  });

};

$(document).ready(function () {
  window.addLinesUnderHeaders();
});
