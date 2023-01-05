
//let analysis_json = '{"E14000754": {"name": "Houghton and Sunderland South"}, "E14000831": {"name": "Newcastle Upon Tyne Central"}}'
//const analysis = JSON.parse(analysis_json);

/*
console.log('here1');
var analysis = fetch('http://localhost:5000/data')
  .then((response) => response.json())
  .then((responseJSON) => {
       // do stuff with responseJSON here...
       console.log(responseJSON);
  });

async function getData(url){
    const response = await fetch(url);
    var data = await response.json();
}
*/
/*
function readJsonFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
          var jsonData = JSON.parse(rawFile.responseText);
          callback(jsonData)
        }
    }
    rawFile.send(null);
}

readJsonFile('data', console.log)
console.log('here2');
*/

const constit_slugs = Object.keys(analysis)
const constit_names = []

load()

function load() {
  for (i = 0; i < constit_slugs.length; i++) {
    name = analysis[constit_slugs[i]].name;
    constit_names.push(name);
  }
}

function constit_map(key, match_list, target_list) {
  for (i =0; i < constit_keys.length; i++) {
    if (key == match_list[i]) {
      return target_list[i];
    }
  }
  return 'not found';
}

function appendConstit(div, name, slug) {
  var link = document.createElement("a");
  link.value = name;
  link.innerHTML = name;
  link.id = slug;
  link.href = slug + '/connections';
  link.style.display = '';

  div.appendChild(link);
}

function appendDummyConstit(div) {
  var link = document.createElement("a");
  link.innerHTML = '...';
  link.style.display = '';
  div.appendChild(link);
}


function showConstitDropdown() {
  div = document.getElementById("constitDropdown");
  for (i = 0; i < constit_names.length; i++) {
    appendConstit(div, constit_names[i], constit_slugs[i])
  }
}

var input = document.getElementById("constitInput");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let div = document.getElementById("constitDropdown");
    let links = div.getElementsByTagName("a");
    links[0].click();
  }
});

function clearDropdown() {
  let div = document.getElementById("constitDropdown");
  let links = div.getElementsByTagName("a");

  while (links[0]) {
      links[0].parentNode.removeChild(links[0]);
  }
}

function filterconstits() {
  let input, filter, link, i;
  let max_to_show = 5;
  let count = 0;

  clearDropdown()
  input = document.getElementById("constitInput");
  div = document.getElementById("constitDropdown");

  filter = input.value.toUpperCase();

  if (filter.length == 0) return 0;

  for (i = 0; i < constit_names.length; i++) {
    name = constit_names[i]
    slug = constit_slugs[i]
    if (name.toUpperCase().indexOf(filter) > -1) {
      // if more to show than allowed
      if (count >= max_to_show) {
        appendDummyConstit(div)
        break;
      }
      appendConstit(div, name, slug)
      count += 1
    }
  }
}


function displayResultConstit(constit) {
  let div = document.createElement('div');
  div.setAttribute( 'class', 'result-box' )

  let para1 = document.createElement('p');
  para1.setAttribute( 'class', 'result-header' )
  let link = document.createElement('a');
  link.innerHTML = analysis[constit.slug].name
  link.href = '../' + constit.slug;
  para1.appendChild(link)

  let para2 = document.createElement('p');
  para2.setAttribute( 'class', 'result-sub' )
  swing = (constit.swing*100).toFixed(1) + '%'
  info = "swing: " + swing
  if (constit.perc_dist) {
    similarity = (constit.perc_dist).toFixed(0) + '%'
    info += "    similarity: " + similarity
  }
  para2.innerHTML = info

  div.appendChild(para1)
  div.appendChild(para2)

  return div
}


function load_constit(slug) {
  let name = analysis[slug].name;
  let results = document.getElementById("results");

  // header
  let para = document.createElement('p');

  swing = (analysis[slug].swing*100).toFixed(1) + '%'
  let text = (
    "In the 2019 election, " + name + " had a " + swing + " labour swing, " +
    "compared to a national average of -7.9%.<br>" + 
    name + " " + analysis[slug].message + " "
  )
  text += (
    "Check out these other constituencies which had better than average labour swings " +
    "and are similar demographics to " + name + "."
  )
  para.innerHTML = text
  results.appendChild(para);

  // results
  results.appendChild(displayResultConstit(analysis[slug]));
  for (i = 0; i < analysis[slug].connections.length; i++) {
    constit = analysis[slug].connections[i];
    results.appendChild(displayResultConstit(constit));
  }

};



function print_window(message) {
  window.alert(message)
}

