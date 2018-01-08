var map;

var parkingIcon = 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png';

var officeLocations = [
	{
         title: '2 rooms near the beach',
         location: {
             lat: 32.078801,
             lng: 34.769281
         },
         price: 3600,
         type: 'apartment',
         pictures: ['f8cf0bf7-bf37-417c-9e10-126958b5dd0b.jpg', 'fecff740-9418-43ad-ad13-94e36f1b93c2.jpg'],
         description: 'For rent on Ben Yehuda 2 renovated rooms 25 sqm apartment on the 4th floor without an elevator for 3,600 ils per month including all expenses.'
     },
     {
         title: '3 luxurious rooms in jaffa',
         location: {
             lat: 32.053612,
             lng: 34.759539
         },
         price: 7500,
         type: 'apartment',
         pictures: ['1395820362-KT9B1795 (Small) (1).jpg', '1395909909-KT9B1765 (Small) (1).jpg'],
         description: 'For rent in the Jaffa court (Jerusalem st.) a 3 rooms 80 sqm renovated and furnished apartment with parking, elevator, gym and a swimming pool for 7,500 ils including maintenance(1,200 ils).'
     },
     {
         title: 'Beautiful office at the center',
         location: {
             lat: 32.079251,
             lng: 34.783615
         },
         price: 35000,
         type: 'office',
         pictures: ['ed88d949-8eb5-4749-a1e3-e71a1959c790.jpg', 'f6a221f4-d87e-4e1f-80aa-e4c17c4cae77.jpg'],
         description: 'For rent at the New North – North, on Zeitlin street a 280 sqm office including meetings room, 10 offices 11 sqm each with a/c, reception hall, toilets, kitchen and a storeroom, for 35,000 ils a month.'
     },
     {
         title: 'Fully furnished loft at Neve Tzedek tower',
         location: {
             lat: 32.059716,
             lng: 34.767055
         },
         price: 9500,
         type: 'apartment',
         pictures: ['IMG_0924 [800x600].jpg', 'IMG_0927 [800x600].jpg'],
         description: 'For rent Neve Tzedek tower a 45 sqm loft on the 4th floor with an elevator, gym, parking and reception for 9,500 ils per month including all expenses.'
     },
     {
         title: 'The Pinsker duplex',
         location: {
             lat: 32.075481,
             lng: 34.771124
         },
         price: 14000,
         type: 'apartment',
         pictures: ['DSC04975.jpg', 'DSC05027.jpg'],
         description: 'For rent on Pinsker 4 rooms renovated 120 meters duplex on the 5th floor with an elevator, balcony with a jacuzzi, 2 bathrooms and amazing view for 14,000 ils per month.'
     }
];