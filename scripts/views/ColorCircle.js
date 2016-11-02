var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var chroma = require('chroma-js');

module.exports = Backbone.View.extend({
	graphRadius: 300,
	graphMargins: 20,

	initialize: function() {
		this.createBasedata();
		this.renderGraph();

		this.collection = new Backbone.Collection();
		this.collection.url = 'http://cdh-vir-1.it.gu.se:8004/colormap';
		this.collection.on('reset', this.render, this);
		this.collection.fetch({
			reset: true,
			data: {
				query: 'Nationalmuseum'
			}
		});
	},

	createBasedata: function() {
		this.baseData = [];

		for (var hue = 0; hue<=360; hue++) {
			var hueObj = {
				hue: hue,
				saturation: []
			};

			for (var saturation = 0; saturation<=100; saturation++) {
				hueObj.saturation.push(saturation);
			}
			this.baseData.push(hueObj);
		}
	},

	renderGraph: function() {
		this.yRange = d3.scaleLinear().range([this.graphMargins, this.graphRadius-(this.graphMargins*2)]).domain([-50, 100]);

		var view = this;

		this.$el.find('svg.circle-container').attr('width', (this.graphRadius*2)+this.graphMargins);
		this.$el.find('svg.circle-container').attr('height', (this.graphRadius*2)+this.graphMargins);

		this.vis = d3.select('#circleContainer');

		this.graphContainer = this.vis.append('g')
			.attr('transform', function() {
				return 'translate('+(view.graphRadius+(view.graphMargins/2))+', '+(view.graphRadius+(view.graphMargins/2))+')';
			});

		this.graphContainer.selectAll('g.hue')
			.data(this.baseData)
			.enter()
			.append('g')
			.attr('class', 'hue')
			.attr('transform', function(d) {
				return 'rotate('+d.hue+')';
			})
			.each(function(data, hue) {
				d3.select(this)
					.selectAll('circle')
					.data(data.saturation)
					.enter()
					.append('circle')
					.attr('cy', function(d) {
						return view.yRange(d)
					})
					.attr('r', 4)
					.attr('opacity', 0.8)
					.attr('fill', function(d) {
						return chroma(hue, (d/100), 0.4+(d/100), 'hsv').hex();
					});
			});
/*
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
*/
	},

	render: function() {
		var view = this;

		this.graphContainer.selectAll('g.marker')
			.data(this.collection.models)
			.enter()
			.append('g')
			.attr('class', 'marker')
			.attr('transform', function(d) {
				return 'rotate('+d.get('hue')+')';
			})
			.each(function(data, hue, more, evenmore) {
				d3.select(this)
					.selectAll('circle')
					.data(data.get('saturation'))
					.enter()
					.append('circle')
					.attr('cy', function(d) {
						return view.yRange(d)
					})
					.attr('r', 4)
					.attr('fill', function(d) {
						return chroma(view.collection.at(hue).get('hue'), (d/100), 0.6+(d/100), 'hsv').hex();
					})
					.attr('style', 'cursor: pointer')
					.attr('stroke', '#333')
					.on('click', function(event) {
						view.trigger('select', {
							h: view.collection.at(hue).get('hue'),
							s: event
						});
					});
			});

	}
});