var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var chroma = require('chroma-js');

var AroseniusCollection = require('./../collections/AroseniusCollection');
var ColorCircle = require('./ColorCircle');
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

//		this.drawPalette();

//		this.createCircle();

		this.createGraph();
	},

	drawPalette: function() {
		this.canvas = $('.color-picker')[0];
		this.ctx = this.canvas.getContext('2d');

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var hGrad = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
		hGrad.addColorStop(0 / 6, '#F00');
		hGrad.addColorStop(1 / 6, '#FF0');
		hGrad.addColorStop(2 / 6, '#0F0');
		hGrad.addColorStop(3 / 6, '#0FF');
		hGrad.addColorStop(4 / 6, '#00F');
		hGrad.addColorStop(5 / 6, '#F0F');
		hGrad.addColorStop(6 / 6, '#F00');

		this.ctx.fillStyle = hGrad;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		var vGrad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);

//		vGrad.addColorStop(0, 'rgba(255,255,255,0)');
//		vGrad.addColorStop(1, 'rgba(255,255,255,1)');


		vGrad.addColorStop(0, 'rgba(150,150,150,0)');
		vGrad.addColorStop(1, 'rgba(150,150,150,1)');

		this.ctx.fillStyle = vGrad;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		$('.color-picker').click(_.bind(this.canvasClick, this));
	},

	createCircle: function() {
		this.colorCircle = new ColorCircle({
			el: this.$el.find('.circle-wrapper')[0]
		});
		this.colorCircle.on('select', _.bind(function(event) {
			this.collection.byColor(event.h, event.s, 50);
		}, this));
	},

	createGraph: function() {
		this.colorGraph = new ColorGraph({
			el: this.$el.find('.graph-wrapper')[0]
		});
		this.colorGraph.on('select', _.bind(function(event) {
			this.collection.byColor(event.h, event.s, 50);
		}, this));
	},

	canvasClick: function(event) {
		$('.canvas-marker').css({
			top: event.offsetY-1,
			left: event.offsetX-1
		});
		var point = this.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;

		var hsv = chroma(point[0], point[1], point[2]).hsv();
		hsv = {
			h: !hsv[0] || hsv[0] == null || typeof hsv[0] === 'null' || Math.round(hsv[0]) == null ? 0 : Math.round(hsv[0]), 
			s: !hsv[1] || hsv[1] == null || typeof hsv[1] === 'null' || Math.round(hsv[1]*100) == null ? 0 : Math.round(hsv[1]*100), 
			v: !hsv[2] || hsv[2] == null || typeof hsv[2] === 'null' || Math.round(hsv[2]*100) == null ? 0 : Math.round(hsv[2]*100)
		};

		console.log('hue: '+hsv.h);
		
		this.collection.byColor(hsv.h, hsv.s, 50);
	},

	render: function() {
		var template = _.template($("#imageListTemplate").html());
		this.$el.find('.image-list').html(template({
			models: this.collection.models
		}));

		return this;
	}
});