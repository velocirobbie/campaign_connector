var party_keys = {
  "Labour":{
    'key':'lab',
    'color': 'red',
  },
  "Conservative": {
    'key': 'con',
    'color': 'blue',
  },
  "Lib Dems": {
    'key': 'ld',
    'color': 'orange',
  },
  'UKIP': {
    'key': 'ukip',
    'color': 'purple',
  },
  'Green': {
    'key': 'grn',
    'color': 'snp',
  },
  'Plaid Cymru': {
    'key': 'pc',
    'color': 'green',
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

function election_bar(constit) {
  var data = [];
  var parties = Object.keys(party_keys);

  for (i = 0; i < parties.length; i++) {
    var party = parties[i];
    var key = party_keys[party]['key']+'_pc_19';
    var val = 100 * analysis[constit]['election_data'][key];
    var color = party_keys[party]['color'];
    if (val > 0) {
      data.push({key: party, val: val, color: color})
    }
  }

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.key; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));


  // Add Y axis
  var max_y = 0;
  for (i = 0; i < data.length; i++) {
    if (data[i].val > max_y) {max_y = data[i].val};
  }
  var y = d3.scaleLinear()
    .domain([0, max_y])
    .range([ height, 0]);

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.val); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.val); })
      .attr("fill", function(d) { return d.color })



}
