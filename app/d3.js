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


// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#election-bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function party_color(party, year) {
  var rgba = party_keys[party]['rgba']
  var a;
  if (year == '19') {
    a = 1
  } else {
    a = 0.3
  }
  return rgba + ',' + a + ')'
}


function election_bar(constit) {
  var data = [];
  var parties = Object.keys(party_keys);

  var subgroups = ['17', '19']

  for (i = 0; i < parties.length; i++) {
    var party = parties[i];
    var row = {party: party, color:color};
    for (j = 0; j <subgroups.length; j++) {
      var key = party_keys[party]['key']+'_pc_'+subgroups[j];
      var val = 100 * analysis[constit]['election_data'][key];
      var color = party_keys[party]['rgba'] + subgroups[j];
      if (val > 0) {
        row[subgroups[j]] = val
      }
    }
    if (row['19'] > 0) {
      data.push(row)
    }
  }
  console.log(data)

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.party; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  //var color = d3.scaleOrdinal()
  //  .domain(subgroups)
  //  .range(['#e41a1c','#377eb8','#4daf4a'])


  // Add Y axis
  var max_y = 0;
  for (i = 0; i < data.length; i++) {
    for (j = 0; j < subgroups.length; j++) {
      if (data[i][subgroups[j]] > max_y) {
        max_y = data[i][subgroups[j]]
      }
    }
  }

  var y = d3.scaleLinear()
    .domain([0, max_y])
    .range([ height, 0]);

  var div = d3.select("body").append("div")
     .attr("class", "tooltip-bar")
     .style("opacity", 0);

  console.log(data)
  // Bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.party) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {
      key: key,
      value: d[key],
      color: party_color(d.party, key)
    }; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("width", xSubgroup.bandwidth())
      .attr("y", function(d) { return height; })
      .attr("height", function(d) { return 0; })
      .attr("fill", function(d) { return d.color })
    //Our new hover effects
    .on('mouseover', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.7');
          div.transition()
               .duration(50)
               .style("opacity", 1);
          div.html(d.value)
            .style("left",(10) + "px")
            .style("top", (10) + "px");
    })
    .on('mouseout', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1');
          div.transition()
               .duration('50')
               .style("opacity", 0);
    })

  svg.selectAll('rect')
    .transition()
    .duration(1000)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })

  svg
  .attr("transform", `translate(${margin.left},0)`)
    .call(svg => svg.select(".domain").remove())


}
