function property(data) {
	var self = this;

	this.title = data.title;
	this.type = data.type;
	this.location = data.location;
	this.lat = data.location.lat;
	this.lng = data.location.lng;
	this.position = this.lat + ',' + this.lng;
	
	this.description = '<h4>' + data.title + '</h4><br>' +
		'<div id="pano"></div>' +
		'<span>Price: ' + data.price + ' Ils / month</span><br>' +
		'<span>Type: ' + data.type + '</span><br>' +
		'<h5>Nearest Parkings (Ordered by distance)</h5><br>';
	
	this.parkings = ko.observableArray([]);

	var foursquareRequest = 'https://api.foursquare.com/v2/venues/search' +
		'?client_id=0NZGCGSS4CE1B5TDRJLXIIGI5UN5K0TSSLBO3GT215JBUVMQ' +
		'&client_secret=SLAYSZONNPEMU2LQD0WCMUKXUXCB3QLCUEGCN1ATGDONUBMP' +
		'&ll=' + this.position + '&query=parking' + '&v=20160118';

	$.getJSON(foursquareRequest).done(function(data) {
		this.temParkings = data.response.venues;
		for (var i = 0; i < 5; i++) {
			var parkingArr = this.temParkings[i];
			this.name = parkingArr.name;
			self.parkings.push('<span>' + this.name + '</span><br>');
		}
		descriptionWindow.setContent(self.description += self.parkings.slice());
	});

	var descriptionWindow = new google.maps.InfoWindow({
		content: self.description,
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
			$('input').value = "";
			$('#searchInput').hide();
			var temporaryProperties = self.properties.slice();

			return temporaryProperties.filter(function(property) {
				if (property.type != undefined) {
					property.marker.setMap(map);
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

}

function startView() {
	ko.applyBindings(new viewModel());
}