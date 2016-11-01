var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');
var chroma = require('chroma-js');

module.exports = Backbone.View.extend({
	graphWidth: 1000,
	graphHeight: 400,
	graphMargins: 20,

	initialize: function() {
		this.createBasedata();
		this.renderGraph();

		this.collection = new Backbone.Collection();
		this.collection.url = 'http://localhost:3000/colormap';
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
		console.log(d3)
		this.xRange = d3.scaleLinear().range([this.graphMargins, this.graphWidth-(this.graphMargins*2)]).domain([0, 360]);
		this.yRange = d3.scaleLinear().range([this.graphMargins, this.graphHeight-(this.graphMargins*2)]).domain([100, 0]);

		var view = this;

		this.$el.find('svg.graph-container').attr('width', this.graphWidth+this.graphMargins);
		this.$el.find('svg.graph-container').attr('height', this.graphHeight+this.graphMargins);

		this.vis = d3.select('#graphContainer');

		this.vis.selectAll('g.hue')
			.data(this.baseData)
			.enter()
			.append('g')
			.attr('class', 'hue')
			.each(function(data, hue) {
				d3.select(this)
					.selectAll('circle')
					.data(data.saturation)
					.enter()
					.append('circle')
					.attr('cx', function(d) {
						return view.xRange(hue)
					})
					.attr('cy', function(d) {
						return view.yRange(d)
					})
					.attr('r', 3)
					.attr('opacity', 0.8)
					.attr('fill', function(d) {
						return chroma(hue, (d/100), 1+((d/100)-0.6), 'hsv').hex();
					});
			});

	},

	render: function() {
		var view = this;

		this.vis.selectAll('g.marker')
			.data(this.collection.models)
			.enter()
			.append('g')
			.attr('class', 'marker')
			.each(function(data, hue, more, evenmore) {
				d3.select(this)
					.selectAll('circle')
					.data(data.get('saturation'))
					.enter()
					.append('circle')
					.attr('cx', function(d) {
						return view.xRange(view.collection.at(hue).get('hue'))
					})
					.attr('cy', function(d) {
						return view.yRange(d)
					})
					.attr('r', 4)
					.attr('fill', function(d) {
						return chroma(view.collection.at(hue).get('hue'), (d/100), 1+((d/100)-0.6), 'hsv').hex();
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