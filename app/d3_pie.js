function election_pie(constit, id) {
  var party_keys = {
    "Labour":{
      'key':'lab',
      'color': 'red',
      'rgba': 'rgba(213,0,0',
    },
    "Conservative": {
      'key': 'con',
      'color': 'blue',
      'rgba': 'rgba(0,135,220',
    },
    "Lib Dems": {
      'key': 'ld',
      'color': 'orange',
      'rgba': 'rgba(253,187,48',
    },
    'UKIP': {
      'key': 'ukip',
      'color': 'purple',
      'rgba': 'rgba(109,49,119',
    },
    'Green': {
      'key': 'grn',
      'color': 'snp',
      'rgba': 'rgba(0,116,95',
    },
    'Plaid Cymru': {
      'key': 'pc',
      'color': 'green',
      'rgba': 'rgba(63,132,40',
    },
    'Other': {
      'key': 'other',
      'color': 'other',
      'rgba': 'rgba(150,150,150',
    },
  }

  var parties = Object.keys(party_keys);
  var colors = [];
  var i;

  for (i = 0; i < parties.length; i++) {
    color = party_keys[parties[i]]['rgba'] + ',1)';
    colors.push(color);
  }

  // set the dimensions and margins of the graph
  var margin = 1,
      width = 100,
      height = 100;

  var radius = Math.min(width, height) / 2 - margin

  console.log(id);
  console.log(d3.select('#'+id));
  var svg = d3.select('#'+id)
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  var data = {};
  var colors = [];

  for (i = 0; i < parties.length; i++) {
    var party = parties[i];
    var key = party_keys[party]['key']+'_pc_19';
    var val = 100 * analysis[constit]['election_data'][key];
    var color = party_keys[party]['rgba'] + ',1)';
    data[party] = val;
    colors.push(color);
  }

  var pie = d3.pie()
    .value(function(d) {return d.value; })
  var data_ready = pie(d3.entries(data))

  var color = d3.scaleOrdinal()
    .domain(data)
    .range(colors)

  svg
    .selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(radius/2)         // This is the size of the donut hole
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)
}

