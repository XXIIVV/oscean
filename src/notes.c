#define audio_path "audio"
#define SENDNAME(id, text) ("<a href='" id ".html'>" text "</a>")
add_text(&audio, "hello there, here is a link: " SENDNAME(audio_path, "linktext") ".");


#define LINK(id) ("<a href='" link_id "'>" link_id "</a>")
#define LINKNAME(id, name) ("<a href='" linkname_id "'>" linkname_name "</a>")
#define SEND(id) ("<a href='" send_id ".html'>" send_id "</a>")
#define SENDNAME(id, text) ("<a href='" sendname_id ".html'>" sendname_text "</a>")

// printf("link: %s\n", LINK(some_id, some_name));

Term home = create_term("home", "some brief description.");

#define audio_id "audio"
#define audio_path "audio"
#define audio->path "audio"

// Term audio = create_term("audio", "Some brief description.");
add_text(&audio, "hello there, here is a link: " audio->path ".");
// add_link(&audio, "github", "http://");
// add_child(&home, &audio);
// add_tag(&audio, "special");



#define audio_path "audio"
#define SENDNAME(id, name) ("<a href='"#id".html'>"#name"</a>")
add_text(&audio, "hello there, here is a link: " SENDNAME(audio_path, "linktext") ".");