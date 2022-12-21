
let analysis_json = '{"E14000754": {"name": "Houghton and Sunderland South"}, "E14000831": {"name": "Newcastle Upon Tyne Central"}}'
const analysis = JSON.parse(analysis_json);
const constit_keys = Object.keys(analysis)
const constit_names = []

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
    constit_names.push(analysis[constit_keys[i]].name)
  }
}

function appendConstit(div, name) {
  var link = document.createElement("a");
  link.value = name;
  link.innerHTML = name;
  link.id = slugify(name);
  link.href = '#'+name;
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

/*
var input = document.getElementById("constitInput");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("constitDropdown").classList.toggle("show");
  }
});
*/

function clearDropdown() {
  let div = document.getElementById("constitDropdown");
  let links = div.getElementsByTagName("a");
  console.log(links)

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

function function1() {
  document.getElementById("temp-para").innerHTML = "Paragraph changed.";
}

function print_window(message) {
  window.alert(message)
}

