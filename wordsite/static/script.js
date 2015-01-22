var globals = {
	SHUFFLE_EVERY_TIME: false,
	WORD_JUMP: 5,
	STATE_NOT_REVEALED: 0,
	STATE_CLUE: 1,
	STATE_REVEALED: 2,
	MAX_INCORRECTS: 6,
	blurRadius: 4,
	allWords: [],
	words: [],
	shuffledIndices: [],
	incorrectGuesses: [],
	correctGuesses: [],
	current: 0,
	state: 0,
	askIncorrectsCounter: 0,
};

$(function() {
	init();
});

//http://sedition.com/perl/javascript-fy.html
function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}

function getWordPair() {
	return globals.words[globals.shuffledIndices[globals.current]];
}

function init() {
	$("#reveal").click(reveal);
	$("#clue").click(clue);
	$("#correct").click(setCorrect);
	$("#incorrect").click(setIncorrect);
	
	var wordStr = $("#words").text();
	var wordPairs = wordStr.split("\n");
	$.each(wordPairs, function(index, value) {
		var wordPair = value.split(/\t+/);
		var temp = wordPair[0];
		wordPair[0] = wordPair[1];
		wordPair[1] = temp;
		globals.words.push(wordPair);
	});
	globals.allWords = globals.words.slice(0);
	if (globals.words.length > 0) {
		startGame();
	} else {
		alert("No words!");
	}
}

function startGame() {
	globals.words = globals.allWords.slice(0);
	var guesses = globals.correctGuesses.slice(0);
	if (globals.current != globals.words.length && globals.SHUFFLE_EVERY_TIME) {
		for (var i = 0; i < guesses.length; i++) {
			globals.words.splice(guesses[i], 1);
			for (var j = 0; j < guesses.length; j++) {
				if (guesses[j] > guesses[j+1]) {
					guesses[j]--;
				}
			}
		}
	} else {
		globals.correctGuesses = [];
	}
	
	var indices = [];
	for (var i = 0; i < globals.words.length; i++) {
		indices.push(i);
	}
	globals.shuffledIndices = indices.slice(0);
	fisherYates(globals.shuffledIndices);
	
	globals.current = 0;
	nextWord();
}

function startNewTry() {
	var jumpAmount = Math.min(globals.words.length - globals.current - 1, globals.WORD_JUMP + globals.incorrectsInRow-1);
	var temp = globals.shuffledIndices[globals.current];
	globals.shuffledIndices[globals.current] = globals.shuffledIndices[globals.current + jumpAmount];
	globals.shuffledIndices[globals.current + jumpAmount] = temp;
	
	nextWord();
}

function nextWord() {
	if (!globals.SHUFFLE_EVERY_TIME) {
		if (globals.askIncorrectsCounter == globals.WORD_JUMP || globals.incorrectGuesses.length == globals.MAX_INCORRECTS || globals.current == globals.shuffledIndices.length) {
			var args = [globals.current+1, 0].concat(globals.incorrectGuesses);
			globals.shuffledIndices.splice.apply(globals.shuffledIndices, args);
			globals.incorrectGuesses = [];
			globals.askIncorrectsCounter = 0;
		}
	}
		
	$("#unknownDiv").stop();
	$("#unknownDiv").css("opacity", "0");
	
	$("#score h3").text( Math.min(globals.words.length, globals.correctGuesses.length+1).toString() + " / " + globals.allWords.length.toString() );
	if (globals.current == globals.shuffledIndices.length) {
		alert("Finished! Starting again");
		startGame();
	}
	globals.state = globals.STATE_NOT_REVEALED;
	$("#afterReveal").hide();
	$("#beforeReveal").show();
	$("#known").text( getWordPair()[0] );
	$("#unknown").text( getWordPair()[1] );
}

function isRevealed() {
	return globals.state == globals.STATE_REVEALED;
}

function isClue() {
	return globals.state == globals.STATE_CLUE;
}

function reveal() {
	if (!isRevealed()) {
		if (!isClue()) {
			$("#beforeReveal").hide();
			$("#afterReveal").show();
			$("#unknownDiv").fadeTo(1000, 1);
		} else {
			$("#beforeReveal").hide();
			$("#afterReveal").show();
			$({blurRadius: globals.blurRadius}).animate({blurRadius: 0}, {
				duration: 500,
				easing: 'swing', // or "linear"
								 // use jQuery UI or Easing plugin for more options
				step: function() {
					$('#unknownDiv').css({
						"-webkit-filter": "blur("+this.blurRadius+"px)",
						"filter": "blur("+this.blurRadius+"px)"
					});
				}
			});
		}
	}
	globals.state = globals.STATE_REVEALED;
}

function clue() {
	var unknown = $("#unknownDiv");
	var blur = globals.blurRadius.toString() + "px";
	unknown.css({'filter': 'blur('+blur+')','-webkit-filter': 'blur('+blur+')','-moz-filter': 'blur('+blur+')','-o-filter': 'blur('+blur+')','-ms-filter': 'blur('+blur+')'});
	unknown.fadeTo(1000, 1);
	globals.state = globals.STATE_CLUE;
}

function setCorrect() {
	if (isRevealed) {
		$("body").stop().animate({
		backgroundColor: '#99FF99'
		}, 100)
		.animate({
			backgroundColor: '#FFFFFF'
		}, 500);
		globals.correctGuesses.push(globals.current);
		globals.askIncorrectsCounter++;
		globals.current++;
		nextWord();
	}
}

function setIncorrect() {
	if (isRevealed) {
		var idx = globals.incorrectGuesses.length;
		if (idx > 3 && Math.random() < 0.6) {
			idx -= Math.floor(Math.random() * 2) + 1;
		}
		globals.incorrectGuesses.splice(idx, 0, globals.shuffledIndices[globals.current]);
		globals.current++;
		$("body").stop().animate({
		backgroundColor: '#FF1111'
		}, 100)
		.animate({
			backgroundColor: '#FFFFFF'
		}, 500);
		if (globals.SHUFFLE_EVERY_TIME) {
			startGame();
		} else {
			nextWord();
		}
	}
}
