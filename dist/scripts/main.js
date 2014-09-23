"use strict";var categories=[{id:1,name:"Health",value:0,color:"#90bf5e"},{id:2,name:"Sports",value:0,color:"#ed5565"},{id:3,name:"Wealth",value:0,color:"#4fc1e9"},{id:4,name:"Hobbies",value:0,color:"#ac92ec"},{id:5,name:"Lifestyle",value:0,color:"#ec87c0"},{id:6,name:"News",value:0,color:"#5d9cec"},{id:7,name:"Entertainment",value:0,color:"#48cfad"},{id:8,name:"Home",value:0,color:"#fc6e51"},{id:9,name:"Travel",value:0,color:"#ffce54"}],links=[{source:0,target:1,value:1},{source:1,target:2,value:1},{source:2,target:3,value:1},{source:3,target:4,value:1},{source:4,target:5,value:1},{source:5,target:6,value:1},{source:6,target:7,value:1},{source:7,target:8,value:1}],EqualizerView=Backbone.View.extend({el:"#equalizer",events:{"click #reset":"reset"},initialize:function(){this.categories=categories,this.links=links,this.width=800,this.height=500,this.xW=this.width/this.categories.length,this.yW=this.height/100,this.radius=20,this.stroke=10,this.marginTop=30,this.offsetTop=this.marginTop,this.tickWidth=12,this.nTicks=3,this.topRange=50,this.bottomRange=this.height-(this.radius+this.stroke),this.showValues=!0,this.showPercent=!0,this.precision=2,this.svg=d3.select("#equalizer").append("svg:svg").attr("width",this.width).attr("height",this.height),this.scale=d3.scale.linear().domain([-100,100]).range([this.bottomRange,this.topRange]),this.addVerticalLines();try{var a=$(".label").eq(0).get(0).getBBox();this.offsetTop+=a.height}catch(b){this.offsetTop+=25}this.setDragFunctions(),this.update()},addVerticalLines:function(){_.each(this.categories,function(a){var b=this.getCX(a);this.svg.append("text").attr({"class":"label",x:b,y:20,"text-anchor":"middle"}).text(a.name),this.svg.append("line").attr({"class":"yaxis",x1:b,y1:this.topRange,x2:b,y2:this.bottomRange});for(var c=(this.bottomRange-this.topRange)/(this.nTicks+1),d=1;d<=this.nTicks;d++)this.svg.append("line").attr({"class":"yaxis",x1:b-this.tickWidth/2,y1:this.topRange+c*d,x2:b+this.tickWidth/2,y2:this.topRange+c*d})},this)},getCX:function(a){return a.id*this.xW-this.xW/2},getCY:function(a){return this.round(this.scale(a.value))},reverseCY:function(a){return this.round(this.scale.invert(a))},setDragFunctions:function(){var a=this;this.dragmove=function(b){d3.select(this).attr("cy",b.y=Math.max(a.topRange,Math.min(a.bottomRange,d3.event.y))),a.categories[b.id-1].value=a.reverseCY(b.y),a.update()},this.equalize=function(b){var c=_.reduce(a.categories,function(a,b){return parseFloat(a+b.value)},0),d=a.round(c/8);console.log("Total: "+c),console.log("Diff: "+d),_.each(a.categories,function(c){c.id!==b.id&&(c.value-=d,c.value=a.round(c.value))}),c=_.reduce(a.categories,function(a,b){return parseFloat(a+b.value)},0),console.log("New total: "+c),a.update(!0)},this.drag=d3.behavior.drag().on("drag",this.dragmove).on("dragend",this.equalize)},round:function(a){return 0===this.precision?parseInt(Math.round(a)):parseFloat(a.toFixed(this.precision))},update:function(a){a=a||!1;var b=this,c=this.svg.selectAll(".link").data(this.links),d=this.svg.selectAll(".link-shadow").data(this.links);d.enter().append("line").attr("class","link-shadow"),c.enter().append("line").attr("class","link"),a?(d.transition().attr("x1",function(a){return b.getCX(b.categories[a.source])}).attr("y1",function(a){return b.getCY(b.categories[a.source])+3}).attr("x2",function(a){return b.getCX(b.categories[a.target])}).attr("y2",function(a){return b.getCY(b.categories[a.target])+3}),c.transition().attr("x1",function(a){return b.getCX(b.categories[a.source])}).attr("y1",function(a){return b.getCY(b.categories[a.source])}).attr("x2",function(a){return b.getCX(b.categories[a.target])}).attr("y2",function(a){return b.getCY(b.categories[a.target])})):(d.attr("x1",function(a){return b.getCX(b.categories[a.source])}).attr("y1",function(a){return b.getCY(b.categories[a.source])+3}).attr("x2",function(a){return b.getCX(b.categories[a.target])}).attr("y2",function(a){return b.getCY(b.categories[a.target])+3}),c.attr("x1",function(a){return b.getCX(b.categories[a.source])}).attr("y1",function(a){return b.getCY(b.categories[a.source])}).attr("x2",function(a){return b.getCX(b.categories[a.target])}).attr("y2",function(a){return b.getCY(b.categories[a.target])})),d.exit().remove(),c.exit().remove();var e=this.svg.selectAll(".circle").data(this.categories),f=this.svg.selectAll(".circle-shadow").data(this.categories);if(f.enter().append("circle").attr("r",this.radius).attr("class","circle-shadow"),e.enter().append("circle").attr("r",this.radius).attr("class","circle").style("fill",function(a){return a.color}).call(this.drag),a?(f.transition().attr("cx",function(a){return b.getCX(a)}).attr("cy",function(a){return b.getCY(a)+3}),e.transition().attr("cx",function(a){return b.getCX(a)}).attr("cy",function(a){return b.getCY(a)})):(f.attr("cx",function(a){return b.getCX(a)}).attr("cy",function(a){return b.getCY(a)+3}),e.attr("cx",function(a){return b.getCX(a)}).attr("cy",function(a){return b.getCY(a)})),f.exit().remove(),e.exit().remove(),this.showValues){var g=this.svg.selectAll(".value").data(this.categories);g.enter().append("text").attr("class","value").attr("text-anchor","middle").attr("x",function(a){return b.getCX(a)}).attr("y",this.height-10),g.text(function(a){return a.value}),g.exit().remove()}if(this.showPercent){var h=this.svg.selectAll(".percent").data(this.categories);h.enter().append("text").attr("class","percent").attr("text-anchor","middle").attr("x",function(a){return b.getCX(a)}).attr("y",40),h.text(function(a){return b.round((a.value+100)/9)+"%"}),h.exit().remove()}},reset:function(){_.each(this.categories,function(a){a.value=0}),this.update(!0)}}),equalizer;$(function(){equalizer=new EqualizerView});