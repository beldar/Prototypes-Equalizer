/* globals _, $, Backbone, d3 */

'use strict';

var categories = [
    {id: 1, name: 'Health', value: 0, color: '#90bf5e'},
    {id: 2, name: 'Sports', value: 0, color: '#ed5565'},
    {id: 3, name: 'Wealth', value: 0, color: '#4fc1e9'},
    {id: 4, name: 'Hobbies', value: 0, color: '#ac92ec'},
    {id: 5, name: 'Lifestyle', value: 0, color: '#ec87c0'},
    {id: 6, name: 'News', value: 0, color: '#5d9cec'},
    {id: 7, name: 'Entertainment', value: 0, color: '#48cfad'},
    {id: 8, name: 'Home', value: 0, color: '#fc6e51'},
    {id: 9, name: 'Travel', value: 0, color: '#ffce54'},
];

var links = [
    {'source':0,'target':1,'value':1},
    {'source':1,'target':2,'value':1},
    {'source':2,'target':3,'value':1},
    {'source':3,'target':4,'value':1},
    {'source':4,'target':5,'value':1},
    {'source':5,'target':6,'value':1},
    {'source':6,'target':7,'value':1},
    {'source':7,'target':8,'value':1}
];

var EqualizerView = Backbone.View.extend({

    el: '#equalizer',

    events: {
        'click #reset' : 'reset'
    },

    initialize: function() {
        this.categories = categories;
        this.links = links;
        this.width = 800;
        this.height = 500;
        this.xW = this.width / this.categories.length;
        this.yW = this.height / 100;
        this.radius = 20;
        this.stroke = 10;
        this.marginTop = 30;
        this.offsetTop = this.marginTop;
        this.tickWidth = 12;
        this.nTicks = 3;
        this.topRange = 50;
        this.bottomRange = this.height - (this.radius+this.stroke);
        this.showValues = true;
        this.showPercent = true;
        this.precision = 2;

        this.svg = d3.select('#equalizer')
            .append('svg:svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.scale = d3.scale.linear()
            .domain([-100, 100])
            .range([this.bottomRange, this.topRange]);

        this.addVerticalLines();

        var bbox = $('.label').eq(0).get(0).getBBox();
        this.offsetTop += bbox.height;

        this.setDragFunctions();

        this.update();
    },

    addVerticalLines: function() {
        //Add vertical line axis for each category
        _.each(this.categories, function(cat) {
            var cx = this.getCX(cat);
            //Label
            this.svg.append('text')
                .attr({
                    class: 'label',
                    x: cx,
                    y: 20,
                    'text-anchor': 'middle'
                })
                .text(cat.name);

            //Vertical line
            this.svg.append('line')
                .attr({
                    class: 'yaxis',
                    x1: cx,
                    y1: this.topRange,
                    x2: cx,
                    y2: this.bottomRange
                });

            //Line ticks
            var tickInc = (this.bottomRange - this.topRange) / (this.nTicks+1);
            for(var i = 1; i <= this.nTicks; i++) {
                this.svg.append('line')
                    .attr({
                        class: 'yaxis',
                        x1: cx - (this.tickWidth / 2),
                        y1: this.topRange + (tickInc * i),
                        x2: cx + (this.tickWidth / 2),
                        y2: this.topRange + (tickInc * i)
                    });
            }

        }, this);
    },

    getCX: function(d) {
        return (d.id * this.xW) - (this.xW/2);
    },

    getCY: function(d) {
        return this.round(this.scale(d.value));
    },

    reverseCY: function(cy) {
        return this.round(this.scale.invert(cy));
    },

    setDragFunctions: function() {
        var self = this;

        this.dragmove = function(d) {
            d3.select(this)
                .attr('cy', d.y = Math.max(self.topRange, Math.min(self.bottomRange, d3.event.y)));

            self.categories[(d.id-1)].value = self.reverseCY(d.y);
            //console.log(categories[(d.id-1)].value);
            self.update();
        };

        this.equalize = function(d) {
            var total = _.reduce(self.categories, function(memo, cat){ return parseFloat(memo + cat.value); }, 0);
            //var subtotal = total - d.value;
            var diff = self.round(total / 8);
            console.log('Total: '+total);
            console.log('Diff: '+diff);
            _.each(self.categories, function(cat){
                if ( cat.id !== d.id ) {
                    cat.value -= diff;
                    cat.value = self.round(cat.value);
                }
            });
            total = _.reduce(self.categories, function(memo, cat){ return parseFloat(memo + cat.value); }, 0);
            console.log('New total: '+total);
            self.update(true);
        };

        this.drag = d3.behavior.drag()
            .on('drag', this.dragmove)
            .on('dragend', this.equalize);
    },

    round: function(value) {
        if (this.precision === 0) {
            return parseInt(Math.round(value));
        } else {
            return parseFloat(value.toFixed(this.precision));
        }
    },

    update: function(animate) {
        animate = animate || false;

        var self = this;

        //------------- Links -------------//
        var lines = this.svg.selectAll('.link')
            .data(this.links);

        var lineShadows = this.svg.selectAll('.link-shadow')
            .data(this.links);

        //** Enter **//
        //Shadow
        lineShadows
            .enter()
            .append('line')
                .attr('class', 'link-shadow');
        //Links
        lines
            .enter()
            .append('line')
                .attr('class', 'link');

        //** Enter + Update **//
        if (animate) {
            //Shadow
            lineShadows
                .transition()
                .attr('x1', function(d) { return self.getCX(self.categories[d.source]); })
                .attr('y1', function(d) { return self.getCY(self.categories[d.source])+3; })
                .attr('x2', function(d) { return self.getCX(self.categories[d.target]); })
                .attr('y2', function(d) { return self.getCY(self.categories[d.target])+3; });

            //Links
            lines
                .transition()
                .attr('x1', function(d) { return self.getCX(self.categories[d.source]); })
                .attr('y1', function(d) { return self.getCY(self.categories[d.source]); })
                .attr('x2', function(d) { return self.getCX(self.categories[d.target]); })
                .attr('y2', function(d) { return self.getCY(self.categories[d.target]); });
        } else {
            //Shadow
            lineShadows
                .attr('x1', function(d) { return self.getCX(self.categories[d.source]); })
                .attr('y1', function(d) { return self.getCY(self.categories[d.source])+3; })
                .attr('x2', function(d) { return self.getCX(self.categories[d.target]); })
                .attr('y2', function(d) { return self.getCY(self.categories[d.target])+3; });

            //Links
            lines
                .attr('x1', function(d) { return self.getCX(self.categories[d.source]); })
                .attr('y1', function(d) { return self.getCY(self.categories[d.source]); })
                .attr('x2', function(d) { return self.getCX(self.categories[d.target]); })
                .attr('y2', function(d) { return self.getCY(self.categories[d.target]); });
        }

        //** Exit **//
        lineShadows.exit().remove();
        lines.exit().remove();

        //------------- Circles -------------//
        var circles = this.svg.selectAll('.circle')
            .data(this.categories);

        var circleShadows = this.svg.selectAll('.circle-shadow')
            .data(this.categories);

        //** Enter **//
        //Shadow
        circleShadows
            .enter()
            .append('circle')
                .attr('r', this.radius)
                .attr('class', 'circle-shadow');

        //Points
        circles
            .enter()
            .append('circle')
                .attr('r', this.radius)
                .attr('class', 'circle')
                .style('fill', function(d){ return d.color; })
                .call(this.drag);

        //** Enter + Update **//
        if (animate) {
            //Shadow
            circleShadows
                .transition()
                .attr('cx', function(d){ return self.getCX(d); })
                .attr('cy', function(d){ return self.getCY(d)+3; });

            //Points
            circles
                .transition()
                .attr('cx', function(d){ return self.getCX(d); })
                .attr('cy', function(d){ return self.getCY(d); });

        } else {
            //Shadow
            circleShadows
                .attr('cx', function(d){ return self.getCX(d); })
                .attr('cy', function(d){ return self.getCY(d)+3; });

            //Points
            circles
                .attr('cx', function(d){ return self.getCX(d); })
                .attr('cy', function(d){ return self.getCY(d); });
        }

        //** Exit **//
        circleShadows.exit().remove();
        circles.exit().remove();

        //------------- Values -------------//
        if (this.showValues) {
            var values = this.svg.selectAll('.value')
                .data(this.categories);

            //** Enter **//
            values
                .enter()
                .append('text')
                    .attr('class', 'value')
                    .attr('text-anchor', 'middle')
                    .attr('x', function(d){ return self.getCX(d); })
                    .attr('y', this.height - 10);

            //** Enter + Update **//
            values
                .text(function(d){ return d.value; });

            //** Exit **//
            values.exit().remove();
        }

        //------------- Values -------------//
        if (this.showPercent) {
            var percent = this.svg.selectAll('.percent')
                .data(this.categories);

            //** Enter **//
            percent
                .enter()
                .append('text')
                    .attr('class', 'percent')
                    .attr('text-anchor', 'middle')
                    .attr('x', function(d){ return self.getCX(d); })
                    .attr('y', 40);

            //** Enter + Update **//
            percent
                .text(function(d){ return self.round(((d.value+100)/9))+'%'; });

            //** Exit **//
            percent.exit().remove();
        }
    },

    reset: function() {
        _.each(this.categories, function(cat) {
            cat.value = 0;
        });

        this.update(true);
    }
});

var equalizer;

$(function(){
    equalizer = new EqualizerView();
});


