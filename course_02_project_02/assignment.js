
/**
 * Globally define all our templates.
 */
var navbarTemplate, breadcrumbTemplate, animalListDefaultTemplate, animalListTemplate, animalDetailsDefaultTemplate, animalDetailsTemplate; 

/**
 * Render a template given some data, and dump it into
 * a div of a specific id.
 */
function displayTemplate(template, data, contentId) {
    var html = template(data);
    $("#" + contentId).html(html);
}

/**
 * Compile and return a template.
 */
function compileTemplate(templateId) {
    var source = $("#" + templateId).html();
    return Handlebars.compile(source);
}

/**
 * Display all contents of the page, given the state (current category/animal) of the world.
 *
 * Note that categoryIdx and animalIdx can be null, which just represents "no selection."
 *
 * This is our main workhorse.
 */
function displayContent(categoryIdx, animalIdx) {
    //
    // Display the navbar
    //
    displayTemplate(navbarTemplate, animals_data, "main-navbar");
    var activeNavSelector = "#nav-item-" + (categoryIdx == null ? "home" : categoryIdx);
    $(activeNavSelector).addClass("active");

    //
    // Display breadcrumbs - always have a "home", and add category/animal as needed.
    //
    var crumbs = [{display: "Home"}];
    if (categoryIdx != null) {
        // We have a category, so add it.
        // The ""+ part is needed to turn it into a string, otherwise Handlebars '{{#if' doesn't see it.
        crumbs[crumbs.length] = {
            display: animals_data.category[categoryIdx].name,
            categoryIdx: ""+categoryIdx
        };
    }
    if (animalIdx != null) {
        // We have an animal, so add it.
        crumbs[crumbs.length] = {
            display: animals_data.category[categoryIdx].animals[animalIdx].name,
            categoryIdx: ""+categoryIdx,
            animalIdx: ""+animalIdx
        };
    }
    displayTemplate(breadcrumbTemplate, {crumb: crumbs}, "breadcrumb-placeholder");

    //
    // Display the animal list (given a category). If there is no category, display the default instead.
    //
    if (categoryIdx != null) {
        // We have a category, so display it.
        displayTemplate(animalListTemplate, animals_data.category[categoryIdx], "animal-list-placeholder");

        // Do something useful with the animal details.
        if (animalIdx != null) {
            // Set selected
            var activeAnimalSelector = "#animal-listing-" + animalIdx
            $(activeAnimalSelector).addClass("animal-listing-active");

            //
            // Display the animal details.
            //
            displayTemplate(animalDetailsTemplate, animals_data.category[categoryIdx].animals[animalIdx], "animal-details-placeholder");

            // Scroll to animal detail
            $('html, body').animate({
                scrollTop: $("#animal-details-placeholder").offset().top
            }, 500);
        } else {
            // Category, but no animal, so display default.
            displayTemplate(animalDetailsDefaultTemplate, {}, "animal-details-placeholder");
        }
        
    } else {
        // No category, display default.
        displayTemplate(animalListDefaultTemplate, {}, "animal-list-placeholder");
        $("#animal-details-placeholder").html("");
    }

    // Some magic-sauce: _EVERYTHING_ that can be clicked to change state
    // uses the exact same pattern, so just call it "clickable" and add a
    // click handler for all things with the clickable class.
    //
    // These elements are expected to have data-category-idx and/or data-animal-idx, as a way
    // to maintain "state". This function that we're in knows how to display things based on just
    // those two parameters.
    $(".clickable").click(function() {
        displayContent(
            $(this).data("category-idx"),
            $(this).data("animal-idx")
        );
    });
}

/**
 * Run this once, right after initial page load.
 */
$(document).ready(function() {
    // Compile all our templates
    navbarTemplate = compileTemplate("navbar-template");
    breadcrumbTemplate = compileTemplate("breadcrumb-template");
    animalListDefaultTemplate = compileTemplate("animal-list-default-template");
    animalListTemplate = compileTemplate("animal-list-template");
    animalDetailsDefaultTemplate = compileTemplate("animal-details-default-template");
    animalDetailsTemplate = compileTemplate("animal-details-template");

    // Fix the data a bit so we can have a nicer time generating the content.
    for (var categoryIdx = 0; categoryIdx < animals_data.category.length; ++categoryIdx) {
        // Make "category index" available even when not iterating categories
        animals_data.category[categoryIdx].categoryIdx = categoryIdx;

        // Make "images" available as an array so we don't have to duplicate code because of the silly "image1/image2" setup.
        for (var animalIdx = 0; animalIdx < animals_data.category[categoryIdx].animals.length; ++animalIdx) {
            animals_data.category[categoryIdx].animals[animalIdx].images = [
                animals_data.category[categoryIdx].animals[animalIdx].image1,
                animals_data.category[categoryIdx].animals[animalIdx].image2
            ];
        }
    }

    // Display everything with initial conditions.
    displayContent(null, null);
});
