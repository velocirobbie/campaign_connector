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
  link.href = '/' + slug + '/connections';
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
  link.href = '/' + constit.slug;
  para1.appendChild(link)

  let para2 = document.createElement('p');
  para2.setAttribute( 'class', 'result-sub' )
  swing = (constit.swing*100).toFixed(1) + '%'
  info = "swing: " + swing
  if (constit.perc_dist) {
    similarity = (constit.perc_dist).toFixed(0) + '%'
    info += ",  similarity: " + similarity
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
  let para = document.createElement('h6');

  swing = (analysis[slug].swing*100).toFixed(1) + '%'
  let text = (
    "In the 2019 election, Labour vote share fell, with an average swing of -7.9%, " +
    "but performed better with some types of voters than others. " +
    name + " had a " + swing + " labour swing. " +
    name + " " + analysis[slug].message + "<br><br>"
  )
  text += (
    "Below are some constituencies with similar demographic makeups to " + name + ", " +
    "and had a better than average labour swing. " +
    "Click on the constituencies to see their election results, " +
    "get in touch with them to see how they did it!"
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

function set_search_value(slug) {
  name = analysis[slug].name
  let input = document.getElementById("constitInput");
  input.value = name
};


function print_window(message) {
  window.alert(message)
}

