
let analysis_json = '{"E14000754": {"name": "Houghton and Sunderland South"}, "E14000831": {"name": "Newcastle Upon Tyne Central"}}'
const analysis = JSON.parse(analysis_json);
const constit_keys = Object.keys(analysis)
const constit_names = []
const constit_slugs = []

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

load()
console.log(analysis)
console.log(constit_keys)
console.log(constit_names)


function load() {
  for (i = 0; i < constit_keys.length; i++) {
    name = analysis[constit_keys[i]].name;
    constit_names.push(name);
    constit_slugs.push(slugify(name));
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

function appendConstit(div, name) {
  var link = document.createElement("a");
  link.value = name;
  link.innerHTML = name;
  link.id = slugify(name);
  link.href = '#'+slugify(name);
  link.style.display = '';

  div.appendChild(link);
}

function showConstitDropdown() {
  console.log('hello')
  div = document.getElementById("constitDropdown");
  for (i = 0; i < constit_names.length; i++) {
    appendConstit(div, constit_names[i], i)
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

  clearDropdown()
  input = document.getElementById("constitInput");
  div = document.getElementById("constitDropdown");

  filter = input.value.toUpperCase();

  if (filter.length == 0) return 0;

  for (i = 0; i < constit_names.length; i++) {
    name = constit_names[i]
    if (name.toUpperCase().indexOf(filter) > -1) {
      appendConstit(div, name)
    }
  }
}

function hashChange() {
  console.log('here');
  document.getElementById("temp-para").innerHTML = window.location.hash;
  clearDropdown();
  document.getElementById("constitInput").value = constit_map(
    window.location.hash.slice(1), constit_slugs, constit_names
  );
};



function print_window(message) {
  window.alert(message)
}

