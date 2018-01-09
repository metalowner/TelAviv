//property rendering function
function property(data) {
    //define property object attributes
    var self = this;
    this.title = data.title;
    this.type = data.type;
    this.location = data.location;
    this.price = data.price;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
    this.position = this.lat + ',' + this.lng;
    this.pictures = data.pictures;
    this.description = data.description;
    this.contact = '<h3>Contact</h3><br><span>Igale 054-3440022</span><br>' +
        '<span>Pavel 054-5544471</span><br><span>Email: telaviv@exclusive26.com</span><br>';
    this.descriptionInfo = '<h2>' + this.title + '</h2><hr><br>' +
        '<span><h3>Description</h3> ' + this.description + '</span><hr><br>' +
        '<img class="imgItem" src="images/' + this.pictures[0] + '" />' +
        '<img class="imgItem" src="images/' + this.pictures[1] + '" /><br>' +
        '<span>Price: ' + this.price + ' Ils / month</span><br>' +
        this.contact +
        '<h3 class="nearestRestaurants">Nearest Restaurants (Ordered by Foursquare API)</h3>';
    //define array of Foursquare data
    this.restaurants = ko.observableArray([]);
    //construct the Foursquare URL
    var foursquareRequest = 'https://api.foursquare.com/v2/venues/search' +
        '?client_id=0NZGCGSS4CE1B5TDRJLXIIGI5UN5K0TSSLBO3GT215JBUVMQ' +
        '&client_secret=SLAYSZONNPEMU2LQD0WCMUKXUXCB3QLCUEGCN1ATGDONUBMP' +
        '&ll=' + this.position + '&query=restaurant' + '&v=20160118';
    //Foursquare call
    $.getJSON(foursquareRequest).done(function(data) {
        //define returned Foursquare data attributes
        this.temRestaurants = data.response.venues;
        for (var i = 0; i < 5; i++) {
            var restaurantsArr = this.temRestaurants[i];
            this.name = restaurantsArr.name;
            this.address = restaurantsArr.location.formattedAddress;
            this.popularity = restaurantsArr.stats.checkinsCount;
            self.restaurants.push('<h4>' + this.name + '</h4><span>Popularity:<b> ' + this.popularity +
                ' visited here.</b></span><br><span>Address: ' + this.address + '</span><br>');
        }
        //update info window with Foursquare content
        descriptionWindow.setContent(self.descriptionInfo += self.restaurants.slice());
        //handle Foursquare error
    }).fail(function() {
        alert('Failed to reach Foursquare API :( Check your internet connection and try again :)');
    });
    //create new info window
    var descriptionWindow = new google.maps.InfoWindow({
        content: '<div class="descriptionWindow"' + self.descriptionInfo + '</div>',
        position: data.location
    });
    //create new marker
    this.marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: data.location
    });
    //define marker click event
    this.marker.addListener('click', function() {
        descriptionWindow.open(map, this.marker);
        self.markProperty();
    });
    //define marking function
    this.markProperty = function() {
        if (this.marker.getAnimation() !== null) {
            this.marker.setAnimation(null);
        } else {
            this.marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        descriptionWindow.open(map, this.marker);
    };
}
//define view model function
function viewModel() {
    var self = this;
    //define properties observable array
    self.properties = ko.observableArray([]);
    //define markers observable array
    self.markers = ko.observableArray([]);
    //create new Google Maps map
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {
            lat: 32.07426,
            lng: 34.767958
        },
        zoom: 14,
        mapTypeId: 'roadmap'
    });
    //create new Google Maps Bounds object
    var bounds = new google.maps.LatLngBounds();
    //render data and fill properties array with new rendered properties
    officeLocations.forEach(function(newProperty) {
        self.properties.push(new property(newProperty));
    });
    //define type filter and initial value
    self.typeDisplay = ko.observable("all");
    //define search filter and initial value
    self.searchTerm = ko.observable("");
    //define the displayed properties list
    self.filteredProperties = ko.computed(function() {
        var filterType = self.typeDisplay();
        var searchTerm = self.searchTerm().toLowerCase();
        //define temporary properties list
        var temporaryProperties = self.properties.slice();
        //in case the user wants to see everything
        if (filterType === "all") {
            //clear and hide search box
            self.searchTerm("");
            $('#searchInput').hide();
            //define filter function
            return temporaryProperties.filter(function(property) {
                if (property.type !== undefined) {
                    //display the marker
                    property.marker.setMap(map);
                    //fit the map bounds
                    map.fitBounds(bounds);
                }
                //show all properties as long as it's type is defined
                return property.type;
            });

        } else {
            //if the user wants to get specific, display search box
            $('#searchInput').show();

            return temporaryProperties.filter(function(property) {
                var title = property.title.toLowerCase();
                var endResult = title.search(searchTerm);
                //if type or search don't match the filters
                if (property.type !== filterType || endResult == -1) {
                    //hide the marker
                    property.marker.setMap(null);
                } else {
                    property.marker.setMap(map);
                    map.fitBounds(bounds);
                }
                //display properties that match both type and search input
                return property.type === filterType && endResult > -1;
            });
        }
    });
    //fill the markers observable array
    self.filteredProperties().forEach(function(property) {
        self.markers.push(property.marker);
    });
    //add each marker's position to the bounds viriable
    self.markers().forEach(function(marker) {
        bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
    //menu display function
    this.displayMenu = function() {
        if ($('#header').css('display') == 'none') {
            $('#header').css('display', 'block');
            map.fitBounds(bounds);
        } else {
            $('#header').css('display', 'none');
            map.fitBounds(bounds);
        }
    };
}
//start google maps as a new view model
function startView() {
    ko.applyBindings(new viewModel());
}
//handle Google maps error
function errorFunction() {
    alert('Google Maps failed to load :( Check your internet connection and try again :)');
}