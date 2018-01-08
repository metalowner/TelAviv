function property(data) {
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
	
	this.restaurants = ko.observableArray([]);

	var foursquareRequest = 'https://api.foursquare.com/v2/venues/search' +
		'?client_id=0NZGCGSS4CE1B5TDRJLXIIGI5UN5K0TSSLBO3GT215JBUVMQ' +
		'&client_secret=SLAYSZONNPEMU2LQD0WCMUKXUXCB3QLCUEGCN1ATGDONUBMP' +
		'&ll=' + this.position + '&query=restaurant' + '&v=20160118';

	$.getJSON(foursquareRequest).done(function(data) {
		this.temParkings = data.response.venues;
		for (var i = 0; i < 5; i++) {
			var parkingArr = this.temParkings[i];
			this.name = parkingArr.name;
			this.address = parkingArr.location.formattedAddress;
			this.popularity = parkingArr.stats.checkinsCount;
			self.restaurants.push('<h4>' + this.name + '</h4><span>Popularity:<b> ' + this.popularity + ' visited here.</b></span><br><span>Address: ' + this.address + '</span><br>');
		}
		descriptionWindow.setContent(self.descriptionInfo += self.restaurants.slice());
	});

	var descriptionWindow = new google.maps.InfoWindow({
		content: '<div class="descriptionWindow"' + self.descriptionInfo + '</div>',
		position: data.location
	});

	this.marker = new google.maps.Marker({
		map: map,
		animation: google.maps.Animation.DROP,
		position: data.location
	});

	this.marker.addListener('click', function() {
		descriptionWindow.open(map, this.marker);
	});

	this.markProperty = function () {
        if (this.marker.getAnimation() !== null) {
          this.marker.setAnimation(null);
        } else {
          this.marker.setAnimation(google.maps.Animation.DROP);
        }
        descriptionWindow.open(map, this.marker);
    }
}

function viewModel() {
	var self = this;

	self.properties = ko.observableArray([]);
	self.markers = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('googleMap'), {
		center: {lat: 32.07426, lng: 34.767958},
		zoom: 14
	});

	var bounds = new google.maps.LatLngBounds();

	officeLocations.forEach(function(newProperty) {
		self.properties.push(new property(newProperty));
	});

	self.typeDisplay = ko.observable("all");
	self.searchTerm = ko.observable("");

	self.filteredProperties = ko.computed(function() {
		var filterType = self.typeDisplay();
		var searchTerm = self.searchTerm().toLowerCase();

		if (filterType === "all" && !searchTerm) {
			self.searchTerm().value = "";
			$('#searchInput').hide();
			var temporaryProperties = self.properties.slice();

			return temporaryProperties.filter(function(property) {
				if (property.type != undefined) {
					property.marker.setMap(map);
					map.fitBounds(bounds);
				}
				return property.type;
			});
			
		} else {
			var temporaryProperties = self.properties.slice();
			$('#searchInput').show();

			return temporaryProperties.filter(function(property) {
				var title = property.title.toLowerCase();
				var endResult = title.search(searchTerm);
				if (property.type !== filterType || endResult == -1) {
					property.marker.setMap(null);
				} else {
					property.marker.setMap(map);
					map.fitBounds(bounds);
				}
				return property.type === filterType && endResult > -1;
			});
		}
	});

	self.filteredProperties().forEach(function(property) {
		self.markers.push(property.marker);
	});

	self.markers().forEach(function(marker) {
		bounds.extend(marker.getPosition());
	});
	map.fitBounds(bounds);

	this.displayMenu = function() {
		if ($('#header').css('display') == 'none') {
			$('#header').css('display', 'block');
			map.fitBounds(bounds);
		} else {
			$('#header').css('display', 'none');
			map.fitBounds(bounds);
		}
	}
}

function startView() {
	ko.applyBindings(new viewModel());
}