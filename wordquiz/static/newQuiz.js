$(function() {
	init();
});


function init() {
	$("#switch").click(function() {
		var textArea = $("#id_wordSet");
		var text = textArea.val();
		var lines = text.split('\n');
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i].split(/\t+/);
			var temp = line[0];
			line[0] = line[1];
			line[1] = temp;
			lines[i] = line.join('\t');
		}
		text = lines.join('\n');
		textArea.val(text);
	});
	
	$('#wordSetForm').submit(function(event) {
		event.preventDefault();
		var form = $(this);
		var url = form.attr('action');
		
		var posting = $.post(url, { csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").attr("value"), wordSet: $("#id_wordSet").val() });
		posting.done(function (data) {
			var element = document.createElement('div');
			if (data.errors) {
				element.innerHTML = data.errors;
			} else {
				element.innerHTML = 'The quiz was succesfully created! You can access it using this link: <a href="'+data.link+'">' + data.link + '</a>'; 
			}
			var oldElem = $("#feedback");
			if (oldElem) {
				oldElem.remove();
			}
			element.setAttribute("id", "feedback");
			$("#wordSetForm").prepend(element);
		});
	});
}

// http://stackoverflow.com/a/6637396
$(document).delegate('#id_wordSet', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) {
    e.preventDefault();
    var start = $(this).get(0).selectionStart;
    var end = $(this).get(0).selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

    // put caret at right position again
    $(this).get(0).selectionStart =
    $(this).get(0).selectionEnd = start + 1;
  }
});