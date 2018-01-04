function property(data) {
	var self = this;

	this.description = '<span>' + data.title + '</span>' +
		'<span>' + data.price + '</span>' +
		'<span>' + data.type + '</span>';

	this.descriptionWindow = new google.maps.InfoWindow({
		content: this.description
	});

	this.marker = new google.maps.Marker({
		map: map,
		animation: google.maps.Animation.DROP,
		position: data.location
	});

	this.marker.addListener('click', function() {
		descriptionWindow.open(map, marker);
	});
}

function viewModel() {
	var self = this;

	this.properties = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('googleMap'), {
		center: {lat: 32.07426, lng: 34.767958},
		zoom: 14
	});

	officeLocations.forEach(function(newProperty) {
		self.properties.push(new property(newProperty));
	});
}

function startView() {
	ko.applyBindings(new viewModel());
}