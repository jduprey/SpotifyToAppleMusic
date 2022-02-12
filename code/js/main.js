var spotify_token = sessionStorage.getItem("spotify.token");

function prompt_user(msg, default_value, storage_name){
    let response = null;
    if( storage_name ){
        response = sessionStorage.getItem(storage_name);
    }
    
    if( !response ){
        response = prompt(msg, default_value);
        if( response && storage_name ){
            sessionStorage.setItem(storage_name, response);    
        }
    }
    return response;
}

function hide_element(id){
    var elt = document.getElementById(id);
    elt.style.display = "none";
}
function show_element(id){
    var elt = document.getElementById(id);
    elt.style.display = "block";
}
function toggle_element_visibility(id) {
    var elt = document.getElementById(id);
    if (elt.style.display === "none") {
        elt.style.display = "block";
    } else {
        elt.style.display = "none";
    }
}

function display_spotify_playlist(playlist){
    var details_elt = document.getElementById("spotify_playlist_details");
    var title_elt = document.getElementById("spotify_playlist_title");
    var owner_elt = document.getElementById("spotify_playlist_owner");
    var followers_elt = document.getElementById("spotify_playlist_followers");
    var cover_elt = document.getElementById("spotify_playlist_cover");
    var tracks_elt = document.getElementById("spotify_playlist_tracks");
    
    title_elt.innerHTML = playlist.name;
    owner_elt.innerHTML = playlist.owner.display_name;
    followers_elt.innerHTML = playlist.followers.total;
    cover_elt.setAttribute('src', playlist.images[0].url);

    // Tracks
    tracks_html = "<tr> <th>#</th> <th></th> <th>Song</th> <th>Album</th> <th>Artist</th> </tr>\n"

    for( i = 0; i < playlist.tracks.items.length; i++){
        track = playlist.tracks.items[i].track;
        tracks_html += "<tr> " + 
            "<td>" + i + "</td>" + 
            "<td><img src='" + track.album.images[track.album.images.length - 1].url + "'/></td>" + 
            "<td>" + track.name + "</td>" + 
            "<td>" + track.album.name + "</td>" + 
            "<td>" + track.artists[0].name + "</td>" + 
            "</tr>\n";
    }

    tracks_elt.innerHTML = tracks_html;
    
    show_element("spotify_playlist_details");
}

function load_spotify_playlist(event, id){
    var elt = document.getElementById(id);
    let url = new URL(elt.value);
    // https://open.spotify.com/playlist/1EFKDUrhkRiJB5oJ8Dp0ni?si=6797b8706a6044a9
    // spotify_playlist_id = url.split("/")[4].split('?')[0];
    spotify_playlist_id = url.pathname.split("/").pop();
    
    get_playlist(spotify_playlist_id, spotify_token)
        .then( function(response){
            display_spotify_playlist(response);
        });

    return false; // to cancel form submission
}

function init(){

    // get client ID and Secret
    let client_id = prompt_user("Please enter spotify client id: ", "", "spotify.client_id");
    let client_secret = prompt_user("Please enter spotify client secrete: ", "", "spotify.client_secret");

    if( !spotify_token ){
        get_access_token(client_id, client_secret)
        .then( function(result){ 
            spotify_token = result.access_token;
            sessionStorage.setItem("spotify.token", spotify_token);
            show_element("app_section");
            hide_element("status");
        });
    }
    else{
        show_element("app_section");
        hide_element("status");
    }
    
}