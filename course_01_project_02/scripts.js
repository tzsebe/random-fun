// Global vars

var ENTRY_CLASS = "sortable-entry";
var ENTRY_PREFIX = "sortval";
var SORT_HIGHLIGHTED_CLASS = "sort-highlighted";
var SORT_COMPLETE_CLASS = "sort-complete";
var EXECUTION_MSG_ID = "execution-msg";
var ANIM_STEP_INTERVAL = 1000;
var ANIM_COMPLETED_INTERVAL = 2000;

// This represents the full state of our sort. Everything we write out to the inputs
// is just a copy of what's in here. This way, people messing with the inputs won't
// cause problems while our animation is running.
var sortState = [];

/**
 * Used to validate that we're only accepting numerical
 * values in the sortable input.
 */
function validateNumeric(charCode) {
    return charCode >= 48 && charCode <= 57;
}

/**
 * Figure out how many entries we're sorting (in case we want to change it).
 */
function findNumElements() {
    return $('.' + ENTRY_CLASS).length;
}

/**
 * Get a sortval element.
 */
function getSortVal(id) {
    return $("#" + ENTRY_PREFIX + id);
}

/**
 * Read the value from one of our inputs.
 *
 * If an element is missing, just assume it's zero.
 * Assume anything that's read in is numeric. While we do ensure
 * that's the case on the inputs, this kind of assumption is 
 * bad practice in real life.
 */
function readSortVal(id) {
    var raw = getSortVal(id).val();
    if (raw) {
        return parseInt(raw);
    }

    return 0;
}

/**
 * Write a value to our webpage input.
 */
function writeSortVal(id, value) {
    getSortVal(id).val(value);
}

/**
 * Highlight one of the sortval inputs.
 */
function highlightSortVal(id) {
    getSortVal(id).addClass(SORT_HIGHLIGHTED_CLASS);
}

/**
 * Un-highlight one of the sortval inputs.
 */
function unHighlightSortVal(id) {
    getSortVal(id).removeClass(SORT_HIGHLIGHTED_CLASS);
}

/**
 * Make a message appear and disappear in a smoothly-animated fashion.
 */
function sendExecutionMsg(msg, color, duration) {
    $('#' + EXECUTION_MSG_ID)
        .html(msg)
        .css({color: color})
        .animate({opacity: 1}, duration/2)
        .animate({opacity: 0}, duration/2);
}

/**
 * Fun "victory" animation to show that we've successfully
 * completed our sort.
 */
function highlightCompleted() {
    var n = findNumElements();

    // Display "done" message.
    sendExecutionMsg("Done!", "green", ANIM_COMPLETED_INTERVAL);

    // First, highlight everything
    for (var i = 0; i < n; ++i) {
        getSortVal(i).addClass(SORT_COMPLETE_CLASS);
    }

    // Now, unhighlight everything after a second
    window.setTimeout(function() {
        for (var i = 0; i < n; ++i) {
            getSortVal(i).removeClass(SORT_COMPLETE_CLASS);
        }
    }, ANIM_COMPLETED_INTERVAL);
}

/**
 * Read whatever is in the text boxes and set our sortState.
 */
function resetState() {
    var n = findNumElements();
    sortState = new Array(n);
    for (var i = 0; i < n; ++i) {
        sortState[i] = readSortVal(i);
    }
}

/**
 * Fill in our array with values between 0 and 99.
 */
function randomizeInput() {
    var n = findNumElements();
    for (var i = 0; i < n; ++i) {
        var val = Math.floor(Math.random() * 100);
        writeSortVal(i, val);
    }
}

/**
 * Write sort state to fields.
 */
function writeSortState() {
    var n = findNumElements();
    for (var i = 0; i < n; ++i) {
        writeSortVal(i, sortState[i]);
    }
}

/**
 * Entry Point: Kick off the bubble sort animation.
 *
 * Note that since this is a fancy animation, we can't just write our code
 * to look like the pseudo-code in the html content. Instead, we have to
 * split out each iteration, and insert time delays, for visibility into
 * what's actually going on.
 */
function runBubbleSort() {
    // Read in the values and set everything back the way it was.
    resetState();

    // Run our bubble-sort!
    var n = findNumElements();
    bubbleSortIteration(n);
}

/**
 * Check if we're sorted up until element n.
 */
function isSorted(n) {
    for (var i = 0; i < n-1; ++i) {
        // If the current element is greater than the next,
        // then we are not sorted.
        if (sortState[i] > sortState[i+1]) {
            return false;
        }
    }

    // Sorted!
    return true;
}

function bubbleSortIteration(numUnsorted) {
    // check if it's actually sorted, and terminate if it is.
    if (isSorted(numUnsorted)) {
        // We're done! highlight our awesomeness, and move on!
        highlightCompleted();
    } else {
        // Actually do work.
        bubbleSortExecutionStep(0, numUnsorted);
    }
}

/**
 * A lot of the animation happens here. What we want it to look like:
 *
 * Each of these happens in an animation frame. We put together this sequence
 * by using setInterval and anonymous functions.
 *
 * 1) Highlight the pair of elements we're looking at
 * 2) If they need to be swapped, swap them
 * 3) Unhighlight the pair of elements, and move on to the next step.
 *
 * Then, at the end of the iteration, call back into bubbleSortIteration to start it again.
 */
function bubbleSortExecutionStep(currentLocation, numUnsorted) {
    if (currentLocation >= numUnsorted - 1) {
        // This iteration is done. Go back and do the next one.
        bubbleSortIteration(numUnsorted - 1);
    } else {
        // Handle the current step of this iteration.
        highlightSortVal(currentLocation);
        highlightSortVal(currentLocation+1);

        window.setTimeout(function() {
            // Swap if needed
            if (sortState[currentLocation] > sortState[currentLocation+1]) {
                var tmp = sortState[currentLocation];
                sortState[currentLocation] = sortState[currentLocation+1];
                sortState[currentLocation+1] = tmp;
                sendExecutionMsg("swap!", "red", ANIM_STEP_INTERVAL);
                writeSortState();
            }

            // Kick off the next step
            window.setTimeout(function() {
                unHighlightSortVal(currentLocation);
                unHighlightSortVal(currentLocation+1);
                bubbleSortExecutionStep(currentLocation+1, numUnsorted);
            }, ANIM_STEP_INTERVAL);
        }, ANIM_STEP_INTERVAL);
    }
}
