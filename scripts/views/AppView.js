var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var chroma = require('chroma-js');

var AroseniusCollection = require('./../collections/AroseniusCollection');
var ColorGraph = require('./ColorGraph');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.collection = new AroseniusCollection();
		this.collection.on('reset', this.render, this);
		this.collection.fetch({
			reset: true,
			data: {
				museum: 'Nationalmuseum'
			}
		});

		this.createGraph();
	},

	events: {
		'click .graph-type-links button': 'graphTypeButtonClick'
	},

	graphTypeButtonClick: function(event) {
		var type = $(event.currentTarget).data('type');

		if (type == 'circular') {
			this.colorGraph.setCircularGraph(true);
		}
		else {
			this.colorGraph.setCircularGraph(false);
		}
	},

	createGraph: function() {
		this.colorGraph = new ColorGraph({
			el: this.$el.find('.graph-wrapper')[0]
		});
		this.colorGraph.on('select', _.bind(function(event) {
			this.collection.byColor(event.h, event.s, 50);
		}, this));
	},

	render: function() {
		var template = _.template($("#imageListTemplate").html());
		this.$el.find('.image-list').html(template({
			models: this.collection.models
		}));

		return this;
	}
});