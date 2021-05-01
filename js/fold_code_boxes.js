window.initializeCodeFolding = function(show) {

  // handlers for show-all and hide all
  $("#show-all-code").click(function() {
    $('div.code-collapse').each(function() {
      $(this).collapse('show');
    });
  });
  $("#hide-all-code").click(function() {
    $('div.code-collapse').each(function() {
      $(this).collapse('hide');
    });
  });

  var currentIndex = 1;

  var codeBlocks = $('pre');

  codeBlocks.each(function() {

    // create a collapsable div to wrap the code in
    var div = $('<div class="code-collapse collapse"></div>');
    if (show || $(this)[0].classList.contains('fold-show'))
      div.addClass('in');
    var id = 'foldable_code_' + currentIndex++;
    div.attr('id', id);
    $(this).before(div);
    $(this).detach().appendTo(div);
    id = id + '_code';
    div.attr('id', id);

    // add a show code button right above
    var showCodeText = $('<span>' + (show ? 'Hide' : 'Code') + '</span>');
    var showCodeButton = $('<button type="button" class="btn btn-default btn-xs code-folding-btn float-right"></button>');
    showCodeButton.append(showCodeText);
    showCodeButton
        .attr('data-toggle', 'collapse')
        .attr('data-target', '#' + id)
        .attr('aria-expanded', show)
        .attr('aria-controls', id);

    var buttonRow = $('<div class="row"></div>');
    var buttonCol = $('<div class="col-md-12"></div>');

    buttonCol.append(showCodeButton);
    buttonRow.append(buttonCol);

    div.before(buttonRow);

    // update state of button on show/hide
    div.on('hidden.bs.collapse', function () {
      showCodeText.text('Code');
    });
    div.on('show.bs.collapse', function () {
      showCodeText.text('Hide');
    });
  });

}

$(document).ready(function () {
  window.initializeCodeFolding("hide" === "show");
});
