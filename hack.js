var _debug = false,
    _blink = null,
    _input = new Array(),
    _history = new Array(),
    _userText = '[goat@remotehost ~]$ ';

window.onload = function () {
  addEventListener('keydown', keyDown);
  addEventListener('keyup', keyUp);
  addEventListener('keypress', keyPress);

  // Initialize positions of input line, cursor, history, and caret
  $('#input').insertBefore( $('#cursor') );
  $('#history').insertBefore( $('#input') );
  $('#caret').insertBefore( $('#input') );
  $('#caret').text( _userText );

  // Begin blinking interval for cursor
  $('#cursor').css( 'visibility', 'visible' );
  _blink = window.setInterval( toggleVisibility, 1000 );
}

function toggleVisibility () {
  // DEBUG: SHOW STATUS OF CURSOR
  if ( _debug )
    console.log( $('#cursor').css( 'visibility' ) );

  // If visible make hidden, if hidden make visible
  if ( $('#cursor').css( 'visibility' ) == 'visible' )
    $('#cursor').css( 'visibility', 'hidden' );
  else
    $('#cursor').css( 'visibility', 'visible' );
}

function keyDown (e) {
  var _key = e.charCode || e.keyCode;

  // Detect backspace and delete characters from input line
  if ( _key == 8 ) {
    if ( _input.length > 0 ) {
      _input[_input.length-1].remove();
      _input.pop();
    }
  }

  // Don't process the enter key twice in case of FireFox
  if ( _key == 13 ) { }
}

function keyUp (e) {
  // Prevent default behaviour of keypresses
  try {
    e.preventDefault();
  }
  catch ( err ) { }
}

function keyPress (e) {
  var _key = e.charCode || e.keyCode;

  // DEBUG: SHOW KEYCODE
  if ( _debug )
    console.log( _key );

  // Enter key pressed, process command
  if ( _key == 13 ) {
    // Add command to history above the input line
    $('#history').append( _userText );
    $('#history').append( $('#input').text() );
    $('#history').append( '<br>' );
    $('#history').insertBefore( $('#input') );
    _history.push( _input.join('') );

    var command = $('#input').text();

    // Process the command
    if ( command == 'exit' )
      window.close();
    else {
      $('#history').append( commandHelper( command ) );
      $('#history').insertBefore( $('#input') );
    }

    // Reset input line
    $('#input').text( '' );
    $('#caret').insertBefore( $('#input') );
    $('#caret').text( _userText );

    // DEBUG: SHOW COMMAND
    if ( _debug )
      console.log( command );
  }

  // Characters written to input line
  else {
    var _char = '';
    if ( _char == '' ) _char = $( '<span>'+String.fromCharCode(_key)+'</span>' );

    $('#input').append( _char );
    _input.push( _char );
    $('#input').insertBefore( $('#cursor') );
  }

  // Prevent default behaviour of keypresses
  try {
    e.preventDefault();
  }
  catch ( err ) { }
}

function help() {
  return  'HELP - Print this help prompt'+
          '<br>';
}

function exit() {
  window.close();
  return 'Attempting to exit';
}

function commandHelper (command) {
  try {
    // DEBUG: SHOW COMMAND BEING TRIED
    if( _debug )
      console.log( 'trying: '+command );
    return this[command]();
  }
  catch ( err ) {
    // DEBUG: SHOW COMMAND ERROR
    if ( _debug )
      console.log( err );
  }
}
