
#define audio_path "audio"
#define SENDNAME(id, text) ("<a href='" id ".html'>" text "</a>")
add_text(&audio, "hello there, here is a link: " SENDNAME(audio_path, "linktext") ".");


add_text(&audio, "hello there, here is a link: " "<a href='"#id".html'>"#name"</a>" ".");

add_text(&audio, "hello there, here is a link: " "<a href='audio.html'>linktext</a>" ".");

