
var x;
var y;

function searchBandsInTown(artist) {

    // Querying the bandsintown api for the selected artist
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events/" + "?app_id=test";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log("bands in town ajax call return: " + response)
        var venuesAvailable = response
        for (i = 0; i < venuesAvailable.length; i++) {
            var venueLat = venuesAvailable[i].venue.latitude;
            var venueLong = venuesAvailable[i].venue.longitude;
            var venueName = venuesAvailable[i].venue.city;
            var venueDisplayArea = $("<div>");
            var venueDisplay = $("<button>").html(venueName);
            venueDisplay.attr("class", "venuecityButton")
            // venueDisplay.attr("s", venueName)
            venueDisplay.attr("data-lat", venueLat)
            venueDisplay.attr("data-long", venueLong)
            venueDisplayArea.append(venueDisplay);
            $("#artist-div").append(venueDisplayArea)
        }




    });
}

$(document).on("click", ".venuecityButton", function () {
    x = $(this).attr("data-lat")
    y = $(this).attr("data-long")


    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/cities?lat=" + x + "&lon=" + y + "&count=1",
        method: "GET",
        headers: {
            "user-key": "488e32fe25c9ed9387b879aa94952c00"
        }

    }
    ).then(function (turtles) {
        // console.log("results of cities? "+turtles)
        cityId = turtles.location_suggestions[0].id;
        // cityID above variable logs the city ID of results form first ajax call
        // below the cityID is used to retrieve cusine data
        $.ajax({
            url: "https://developers.zomato.com/api/v2.1/cuisines?city_id=" + cityId,
            method: "GET",
            headers: {
                "user-key": "488e32fe25c9ed9387b879aa94952c00"
            }

        }).then(function (result) {
            var cusinesAvailable = result.cuisines;
            // console.log(cusinesAvailable);
            for (i = 0; i < cusinesAvailable.length; i++) {
                var cuisineName = cusinesAvailable[i].cuisine.cuisine_name;
                var cuisineDisplayArea = $("<div>");
                var cuisineDisplay = $("<button>").html(cuisineName);
                cuisineDisplay.attr("data-cuisine", cuisineName);
                cuisineDisplay.attr("class", "cuisineButton");
                cuisineDisplayArea.append(cuisineDisplay);
                $("#cuisine-div").append(cuisineDisplayArea);
            }

        });
        // 

    });
});

$(document).on("click", ".cuisineButton", function () {
    z = $(this).attr("data-cuisine")
    console.log(z);
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?lat=" + x + "&lon=" + y + "&cuisines=" + z,
        method: "GET",
        headers: {
            "user-key": "488e32fe25c9ed9387b879aa94952c00"
        }
    }).then(function (resultOfCusinePerCity) {
        $(".cuisineButton").hide();
        restaurantsAvaialble = resultOfCusinePerCity.restaurants;
        console.log(restaurantsAvaialble);
        for (i = 0; i < restaurantsAvaialble.length; i++) {
            var restaurantName = resultOfCusinePerCity.restaurants[i].restaurant.name;
            var restaurantSchedule = resultOfCusinePerCity.restaurants[i].restaurant.timings;
            var imgURL = resultOfCusinePerCity.restaurants[i].restaurant.featured_image;
            var menuURL = resultOfCusinePerCity.restaurants[i].restaurant.menu_url;
            var userRating = resultOfCusinePerCity.restaurants[i].restaurant.user_rating.aggregate_rating;
            var image = $("<img>").attr("src", imgURL);
            image.attr("height", "200px");
            var restaurantNameDisplay = $("<h1>").html(restaurantName);
            var restaurantScheduleDisplay = $("<p>").html(restaurantSchedule);
            var restaurantMenuButtonDisplay = $("<button onclick='doRedirect()'>").text(menuURL);
            var restaurantUserRating = $("<p>").html("RATING: " + userRating + " STARS");
            var restaurantDisplayArea = $("<div>");
            restaurantDisplayArea.append(restaurantNameDisplay);
            restaurantDisplayArea.append(image);
            restaurantDisplayArea.append(restaurantUserRating);
            restaurantDisplayArea.append(restaurantScheduleDisplay);
            restaurantDisplayArea.append(restaurantMenuButtonDisplay);
            $("#resturant-div").append(restaurantDisplayArea);
            function doRedirect() { location.replace(menuURL) }
        }
        // console.log(resultOfCusinePerCity.restaurants[0].restaurant.name);
    });


});



// Event handler for user clicking the select-artist button
$("#select-artist").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var inputArtist = $("#artist-input").val().trim();

    // Running the searchBandsInTown function(passing in the artist as an argument)
    searchBandsInTown(inputArtist);
});