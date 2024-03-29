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
  let link = document.createElement('a');
  link.href = '/' + constit.slug + '/info';
  link.setAttribute('style', 'text-decoration: none')

  let div = document.createElement('div');
  div.setAttribute( 'class', 'result-box' )

  let div_words = document.createElement('div');
  div_words.setAttribute( 'class', 'result-words' )

  let div_pie = document.createElement('div');
  div_pie.setAttribute( 'class', 'result-pie' )

  let para1 = document.createElement('p');
  para1.setAttribute( 'class', 'result-header' )
  para1.innerHTML = analysis[constit.slug].name

  let para2 = document.createElement('p');
  para2.setAttribute( 'class', 'result-sub' )
  swing = (constit.swing*100).toFixed(1) + '%'
  info = "swing: " + swing
  if (constit.perc_dist) {
    similarity = (constit.perc_dist).toFixed(0) + '%'
    info += "<br>similarity: " + similarity
  }
  para2.innerHTML = info

  let pie = document.createElement('div');
  pie_name = 'result-pie-' + constit.slug
  pie.setAttribute( 'id', pie_name)

  div_pie.appendChild(pie)
  div_words.appendChild(para1)
  div_words.appendChild(para2)

  div.appendChild(div_words)
  div.appendChild(div_pie)
  link.appendChild(div)

  return link
}

function load_constit_title(slug) {
  let title = document.getElementById("constit-title");
  title.innerHTML = analysis[slug].name;
}


function display_swing(slug) {
  swing = (analysis[slug].swing*100).toFixed(1)
  if (swing > 0) {
    swing = '+' + swing
  }
  return swing + '%'
}



function load_constit(slug) {
  let name = analysis[slug].name;
  let results = document.getElementById("results");

  swing = display_swing(slug)
  let text1 = (
    "In the 2019 election, Labour vote share fell with an average swing of -7.9% across the UK."
  )
  let text2 = (
    name + " had a " + swing + " Labour swing. " +
    name + " " + analysis[slug].message +
    " Below are some constituencies with similar demographic make up to " + name +
    " who also did better than average."
  )
  let text3 = (
    "For each constituency you can see the <b>swing</b> to or away " +
    "from Labour, and the demographic <b>similarity</b> to " + name + " demographic."
  )
  let text4 = (
    "<b>Click on the constituencies below</b> to see their election results, " +
    "find out how to get in touch with them to see how they did it!"
  )
  let paras = [text1, text2, text3, text4]
  for (i = 0; i < paras.length; i++) {
    let para = document.createElement('h6');
    para.innerHTML = paras[i]
    results.appendChild(para);
  }

  // results
  results.appendChild(displayResultConstit(analysis[slug]));
  election_pie(slug, 'result-pie-'+slug);
  let para2 = document.createElement('h4');
  para2.id = 'connections-title';
  para2.innerHTML = "Connections";
  results.appendChild(para2);

  for (i = 0; i < analysis[slug].connections.length - 2; i++) {
    constit = analysis[slug].connections[i];
    results.appendChild(displayResultConstit(constit));
    pie_name = 'result-pie-' + constit.slug;
    election_pie(constit.slug, pie_name);
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




function result_summary(slug) {
  let name = analysis[slug].name;
  let div = document.getElementById("constit-result-description")
  let para = document.createElement('h6');

  swing = display_swing(slug)

  let text = (
    "In the 2019 election,  " + name + " had a Labour swing of " + swing + '. ' +
    name + " " + analysis[slug].message
  )
  para.innerHTML = text
  div.appendChild(para);
}


function get_twitter_link(twitter, name) {
  if (twitter != 'not found') {
    link = (
      'Twitter:  <a class="red" href="https://mobile.twitter.com/' + twitter +
      '" target="_blank" rel="noopener noreferrer">' +
      '<i class="fa fa-twitter"></i>' + twitter + '</a>'
    )
  } else {
    search_term = name.replaceAll(' ', '+') + '+CLP'
    console.log(name, search_term);
    link = '<a class="red" href="https://www.google.com/search?q=' + search_term + '"' +
      '" target="_blank" rel="noopener noreferrer">' +
      'Find their CLP'
  }
  return link
}



function constit_details(slug) {
  let name = analysis[slug].name;
  let title = document.getElementById("constit-title")

  let twitter = analysis[slug].twitter;
  let twitter_link = get_twitter_link(twitter, name);
  
  let contact_block = document.getElementById("contact-info")
  let contact_blurb = document.createElement('h4')
  let contact_info = document.createElement('h4')
  let constit_connections = document.createElement('h4')

  contact_blurb.innerHTML = (
    "Get in touch with " + name + " CLP. Find out more about how they " +
    "campaigned in the last election!<br>"
  )
  contact_info.innerHTML = (
    twitter_link
  )
  constit_connections.innerHTML = (
    'See the constituency <a class="red" href="/' + slug + '/connections"> ' + 'connections</a> '+
    'for this constituency.'
  );

  contact_block.appendChild(contact_blurb)
  contact_block.appendChild(contact_info)
  contact_block.appendChild(constit_connections);
}

