var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var NmCollection = require('./../collections/NmCollection');

module.exports = Backbone.View.extend({
	initialize: function() {
		this.collection = new NmCollection();
		this.collection.on('reset', this.render, this);
		this.collection.fetch({
			reset: true
		});
	},

	sortColors: function(colors) {
		var colorDistance = function(color1, color2) {
			// This is actually the square of the distance but
			// this doesn't matter for sorting.
			var result = 0;
			for (var i = 0; i < color1.length; i++)
				result += (color1[i] - color2[i]) * (color1[i] - color2[i]);
			return result;
		}

		// Calculate distance between each color
		var distances = [];
		for (var i = 0; i < colors.length; i++) {
			distances[i] = [];
			for (var j = 0; j < i; j++)
				distances.push([colors[i], colors[j], colorDistance(colors[i], colors[j])]);
		}
		distances.sort(function(a, b) {
			return a[2] - b[2];
		});

		// Put each color into separate cluster initially
		var colorToCluster = {};
		for (var i = 0; i < colors.length; i++)
			colorToCluster[colors[i]] = [colors[i]];

		// Merge clusters, starting with lowest distances
		var lastCluster;
		for (var i = 0; i < distances.length; i++) {
			var color1 = distances[i][0];
			var color2 = distances[i][1];
			var cluster1 = colorToCluster[color1];
			var cluster2 = colorToCluster[color2];
			if (!cluster1 || !cluster2 || cluster1 == cluster2)
				continue;

			// Make sure color1 is at the end of its cluster and
			// color2 at the beginning.
			if (color1 != cluster1[cluster1.length - 1])
				cluster1.reverse();
			if (color2 != cluster2[0])
				cluster2.reverse();

			// Merge cluster2 into cluster1
			cluster1.push.apply(cluster1, cluster2);
			delete colorToCluster[color1];
			delete colorToCluster[color2];
			colorToCluster[cluster1[0]] = cluster1;
			colorToCluster[cluster1[cluster1.length - 1]] = cluster1;
			lastCluster = cluster1;
		}

		// By now all colors should be in one cluster
		return lastCluster;
	},

	render: function() {
		console.log('AppView:render');

		var template = _.template($("#imageListTemplate").html());
		this.$el.html(template({
			models: this.collection.models
		}));

		var uniqueColors = _.uniq(_.flatten(_.map(this.collection.models, function(model) {
			return _.pluck(model.get('colors').five_mapped, 'hex');
		})));

		console.log(uniqueColors);

		uniqueColors.sort();

//		uniqueColors = this.sortColors(uniqueColors);

		var template = _.template($("#colorsListTemplate").html());
		$('#colorsList').html(template({
			colors: uniqueColors
		}));

		return this;
	}
});