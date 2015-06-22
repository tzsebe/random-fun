// ==UserScript==
// @name         Color Test Auto-Cheater
// @namespace    
// @version      0.1
// @description  This cheats at the "color test" game that seems to have gone a little bit viral. Note that you must go to wVw, not www, to get around iframe security. Use "&desiredScore=<n>" in the URL to specify score. NOTE: I AM NOT A JS EXPERT!!! This is just random hackery.
// @author       Tamas Zsebe
// @match        http://wvw.igame.com/eye-test*
// @grant        none
// ==/UserScript==
function retrieveWinningDiv() {
    var frame = document.getElementsByTagName("iframe");
    if( ! frame ) {
        return null;
    }
    
    var winningDiv = frame[0].contentWindow.document.getElementsByClassName('thechosenone');
    
    if( ! winningDiv ) {
        return null;
    }
    
    return winningDiv[0];
}

var cheatsLeft;
var cheatIntervalId;
function highlightWinner() {
    if( cheatsLeft == 0 ) {
        // Stop processing.
        window.clearInterval(cheatIntervalId);
        
    } else {
        winner = retrieveWinningDiv()
        if( winner ) {
            winner.click();
            --cheatsLeft;
        }
    }
}

function extractDesiredScore() {
    var re = /desiredScore=([0-9]+)/;
    result = re.exec(location.search);
    if( result ) {
        return result[1];
    } else {
        return 10;
    }
}

function cheatify() {
    // Extract desired score
    cheatsLeft = extractDesiredScore();
    
    // Setup a timer that hits it once a second
    cheatIntervalId = window.setInterval(highlightWinner, 100);
}

setTimeout(cheatify, 2000);
