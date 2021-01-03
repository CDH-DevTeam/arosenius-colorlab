var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
	url: 'https://aroseniusarkivet.dh.gu.se/api/documents',

	byColor: function(hue, saturation) {
		var query = {
			museum: 'Nationalmuseum',
			color_margins: 4
		};

		if (hue) {
			query.hue = hue;
		}
		
		if (saturation) {
			query.saturation = saturation;
		}

		this.fetch({
			reset: true,
			data: query
		});
	},

	parse: function(data) {
		return data.documents;
	}
});
