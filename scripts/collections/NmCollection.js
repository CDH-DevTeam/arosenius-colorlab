var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
	url: 'data/nationalmuseum.json',

	parse: function(data) {
		return data.files;
	}
});