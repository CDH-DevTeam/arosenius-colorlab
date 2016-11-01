var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
	url: 'http://cdh-vir-1.it.gu.se:8004/documents',

	byColor: function(hue, saturation) {
		var query = {
			museum: 'Nationalmuseum',
			color_margins: 0
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