var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var chroma = require('chroma-js');

module.exports = Backbone.View.extend({
	graphRadius: 200,
	graphMargins: 20,

	initialize: function() {
		this.render();
	},

	render: function() {
		var view = this;

		this.$el.find('svg.circle-container').attr('width', (this.graphRadius*2)+this.graphMargins);
		this.$el.find('svg.circle-container').attr('height', (this.graphRadius*2)+this.graphMargins);

		this.vis = d3.select('#circleContainer');

		var graphContainer = this.vis.append('g')
			.attr('transform', function() {
				return 'translate('+(view.graphRadius+(view.graphMargins/2))+', '+(view.graphRadius+(view.graphMargins/2))+')';
			});

		for (var i = 0; i<360; i += 1) {

			for (var s = 1; s>=0.01; s -= 0.01) {
				graphContainer.append('circle')
					.datum({
						h: i,
						s: s
					})
					.attr('cx', function() {
						return ((view.graphRadius-10-2)-((Math.abs(s-1)*120)))*Math.sin((i)*((2*Math.PI)/360));
					})
					.attr('cy', function() {
						return ((view.graphRadius-10-2)-((Math.abs(s-1)*120)))*Math.cos((i+180)*((2*Math.PI)/360));
					})
					.attr('r', 1)
					.attr('fill', function() {
						return chroma(i, s, 1+(s-0.6), 'hsv').hex();
					})
					.on('click', function(event) {
						view.trigger('select', event);
					});
			}
		}
	}
});