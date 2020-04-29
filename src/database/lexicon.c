// Macros

#define LINK(link_id) "{" link_id "}"
#define LINKNAME(linkname_id, linkname_name) "{" linkname_id " " linkname_name"}"
#define SEND(send_id) "{" send_id "}"
#define SENDNAME(sendname_id, sendname_text) "{" sendname_id " " sendname_text "}"
#define IMAGE(folder, name) "<img src='../media/" folder "/" name "'/>"
#define QUOTE(text, source) "<q>" text "</q><h5>—" source "</h5>"
#define MODITCHIO(itchio_id) "\n    {^itchio " itchio_id "}\n    "
#define MODBANDCAMP(bandcamp_id) "\n    {^bandcamp " bandcamp_id "}\n    "
#define MODYOUTUBE(youtube_id) "\n    {^youtube " youtube_id "}\n    "
#define REDIRECT(target) "\n    {^redirect " target "}\n    "
#define MODFRAME(frame_id) "<iframe width='100%' height='380' src='" frame_id "' style='border:0' allowfullscreen></iframe>"



// #define LINK(link_id) "<a href='" link_id "' class='external' target='_blank'>"link_id"</a>"
// #define LINKNAME(linkname_id, linkname_name) "<a href='" linkname_id "' class='external' target='_blank'>"linkname_name"</a>"
// #define SEND(send_id) "<a href='" send_id ".html'>" send_id "</a>"
// #define SENDNAME(sendname_id, sendname_text) "<a href='" sendname_id ".html'>" sendname_text "</a>"
// #define IMAGE(folder, name) "<img src='../media/" folder "/" name "'/>"
// #define QUOTE(text, source) "<q>" text "</q><h5>—" source "</h5>"
// #define MODITCHIO(itchio_id) "<iframe frameborder='0' src='https://itch.io/embed/" itchio_id "?link_color=000000' width='600' height='167'></iframe>"
// #define MODBANDCAMP(bandcamp_id) "<iframe style='border: 0; width: 600px; height: 274px;' src='https://bandcamp.com/EmbeddedPlayer/album=" bandcamp_id "/size=large/bgcol=ffffff/linkcol=333333/artwork=small/transparent=true/' seamless></iframe>"
// #define MODYOUTUBE(youtube_id) "<iframe width='100%' height='380' src='https://www.youtube.com/embed/" youtube_id "?rel=0' style='max-width:700px' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>"
// #define MODFRAME(frame_id) "<iframe width='100%' height='380' src='" frame_id "' style='border:0' allowfullscreen></iframe>"
// #define REDIRECT(target) "<meta http-equiv='refresh' content='2; url=" target ".html' /><p>In a hurry? Click <a href='" target ".html'>here</a>.</p>"




// Terms

Term home = create_term(NULL, "home", "", 
  IMAGE("identity", "orb.png")
  "<p>See {tracker recent changes}.</p>");

Term audio = create_portal(&home, "audio", "The Audio portal hosts various soundtrack, records and live projects.", NULL);

Term visual = create_portal(&home, "visual", "The Visual hosts design and interaction projects.", NULL);

Term research = create_portal(&home, "research", "The Research hosts philosophy and linguistics projects.", NULL);

Term about = create_album(&home, "about", "This wiki is a digital playground and personal logging system.", 
  "<p>The aim of this wiki is to build a form of <b>personal assistant</b> to help with the management of a vast repository of recorded statistics which includes " SENDNAME("tracker", "daily logs") ", notes on " SENDNAME("journal", "various projects") " and " SENDNAME("mirrors", "curated pages of general knowledge") ".</p>"
  "<p>{Oscean} is written in {https://en.wikipedia.org/wiki/C99 C99}, and designed to operate on " SENDNAME("hardware", "low-power devices") ". It is built to adapt to my needs as they change, and to " SENDNAME("longtermism", "technology as it evolves") ".</p>"
  "<p>Each part of this project should aim to persist across " SENDNAME("longtermism", "Technological Long Term") ", not one part of it should rely on heavy dependencies. — Every function should be <b>specific</b>, <b>unobfuscated</b>, and each one carefully chosen against general-purpose libraries, frameworks or wasteful foreign entities.</p>"
  "<p>Using this tool should be <b>frictionless and undisruptive</b>, its formats and subsequent products versionable, re-purposable, interpretable and text-editable. Only through <b>open sources, open standards, human-readable formats</b> and their independencies, might they survive this fleeting age of self-destructing informatics.</p>"
  "<p>These attributes should not only be <b>perceptible in its design</b>, <br />but deeply <b>rooted in its code</b>.</p>"
  "<p>This type of website is a often referred to as a \"memex\", a kind of archive and mirror of everything that one has done, that one has learnt. It's a living document that outlines where one has been, and a tool that advises where one could go.</p>"
  QUOTE("Consider a future device, a sort of mechanized private library in which an individual stores all his books, records, and communications, and which may be consulted with exceeding speed and flexibility. It is an enlarged intimate supplement to his memory.", "Vannevar Bush, As We May Think")
  "<h3>License</h3>"
  "<p>The license applies to all the <b>documented projects, the projects themselves and their assets</b>. The " LINKNAME("http://github.com/XXIIVV/Oscean", "platform code") " is under the <b>MIT License</b>. The " LINKNAME("https://creativecommons.org/licenses/by-nc-sa/4.0/", "assets and text content") " is under the <b>BY-NC-SA4.0 License</b>.</p>"
  "<p><i>You are free to</i>: <b>Share</b>: copy and redistribute the material in any medium or format. <b>Adapt</b>: remix, transform, and build upon the material.</p>"
  "<p><i>Under the following terms</i>: <b>Attribution</b>: You must give appropriate credit. <b>NonCommercial</b>: You may not use the material for commercial purposes. <b>ShareAlike</b>: You must distribute your contributions under the same license.</p>"
  "<p>You can learn more about the " SENDNAME("oscean", "related tools") " by visiting the " SEND("nataniev") " portal, or by reading the " SEND("faqs") ". You can download a copy of the entire website content and sources as a " LINKNAME("https://github.com/XXIIVV/Oscean/archive/master.zip", ".zip") ".</p>"
  "<p>If you have any <b>question or feedback</b>, please submit a " LINKNAME("https://github.com/XXIIVV/Oscean/issues/new", "bug report") ", for any additional informations, contact " SENDNAME("devine_lu_linvega", "Devine Lu Linvega") ". </p>"
  );
add_link(&about, "source files", "https://github.com/XXIIVV/Oscean");
add_link(&about, "rss feed", "https://wiki.xxiivv.com/links/rss.xml");
add_link(&about, "activitypub", "https://bots.tinysubversions.com/u/neauoire/");

Term notebook = create_portal(&research, "notebook", "From the Notebook.",
  "<p>The <b>Notebook</b> is a collection of scribbles on various topics that have yet to find themselves permanently included in the " SENDNAME("oscean", "wiki") ".</p>"
  "<p>Are you looking for the " SEND("sketchbook") "?</p>");

Term alicef = create_index(&audio, "alicef", "Alicef, is an livecoding audio and visual project built around Orca.", 
  "<p><b>Alicef</b> is a fragment of " SEND("aliceffekt") "'s diary, exploring " SENDNAME("dinaisth", "similar spaces") ", but focusing on the aesthetics of pattern & repetition.</p>"
  "<p>This livecoding project uses a combination of " SEND("orca") " and " SEND("enfer")", and is created to be mostly a performance project, there are currently no releases available for the <b>Alicef</b> project, only a handful of " LINKNAME("https://www.youtube.com/watch?v=hQXa6TkSeH0", "demos") ".</p>"
  MODYOUTUBE("hQXa6TkSeH0"));

Term aliceffekt = create_index(&audio, "aliceffekt", "Aliceffekt, is an audio project following the adventures of Neonev across Dinaisth.",
  "<p>A travel across the fictional worlds of the " SEND("neauismetica") " where every album is a sort of travel diary across the " SEND("dinaisth") " landscape.</p>");
add_link(&aliceffekt, "bandcamp", "https://aliceffekt.bandcamp.com");

Term hundred_rabbits = create_album(&about, "hundred rabbits", "Hundred Rabbits is a design studio on a sailboat.", 
  "<p>This partnership is host to interactive projects like " SEND("oquonie") ", " SEND("grimgrains") " and " LINKNAME("https://www.youtube.com/channel/UCzdg4pZb-viC3EdA1zxRl4A?view_as=subscriber", "travel diaries") ".</p>"
  "<p>The name <i>Hundred Rabbits</i> comes from the name of the sailboat in the Japanese animated show " LINKNAME("http://ergoproxy.wikia.com/wiki/Dead_Calm_", "Ergo proxy") ", while the sailboat's name " SEND("pino") " comes from that of an android sailor from that same show.</p>");
add_link(&hundred_rabbits, "patreon", "https://patreon.com/100");
add_link(&hundred_rabbits, "twitter", "https://twitter.com/hundredrabbits");

Term pino = create_album(&hundred_rabbits, "pino", "Pino is a Yamaha 33 sailboat built in 1982.", 
  "<p>Purchased in 2016, on Vancouver Island, <b>Pino</b> has since sailed across the " SENDNAME("marquesas", "Pacific Ocean") ". We maintain a list of " LINKNAME("http://github.com/hundredrabbits/pino", "technical details") ", and our current position can be accessed through our " LINKNAME("http://100r.co/live", "tracker") ".</p>"
  "<p>If you are interested in learning about the " SENDNAME("nomad", "digital-nomad") " lifestyle, have a look at the " LINKNAME("http://100r.co/", "Hundred Rabbits Website") ". We have a lot of " SEND("raspberry") "-powered devices onboard, learn more about our " SENDNAME("media_station", "media station") " and " SENDNAME("radio_station", "radio station") ".</p>"
  QUOTE("There's no such thing as bad weather, only inappropriate clothing.", "Linda Geddes, Living without artificial light"));
add_dict(&pino, &pino_details);
add_link(&pino, "details", "http://github.com/hundredrabbits/pino");
add_link(&pino, "patreon", "https://patreon.com/100");

Term rekka = create_album(&hundred_rabbits, "rekka", "Rekka Bellum, is an illustrator and writer.", 
  "<p><b>Rekka</b> is the co-founder of " SEND("drownspire") " and " SENDNAME("hundred_rabbits", "hundred rabbits") ".</p>"
  "<p>" SENDNAME("devine lu linvega", "Devine") " and " SEND("rekka") " collaborated on projects like " SEND("oquonie") ", " SEND("grimgrains") ", " SEND("thousand_rooms") " and " SEND("paradise") ".</p>");
add_link(&rekka, "website", "http://kokorobot.ca/");

Term grimgrains = create_album(&hundred_rabbits, "grimgrains", "Grimgrains is the Hundred Rabbits food and cooking resources site.", 
  "<p>Started in the fall of 2014, the goal of the site is to document interesting " SENDNAME("nutrition", "foods") " and " SEND("lifestyle") " experiments.</p>"
  "<p>A collection of notes on cooking tools is also maintained " LINKNAME("https://grimgrains.com/Tools", "here") ".</p>");
add_link(&grimgrains, "twitter", "https://twitter.com/grimgrains");
add_link(&grimgrains, "live", "https://grimgrains.com");
add_link(&grimgrains, "sources", "https://github.com/hundredrabbits/Grimgrains");

Term wiktopher = create_term(&hundred_rabbits, "wiktopher", "Wiktopher is an upcoming travel novel by Rekka Bellum.",
  "<p><b>Wiktopher</b> tells the travel stories of Lupin, who fell from one of the three great cities erected on the backs of desert walkers; and Eka, a creature of wonder and of seemingly, infinite kindness and curiosity.</p>"
  "<p>Together, they learn the innumerable ways of the world, traversing deserts and villages, meeting their inhabitants and discovering their customs.</p>"
  "<p>The novel is written <i>entirely without genders</i>, and will be released as audiobooks, ebooks and paperbacks.</p>");
add_link(&wiktopher, "read online", "http://wiktopher.kokorobot.ca");
add_link(&wiktopher, "about the author", "https://twitter.com/RekkaBell");

Term drownspire = create_portal(&hundred_rabbits, "drownspire", "Drownspire was the name of an online store founded with Rekka Bellum, back in 2009.", 
  "<p>Our goals then, fueled what is now " SENDNAME("hundred_rabbits", "hundred rabbits") ". We distributed the " SEND("vambits") " designer toys and published the " SEND("merure") " books.</p>");

Term merure = create_term(&drownspire, "merure", "The Merure books, were a series of comics published with friends.", NULL);
add_link(&merure, "itunes", "https://itunes.apple.com/nz/book/merure/id888164293");

Term vambits = create_term(&drownspire, "vambits", "Vambits are small DIY desktoys designed to be laser cut in acrylic.",
  "<p>The product was initially created with " LINKNAME("https://www.ponoko.com", "Ponoko") " but is now produced by our friends at " LINKNAME("https://twitter.com/skogrstudio", "Skógr Studio") ".</p>"
  "<p>The templates are free and open-source if you want to create your own faces and custom accessories! Send us " LINKNAME("https://twitter.com/search?q=%23vambits", "your pictures") " if you do.</p>"
  "<p>The design stolen and sold by various resellers on Esty and in stores in Australia — Please do not support them.</p>");
add_link(&vambits, "sources", "https://github.com/hundredrabbits/Vambits");

Term illustration = create_portal(&visual, "illustration", "A collection of Illustration projects.", 
  "<p>The <b>Illustration portal</b> forks into the worlds of the " SEND("nereid") ", " SENDNAME("polygonoscopy", "Polygonoscopic") " and " SEND("neauismetic") " Collections.</p>");

Term beldam_records = create_portal(&audio, "beldam records", "Beldam Records is a netlabel releasing 4 tracks mini-albums.", 
  "<p>" SEND("beldam_records") " was initiated as an alternative channel for non-" SEND("aliceffekt") " releases, focusing on IDM textures and lowfi techno.</p>");
add_link(&beldam_records, "bandcamp", "https://beldamrecords.bandcamp.com");
add_link(&beldam_records, "twitter", "https://twitter.com/beldamrecords");

Term ten_axitecture = create_term(&beldam_records, "ten axitecture", "Ten Axitecture is a Beldam Records release by Aliceffekt.",
  "<p>Three of the four tracks names are that of different fictional worlds that have inspired the " SEND("aliceffekt") " narrative.</p>"
  "<p>Eudoxie from Calvino's Invisible Cities, Borges' Tlon and Schuiten's Citees Obscures.</p>"
  MODBANDCAMP("202709164"));
add_link(&ten_axitecture, "bandcamp", "https://aliceffekt.bandcamp.com/album/ten-axitecture");

Term miniscopie = create_term(&beldam_records, "miniscopie", "Miniscopie is a Beldam Records release, by Reine.",
  "<p>Written by " LINKNAME("http://noirmirroir.com", "Reine") ", this album combines ambient and deep IDM flavoured sounds. The album is the first music release from Elodie, who also created the " SEND("vast") " book.</p>"
  MODBANDCAMP("2603579101"));
add_link(&miniscopie, "bandcamp", "https://beldamrecords.bandcamp.com/album/miniscopie");
add_link(&miniscopie, "itunes", "https://itunes.apple.com/us/album/miniscopie-ep/id956624857");

Term ramiel = create_term(&beldam_records, "ramiel", "Ramiel is a Beldam Records release, by Villa Moirai.", 
  "<p>Written by " LINKNAME("https://beldamrecords.bandcamp.com", "Villa Moirai") ", this album is an even mixture and techno and idm.</p>"
  "<p>The album name and cover are a tribute to the geometric angel of the Evangelion anime series.</p>"
  MODBANDCAMP("2641389031"));
add_link(&ramiel, "bandcamp", "https://beldamrecords.bandcamp.com/album/ramiel");
add_link(&ramiel, "itunes", "https://itunes.apple.com/us/album/ramiel-ep/id958562173");

Term eschatolor = create_term(&beldam_records, "eschatolor", "Eschatolor is an ambient Beldam Records release that was recorded over the FM airwaves.",
  "<p>Written by Катя Тевелизион, this album was inspired from Russian number stations.</p>"
  MODBANDCAMP("4198794205")
  "<p>It was recorded playing through the FM band, from the " SEND("elfi") " 103.0Mhz pirate radio station in Montreal, giving it its texture and warmth.</p>");
add_link(&eschatolor, "bandcamp", "https://tevelision.bandcamp.com/album/eschatolor");
add_link(&eschatolor, "itunes", "https://itunes.apple.com/ca/album/eschatolor/id1000241341");

Term efli = create_term(&eschatolor, "efli", "Efli, 103.0FM, was a pirate radio broadcast, available from Montreal downtown area.",
  "<p>The radio started broadcasting on May 20th 2015, between 22:00 and 6:00, and stopped transmitting on December 20th. It played various permutations of the " SEND("eschatolor") " album.</p>");

Term looking_glace = create_term(&beldam_records, "looking glace", "Looking Glace is a Beldam Records release, by Reine.", 
  "<p>Painting a harsher, and more complete picture of her acoustic universe where the liquid sounds and suffocating vocoder are incessantly present.</p>"
  MODBANDCAMP("3852327660"));
add_link(&looking_glace, "bandcamp", "https://beldamrecords.bandcamp.com/album/looking-glace");
add_link(&looking_glace, "itunes", "https://itunes.apple.com/ca/album/looking-glace-ep/id1034127266");

Term verreciel_soundtrack = create_term(&beldam_records, "verreciel soundtrack", "The Verreciel Soundtrack is a Beldam Records release, by Aliceffekt.",
  MODBANDCAMP("453554387"));
add_link(&verreciel_soundtrack, "bandcamp", "https://aliceffekt.bandcamp.com/album/verreciel");

Term getapan_728k = create_term(&beldam_records, "getapan 728k", "Getapan 728k is a Beldam Records release.", 
  "<p>This new release explores a region of frigid dubs yet uncharted by " SEND("beldam_records") ". Not much is known about 死サイコロ, their name is <i>Shi Seikoro</i>, or <b>Death Dice</b>.</p>"
  MODBANDCAMP("1677022414"));
add_link(&getapan_728k, "bandcamp", "https://beldamrecords.bandcamp.com/album/728k");

Term azolla = create_term(&alicef, "azolla", "Azolla is a Beldam Records release, by Alicef.",
  "<p>" SEND("azolla") " is a research project involving composition and development, with the purpose of creating a catalog of works written entirely using " SENDNAME("tools", "homebrew tools") " like " SEND("orca") " and " SEND("enfer") ".</p>"
  "<p>The track can be downloaded " LINKNAME("https://aliceffekt.bandcamp.com/album/Azolla", "here") ".</p>"
  MODYOUTUBE("9FPrPgOQqZg"));
add_link(&azolla, "sources", "https://github.com/neauoire/alicef");
add_link(&azolla, "live", "https://beldamrecords.bandcamp.com/album/azolla");
add_link(&azolla, "video", "https://www.youtube.com/watch?v=9FPrPgOQqZg");

Term malice = create_portal(&audio, "malice", "Malice tells the earlier tales of Neonev as she crossed the Kanikule ocean.", 
   "<p>The Malice logo(害意) was designed by {http://visualscream.net Jan Vranovský}.</p>");
add_link(&malice, "bandcamp", "https://gaii.bandcamp.com/");

Term collected_works = create_term(&malice, "collected works", "Collected Works between 2008 and 2015, written as Malice.", 
  "<p>This release includes the complete <b>Storm Transit record</b>, hidden " SEND("malice") " tracks from " SEND("aliceffekt") " releases and the " SEND("merveilles") " soundtrack.</p>"
  MODBANDCAMP("2256825333"));
add_link(&collected_works, "bandcamp", "https://gaii.bandcamp.com/");

Term nereid = create_portal(&illustration, "nereid", "Nereid is a dull grey moon.", 
  "<p>The soil is mostly " SENDNAME("polygonoscopy", "Polygonoscopic") " diamonds, and the lack of atmosphere leaves the surface of the moon, quiet. Pigments, illegal.</p>");

Term beauty = create_album(&nereid, "beauty", "The Beauty series is a collection of portraits from the beautiful inhabitants of Nereid.", NULL);

Term serventines = create_album(&nereid, "serventines", "Serventines is a travel diary from travels across Nereid.", NULL);

Term polygore = create_album(&nereid, "polygore", "Polygore are the base elements Nereid.",
  "<p>The beautifuly corrupted and polygons of of " SEND("nereid") ".</p>");

Term pearls = create_album(&nereid, "pearls", "The Pearls are polygonoscopies of Nereid.", 
  "<p>The pearls of " SEND("nereid") " lead to the discovery of the " SENDNAME("polygonoscopy", "Polygonoscopic") " world.</p>");

Term physical = create_portal(&visual, "physical", "These Physical objects are designed to be 3d printed.", NULL);
add_link(&physical, "downloads", "http://www.thingiverse.com/Aliceffekt/designs");

Term occulter = create_album(&physical, "occulter", "Occulter is a shape inspired by the logo of a boutique I like.", 
  "<p>The NYC boutique <b>Occulter</b> has since closed.</p>");

Term hex_hive_necklace = create_album(&physical, "hex hive necklace", "The Hex Hive Necklace is small designer necklace.", NULL);
add_link(&hex_hive_necklace, "sources", "http://www.thingiverse.com/thing:18853");

Term victorian_punch = create_album(&physical, "victorian punch", "The Victorian Punch is a knuckle weapon.", NULL);
add_link(&victorian_punch, "sources", "http://www.thingiverse.com/thing:18853");

Term polygonoscopy = create_portal(&illustration, "polygonoscopy", "Polygonoscopy is a series of abstract videographies, recorded with the Kaleidoscope.", NULL);

Term methascope = create_album(&polygonoscopy, "methascope", "Frozen Methascope drops, similar to snowflakes.", 
  "<p>At its smallest scale, the " SEND("methascope") " unfolds as the " SENDNAME("ar_moire", "Ar Moires") ".</p>");

Term kaleidoscope = create_album(&polygonoscopy, "kaleidoscope", "The Kaleidoscope records the intersection of overlapping structures.", 
  "<p>Nothing is as reassuring as looking through the " SENDNAME("polygonoscopy", "Polygonoscope") " and seeing everything is where you left it.</p>");

Term hypervoid = create_album(&polygonoscopy, "hypervoid", "The Hypervoid is navigating the nullplane of dichromatic Anti-pigments.", 
  "<p>The  pieces were selected to be on the cover of the second volume of the " LINKNAME("http://issuu.com/independenceamazing/docs/amaze_screen", "Amaze Newspaper") ".</p>");

Term brane = create_album(&polygonoscopy, "brane", "Brane are digital fabrics.", 
  "<p>This " SENDNAME("polygonoscopy", "Polygonoscopic") " collection of large " SENDNAME("nervous", "Nervous Systems") " was exposed at the MIGS gallery on november 10th 2014.</p>");

Term astratas = create_album(&polygonoscopy, "astratas", "The Astratas topology oscillates to Polygonoscopic frequencies.", 
  QUOTE("The Art of Cartography attained such Perfection that the map of a single Province occupied the entirety of a City, and the map of the Empire, the entirety of a Province.", "Jorge Luis Borges, On Rigor in Science"));

Term ar_moire = create_album(&polygonoscopy, "ar moire", "The Ar Moire diagrams are Polygonoscopic sounds.", NULL);

Term nervous = create_album(&polygonoscopy, "nervous", "Nervous are studies of Polygonoscopic Fields.", 
  "<p>A closer look to the fibers of the " SEND("brane") " mesh.</p>");

Term artwork = create_album(&illustration, "artwork", "Artwork collection of unrelated concepts and characters.", NULL);

Term sketchbook = create_portal(&artwork, "sketchbook", "Various rough illustration from the Sketchbook.", 
  "<p>Always carry some sort of " SEND("notebook") ".</p>");

Term flactals = create_album(&sketchbook, "flactals", "Flactals is a series of abstract six-sided flowers drawn using an early version of Ronin.", 
  "<p>These flowers have inspired a series of illustrations used in Elodie Lareine's book titled \"" SEND("vast") "\" as well as the cover of the " SEND("aliceffekt") " single titled \"" SEND("known_magye") "\", released in 2014.</p>");

Term old_cities = create_album(&sketchbook, "old cities", "The Old Cities were old drawings created for school.",
  "<p>Traditional drawings created in the style of " SENDNAME("directory", "ブラム!") ".</p>"
  "<p>These dark locations were to become the brightened structures of " SENDNAME("collected_works", "Malice") " and " SEND("merveilles") ".</p>");

Term lard_shader = create_album(&illustration, "lard shader", "Lard Shader is a 3d vertex shader transforming neoclassical figures into their plump selves.", 
  "<p>The shader first creates a vertical vertex displacement based on the intersection of brightness and red pixel values, and then re-apply itself 3 times onto the resulted new topology.</p>");

Term ring_of_scales = create_term(&physical, "ring of scales", "The Ring Of Scales is a large ring made of 3 scales.", 
  "<p>The ring was originally named the armor ring.</p>");
add_link(&ring_of_scales, "download", "http://www.thingiverse.com/thing:19152");

Term neauismetic = create_portal(&aliceffekt, "neauismetic", "The Neauismetic albums are audio diaries from the early ages of the Neauismetica.", NULL);

Term vetetrandes_lettres = create_term(&neauismetic, "vetetrandes lettres", "Vetetrandes Lettres sings of the first age of Dinaisth on the island of Vetetrandes.", 
  "<p>While the album begins in Vetetrandes, it moves to the shores of " SEND("dilitriel") " and turns its attention across " SEND("kanikule") " and toward the <i>Es</i>'Gulf of <i>Eaurison</i>.</p>"
  "<p>The album includes 4 edited tracks from the " SEND("es_gulf_sunflowers") " release. The <i>Ver'Tale</i> extension is a hint to a location of <i>Whiinders</i>, close to the visited <i>Vert Kirlian Theatre</i>.</p>"
  "<p>The album begins with a track about " SEND("yajnev") ", the composition is based on his trip near the white trees of the <i>Oasis</i> and the <i>Children of Brambles</i>.</p>"
  "<p>The album is part of " SEND("aliceffekt") "'s " SEND("neauismetic") " albums.</p>");
add_link(&vetetrandes_lettres, "bandcamp", "http://aliceffekt.bandcamp.com/album/vetetrandes-lettres-perdues");

Term from_saharaphorest = create_term(&neauismetic, "from saharaphorest", "From Saharaphorest is an album telling the tale of a visit at Paradichlorisse.",
  "<p>The album was recorded as it played through cassette tapes. The first 3 tracks are ripped from cassette tapes, and the last one is a single clean mastered version. Five tapes were made and given to fans at shows as artworks.</p>"
  "<p>This release is related to " SEND("vert_kirlian_theatre") " album, released in 2008.</p>"
  MODBANDCAMP("1013227503"));
add_link(&from_saharaphorest, "bandcamp", "http://aliceffekt.bandcamp.com/album/19th-month-from-saharaphorest-to-duomo");

Term ehrivevnv_studies = create_term(&neauismetic, "ehrivevnv studies", "The Ehrivevnv Studies is an album exploring the Dinaisth region surrounding the offices of Andes.", 
  "<p>The album was composed for and performed at <b>Blip Festival Tokyo</b> on October 21st 2012 and reissued on april 15th 2013.</p>"
  "<p>The track names contains encrypted " SENDNAME("lietal", "Traumae") ". The first track is decrypted into \"Simkin Kamsi\" and can be translated to <i>Time Structure</i>, refering to " SENDNAME("paradise", "The Library of Sand") ". The second track, \"Xomsinsom Kim " SEND("yajnev") "\", can be translated to <i>Yajnev's Curse</i> and refers to the short <b>Yajnev's Thoughts</b>. The third track is titled \"Ko Sokamxi\" which simply means <i>The Impossible Exploration</i>.</p>"
  MODBANDCAMP("2576083659"));
add_link(&ehrivevnv_studies, "bandcamp", "https://aliceffekt.bandcamp.com/album/the-ehrivevnv-studies-reissue");

Term yajnev_studies = create_term(&neauismetic, "yajnev studies", "The Yajnev Studies is an upcoming album exploring the Yajnev sector of Vetetrandes.", 
  "<p>The album is entirely written in " SEND("orca") " and is designed to be performed as a livecoding installation, more details shortly.</p>");

Term telekinetic = create_portal(&neauismetic, "telekinetic", "Telekinetic is a Laeisthic concept album performed live with the Leap Motion controller.", 
  "<p>The event was recorded and can still be watched online on " LINKNAME("http://www.ustream.tv/recorded/39105185", "UStream") ".</p>"
  "<p>There was a " LINKNAME("http://www.cnet.com.au/dj-turns-leap-motion-into-a-theremin-sort-of-339345563.htm", "short article on CNET") " about the event as well. The album cover features an alternate door to " SEND("nataniev") "'s Library of Sand ornated of the number 210 in " SEND("needles") " as well as the " SEND("lietal") " letters BI, TI, TA, SI, PO.</p>"
  MODBANDCAMP("2904772795"));
add_link(&telekinetic, "bandcamp", "https://aliceffekt.bandcamp.com/album/telekinetic");

Term telekinesis = create_term(&telekinetic, "telekinesis", "Telekinesis is a Pure Data controller and instrument used for Telekinetic.", 
  "<p>The tool was used for both, the live performance of " SEND("telekinetic") " and " SEND("ten_axitecture") ".</p>"
  "<p>The picture was taken at 8Static, by " LINKNAME("https://www.flickr.com/photos/m_becker/", "Marjorie Becker") ".</p>");

Term automatons = create_portal(&visual, "automatons", "The Automatons is a collection of Twitter games and chatbots.", 
  "<p>I can barely remember when Twitter was a playground, a place people used to collaborate with each other, to public interactive art. The bots have since fallen into disrepair from API changes and development hostile decisions by the platform.</p>");

Term the_will_the_wisp = create_term(&automatons, "the will the wisp", "The Will The Wisp was a twitter bot that generated short rhymes.", 
  "<p>One of the better generated poem:</p>"
  "<ul><li>Somewhen future, and secondly obscure.</li><li>Thus traveled, nor inwardly transient.</li><li>Upon devices, hopefully devils.</li><li>Someplace cute, and terribly brute.</li><li>But thy nautilus is actually nauseous.</li></ul>");
add_link(&the_will_the_wisp, "twitter", "https://twitter.com/thewillthewisp");
add_link(&the_will_the_wisp, "sources", "https://github.com/XXIIVV/vessel.thewillthewisp");

Term dictionarism = create_term(&automatons, "dictionarism", "Dictionarism is a simple twitter bot that generates -isms.", 
  "<p>Some of the better generated words:</p>"
  "<ul><li>Mirrorism</li><li>Polygonism</li><li>Neptunism</li><li>Librarism</li><li>Helplessism</li></ul>");
add_link(&dictionarism, "twitter", "https://twitter.com/dictionarism");
add_link(&dictionarism, "sources", "https://github.com/XXIIVV/vessel.dictionarism");

Term advent_v = create_term(&automatons, "advent v", "Advent V was a simple twitter game in the format of the Choose Your Own Adventure.",
  "<p>Players are invited to tell Advent where to go in a choice of locations from a previous twee</p>t."
  "<pre>Punching a serpent at the lake, lost 6hp.<br>Go to the Forest or the Camp?<br>Day2 Atk0 Def4, via <b>@auriea</b></pre>"
  "<p>Illustrations were created by " LINKNAME("https://twitter.com/heygleeson", "Andrio") ".</p>");
add_link(&advent_v, "twitter", "https://twitter.com/adventvrecall");
add_link(&advent_v, "sources", "https://github.com/XXIIVV/vessel.adventv");

Term glossolaliarium = create_term(&automatons, "glossolaliarium", "Glossolaliarium is a twitter bot that generates procedural english words.", 
  "<p>By combining various prefixes and suffixes, it tries to form definitions of these newly created terms.</p>"
  "<p>Some of the better generated words:</p>"
  "<ul><li>Dictcephaladelog: Speech or process of foretelling the future encephalitis.</li><li>Gramhydrudeic: Characterized by written liquid.</li><li>Fidcardiboneity: Quality of sound from faith.</li><li>Centblastbileian: Relating to one who loves the hundred primitives.</li><li>Ferdynletoid: Resembling version of bear energy.</li></ul>");
add_link(&glossolaliarium, "twitter", "https://twitter.com/Glossolaliarium");
add_link(&glossolaliarium, "sources", "https://github.com/XXIIVV/vessel.glossolaliarium");

Term nataniev = create_portal(&research, "nataniev", "The Nataniev ecosystem is a collection of exocortex tools.", 
  "<p><b>Nataniev</b> is a collection of free and open-source software following a singular design " SENDNAME("about", "philosophy") ", and " SENDNAME("aesthetics", "aesthetic") ".</p>");

Term oscean = create_index(&nataniev, "oscean", "Oscean is a flat-file wiki engine.", 
  "<p><b>Oscean</b> is a static wiki engine written entirely in " LINKNAME("https://en.wikipedia.org/wiki/C99", "C99") ", designed to be deployed from " SENDNAME("raspberry", "low-power devices") " with " LINKNAME("https://en.wikipedia.org/wiki/GNU_Compiler_Collection", "gcc") " as its only dependecy. The engine has grown into a collection of tools, including the time tracking software " SEND("horaire") ", as well as the time formats " SEND("neralie") " & " SEND("arvelie") ".</p>"
  "<p>The wiki and related tools are designed to be used " SENDNAME("about", "offline first") ", so the content is generally accessed and edited locally, there are no offsite queries for critical resources.</p>"
  "<p>The generated files use no javascript, are optimized for screen-readers and terminal browsers, the entire CSS content of the entire site should be under 1kb. The software architecture is inspired by " SEND("longtermism") ".</p>");
add_link(&oscean, "sources", "https://github.com/XXIIVV/Oscean");
add_link(&oscean, "live", "https://wiki.xxiivv.com");

Term indental = create_term(&oscean, "indental", "Indental is a dictionary-type database format designed to store elements accessible by name.",
  "<p>The Indental " LINKNAME("https://github.com/XXIIVV/Libraries/blob/master/scripts/indental.js", "parser") " allows for human-readable data structures for static APIs. In the Indental file, an unindented line declares the key to a new root node, children lines can associate either parameters or lists to their parent node, a line divided with a colon will associate a value to a parameter to the parent node, and a sequence of equally indented lines will append to a list. You can download syntax highlight " LINKNAME("https://github.com/hundredrabbits/Libraries/blob/master/tools/ndtl.sublime-syntax", "here")".</p>"
  "<pre>NAME\n&nbsp;&nbsp;KEY &#58; VALUE\n&nbsp;&nbsp;LIST\n&nbsp;&nbsp;&nbsp;&nbsp;ITEM1\n&nbsp;&nbsp;&nbsp;&nbsp;ITEM2\n<comment>Or, &#123;NAME:&#123;KEY:VALUE,LIST:[ITEM1,ITEM2])&#125;</comment></pre>");
add_link(&indental, "parser", "https://github.com/XXIIVV/Libraries/blob/master/scripts/indental.js");
add_link(&indental, "syntax highlight", "https://github.com/XXIIVV/Libraries/blob/master/tools/ndtl.sublime-syntax");

Term tablatal = create_term(&oscean, "tablatal", "Tablatal is a list-type database format designed to store a list of elements of the same length, accessible by id.",
  "<p>The Tablatal " LINKNAME("https://github.com/hundredrabbits/Libraries/blob/master/scripts/tablatal.js", "parser") " allows for human-readable data structures for static APIs. In the Tablatal file, the first line declares the key, the spacing between each key defines the length of the parameters for all subsequent lines. You can download syntax highlight " LINKNAME("https://github.com/hundredrabbits/Libraries/blob/master/tools/tbtl.sublime-syntax", "here") ".</p>"
  "<pre>NAME    AGE   COLOR\nErica   12    Opal\nAlex    23    Cyan\nNike    34    Red\nRuca    45    Grey\n<comment>Or, [&#123;name:Erica,Age:12,Color:Blue&#125;,&#123;name:Alex,Age..&#125;</comment>\n</pre>");
add_link(&tablatal, "parser", "https://github.com/XXIIVV/Libraries/blob/master/scripts/tablatal.js");
add_link(&tablatal, "syntax highlight", "https://github.com/XXIIVV/Libraries/blob/master/tools/tbtl.sublime-syntax");

Term lain = create_term(&oscean, "lain", "Lain is a LISP dialect used as a templating and scripting engine. ", "<p>The Lain parser used to exist at the core of {Oscean} before the migrationg to a fully static website, but it can still be found in various projects of the {Nataniev}, such as in the {Ronin} and {Paradise} applications.</p>");  
add_link(&lain, "parser", "https://github.com/XXIIVV/Libraries/blob/master/scripts/lib/lain.js");

Term runic = create_term(&oscean, "runic", "Runic is a templating format.", 
  "<p>Runic is a first-order templating language operating on an array of lines, Where line is prefixed by a rune, giving a sense of the data being handled. The Runic parser takes a " LINKNAME("https://github.com/XXIIVV/Libraries/blob/master/scripts/runic.library.js", "Runic Library") ".</p>"
  "<pre>* Header\n& Paragraph\n- List Element 1\n- List Element 2\n| table | row1\n| table | row2\n# <comment>-- CODE BLOCK</comment>\n> <comment>-- HTML BLOCK</comment>\nλ <comment>-- (link \"LAIN\") BLOCK</comment>\n</pre>");

Term horaire = create_term(&nataniev, "horaire", "Horaire is a time-tracking tool.", 
  "<p><b>Horaire</b> is a time-tracking engine designed to record and host daily activity logs. A log is recorded at the " SENDNAME("routine", "end of the day") ", and contains 3 values.</p>");

Term nataniev_time = create_index(&nataniev, "time", "Documentation on the different Time formats.", 
  MODFRAME("https://clock.xxiivv.com"));

Term neralie = create_album(&nataniev_time, "neralie", "Neralie is a decimal time format.", 
  "<p>The <b>Neralie clock</b> has two groups of 3 digits, called the <i>beat</i> & the <i>pulse</i>. A beat contains 1000 pulses, and equivalent to <b>86.4 seconds</b>. A day is 1000 beats, or a million pulses. A pomodoro of 20 beats, is equivalent to 28 minutes 48 seconds.</p>"
  "<p>Neralie time is similar to the {https://en.wikipedia.org/wiki/Swatch_Internet_Time Swatch Internet Time} decimal clock, but uses 6 decimal points and a rectangular watchface. You can find a " SEND("pascal") " implementation for " SEND("macintosh") ", in the " LINKNAME("https://github.com/XXIIVV/Clock/tree/master/pascal", "clock repository") ".</p>"
  "<ul><li><b>6:00</b> 250:000</li><li><b>12:00</b> 500:000</li><li><b>18:00</b> 750:000</li></ul>");
add_link(&neralie, "view online", "https://clock.xxiivv.com");

Term arvelie = create_term(&nataniev_time, "arvelie", "Arvelie is an alphabetic date format.",
  "<p>The <b>Arvelie calendar</b> has <b>26 months</b> of <b>14 days</b> each.</p>"
  "<p>Each month has <b>2 weeks</b> of <b>7 days</b>, and each month's name is one of the 26 letters of the alphabet. The 365th day of the year is the <i>Year Day</i>(+01), preceded by the <i>Leap Day</i>(+02) on leap years.</p>"
  "<ul><li><b>02A01</b> 2002-01-01</li><li><b>01D07</b> 2001-02-18</li><li><b>13B12</b> 2013-01-26</li><li><b>02E07</b> 2002-03-04</li><li><b>24C01</b> 2024-01-29</li><li><b>03+01</b> 2003-12-31</li></ul>");
add_link(&arvelie, "library", "https://github.com/XXIIVV/Oscean/blob/master/scripts/lib/arvelie.js");

Term webring = create_term(&nataniev, "webring", "The Webring, like we are in the 2000s.", 
  "<p>The <b>webring</b> is a directory of neighbor websites and portfolios.</p>"
  "<p>This is an attempt to <b>inspire artists and developers to create and maintain their own personal website</b>, and share traffic organically among each other. The ring's aim is to promote the creation of hand crafted diaries, wikis, bookmarks and portfolios.</p>"
  "<p>You can view the full directory " LINKNAME("https://webring.xxiivv.com/", "here") ", or more info on how to join the network " LINKNAME("https://github.com/XXIIVV/webring", "here") ". To navigate the webring, start " LINKNAME("http://webring.xxiivv.com/#random", "here") ". The webring also operates as a decentralized forum based on " LINKNAME("https://github.com/buckket/twtxt", "twtxt") ", see the " LINKNAME("https://webring.xxiivv.com/hallway.html", "Hallway") ".</p>"
  QUOTE("The internet is a utility world for me now. It is efficient and all-encompassing. It is not very much fun.", "Dan Nosowitz"));
add_link(&webring, "sources", "https://github.com/XXIIVV/webring");
add_link(&webring, "jump in", "https://webring.xxiivv.com/#random");

Term merveilles = create_album(&webring, "merveilles", "Merveilles is a community of artists and developers.", 
  "<p>Merveilles is a community project aimed at the establishment of new ways of speaking, seeing and organizing information. — A culture that seeks augmentation through the arts of <b>engineering & design</b>.</p>"
  "<p>Maybe it's a movement, I'm not sure. It might be that we all grew up with similar influences, yet it might not; but when we see each other, <i>we know</i>.</p>"
  "<p>During the first weekend of 2020, Merveilles hosted the " LINKNAME("https://merveilles.town/web/timelines/tag/Hyperjam", "Hyperjam") ", an interactive art jam designed to learn the " LINKNAME("https://en.wikipedia.org/wiki/HyperCard", "Hypercard") " software and its programming language " SEND("hypertalk") ".</p>");
add_link(&merveilles, "on mastodon", "http://merveilles.town");
add_link(&merveilles, "on github", "https://github.com/Merveilles");

Term rotonde = create_album(&webring, "rotonde", "Rotonde was a decentralized social network.", 
  "<p>It is a commonly agreed upon specifications of a JSON object shared between " LINKNAME("https://github.com/Rotonde", "members of the network") ", its current incarnation is the " SEND("webring") "'s " LINKNAME("https://webring.xxiivv.com/hallway.html", "Hallway") ".</p>"
  "<p><b>Nobody owns the network, it never goes offline</b>, there are no servers and no central authority. All content is editable, versionable, hosted on your own computer and seeded by anyone who wish to follow your portal.</p>");
add_link(&rotonde, "sources", "https://github.com/Rotonde");
add_link(&rotonde, "dat", "dat://2f21e3c122ef0f2555d3a99497710cd875c7b0383f998a2d37c02c042d598485/");

Term riven = create_term(&nataniev, "riven", "Riven is a flow-based web framework.", 
  "<p><b>Riven</b> handles the creation of nodes and the communication of signals between them.</p>"
  "<p>For more than two years, it existed as the front-end framework of " SEND("oscean") " until it was replaced, but was originally developed for the creation of serverless websites.</p>"
  "<p>This project is not meant to be an optimial way of building web applications, but a mere experimental framework to toy with the concepts of " LINKNAME("https://en.wikipedia.org/wiki/Flow-based_programming", "flow-based programming") ".</p>");
add_link(&riven, "sources", "https://github.com/XXIIVV/Riven");

Term tools = create_portal(&research, "tools", "The Tools collection is an ecosystem of open-source software to create audio and visual works, released as Hundred Rabbits.", 
  "You can learn more about the philosophy behind these various projects on the " LINKNAME("https://100r.co/site/tools_ecosystem.html", "Hundred Rabbits blog") "."
  QUOTE("What I cannot create, I do not understand", "Richard Feynman"));
add_link(&tools, "itch", "http://hundredrabbits.itch.io/");
add_link(&tools, "sources", "http://github.com/hundredrabbits");

Term orca = create_album(&tools, "orca", "Orca is a livecoding playground.", 
  "<p>Orca is a two-dimensional " LINKNAME("https://esolangs.org/wiki/Esoteric_programming_language", "esoteric programming language") " in which <b>every letter of the alphabet is an operator</b>, where lowercase letters operate on bang, uppercase letters operate each frame. This livecoding language is designed to procedurally generate " LINKNAME("https://github.com/hundredrabbits/orca#midi", "MIDI, UDP or OSC") " messages.</p>"
  "<p>Orca operates on a base of 36 increments, operators will convert alphanumeric values into values ranging from 0 to 36. Special characters are used to handle platform and client specific interactions.</p>"
  MODITCHIO("225814")
  "<p>You can find a <b>portable and lightweight version</b> of Orca " LINKNAME("https://github.com/hundredrabbits/orca-c", "here") ", and a version  for the " SEND("norns") " " LINKNAME("https://llllllll.co/t/orca/22492", "here") ". Learn more by reading the " LINKNAME("https://github.com/Hundredrabbits/Orca", "manual") ", or have a look at a " LINKNAME("https://www.youtube.com/watch?v=RaI_TuISSJE", "tutorial video") ". If you need <b>help</b>, visit the " LINKNAME("https://talk.lurk.org/channel/orca", "chatroom") " or the " LINKNAME("https://llllllll.co/t/orca-live-coding-tool/17689", "forum") ". Orca was featured on the Future Of Coding podcast, you can listen to the full episode " LINKNAME("https://futureofcoding.org/episodes/045", "here") ".</p>"
  QUOTE("Orca is a wildly unique visual programming tool. It's also an inky black and seafoam green alphabet soup, pulsating to some species of broody electronic industrial throb.", "Ivan Reese, The Future Of Coding"));
add_link(&orca, "sources", "https://github.com/hundredrabbits/Orca");
add_link(&orca, "builds", "http://hundredrabbits.itch.io/Orca");
add_link(&orca, "live", "https://hundredrabbits.github.io/Orca");
add_link(&orca, "esolang wiki", "https://esolangs.org/wiki/Orca");
add_link(&orca, "chatroom", "https://chat.toplap.org/channel/orca");
add_link(&orca, "forum", "https://llllllll.co/t/orca/22492");

Term juni = create_album(&orca, "juni", "Juni one-handed chorded keyboard.", 
  "<p>The <b>Juni Layout</b> is a 12-keys " LINKNAME("https://en.wikipedia.org/wiki/Chorded_keyboard", "chorded keyboard") ".</p>"
  "<p>The " SEND("keyboard") " model is " LINKNAME("https://learn.pimoroni.com/keybow", "Pimoroni's Keybow") ", the <code>.lua</code> layout is available on " LINKNAME("https://github.com/neauoire/Juni", "Github") ". It was designed to be used with the " SEND("orca") " livecoding environment, but has most common keys and controls, making it a versatile and portable single-handed keyboard.</p>"
  MODYOUTUBE("cgBvWsM3Z7g"));
add_link(&juni, "sources", "https://github.com/neauoire/Juni");

Term pilot = create_album(&orca, "pilot", "Pilot is a mini synthesiser.", 
  "<p><b>Pilot</b> is a <b>mini synthetiser</b> designed to be used with " SEND("orca") " via UDP.</p>"
  "<p>Pilot features <b>16 voices, and 8 audio effects</b>, each operatable with their own set of commands, and their own FFT visualiser. The complete operation guide can be seen " LINKNAME("https://github.com/Hundredrabbits/Pilot", "here") ".</p>"
  "<p>If you need <b>help</b>, visit the " LINKNAME("https://talk.lurk.org/channel/orca", "chatroom") " or the " LINKNAME("https://llllllll.co/t/orca-live-coding-tool/17689", "forum") ".</p>"
  MODITCHIO("402423"));
add_link(&pilot, "builds", "http://hundredrabbits.itch.io/Pilot");
add_link(&pilot, "sources", "https://github.com/neauoire/Pilot");
add_link(&pilot, "demo", "https://twitter.com/neauoire/status/1114770190552653824");

Term ronin = create_album(&tools, "ronin", "Ronin is an procedural graphics tool.",
  "<p>Ronin is a <b>procedural graphics tool</b> designed to automate simple graphical tasks, like resizing, cropping, coloring, and generating algorithmic images. It interprets a minimal " LINKNAME("https://en.wikipedia.org/wiki/Lisp_(programming_language)", "dialect of LISP") ", look at these " LINKNAME("https://github.com/hundredrabbits/Ronin/tree/master/examples", "examples") " to better understand how this all works.</p>"
  "<p>The library updates is constantly revealing new applications to Ronin, you can see the list of available functions " LINKNAME("https://github.com/hundredrabbits/Ronin#library", "here") ". The iconography of " SEND("nataniev") " has been created with both " SEND("ronin") " and " SEND("dotgrid") ".</p>"
  MODITCHIO("194632")
  "<p>Learn more by reading the " LINKNAME("https://github.com/Hundredrabbits/Ronin", "manual") ", or have a look at some experiments on " LINKNAME("https://twitter.com/neauoire/status/1152481692193419267", "twitter") ". If you need <b>help</b>, visit the " LINKNAME("https://hundredrabbits.itch.io/ronin/community", "Community") " or watch the " LINKNAME("https://www.youtube.com/watch?v=SgAWGh1s9zg", "video tutorial") ".</p>");
add_link(&ronin, "sources", "https://github.com/hundredrabbits/Ronin");
add_link(&ronin, "builds", "http://hundredrabbits.itch.io/Ronin");
add_link(&ronin, "live", "https://hundredrabbits.github.io/Ronin");
add_link(&ronin, "community", "https://hundredrabbits.itch.io/Ronin/community");

Term dotgrid = create_album(&tools, "dotgrid", "Dotgrid is a vector graphics tool.",
  "<p>Dotgrid is a <b>grid-based vector drawing software</b> designed to create logos, icons and type. It supports layers, the full SVG specs and additional effects such as mirroring and radial drawing. Dotgrid exports to both PNG and SVG files.</p>"
  "<p>The " LINKNAME("https://github.com/hundredrabbits/Dotgrid", "application") " was initially created for internal use, and later made available as a free and " LINKNAME("https://github.com/hundredrabbits/Dotgrid", "open source") " software.</p>"
  MODITCHIO("190851")
  "<p>Learn more by reading the " LINKNAME("https://github.com/Hundredrabbits/Dotgrid", "manual") ", or have a look at a " LINKNAME("https://www.youtube.com/watch?v=Xt1zYHhpypk", "tutorial video") ". If you need <b>help</b>, visit the " LINKNAME("https://hundredrabbits.itch.io/dotgrid/community", "Community") ".</p>"
  "<p>Dotgrid was ProductHunt's <b>Product Of The Day</b> on " LINKNAME("https://producthunt.com/posts/dotgrid", "January 8, 2018") ".</p>");
add_link(&dotgrid, "sources", "https://github.com/hundredrabbits/Dotgrid");
add_link(&dotgrid, "builds", "http://hundredrabbits.itch.io/Dotgrid");
add_link(&dotgrid, "live", "https://hundredrabbits.github.io/Dotgrid");
add_link(&dotgrid, "community", "https://hundredrabbits.itch.io/Dotgrid/community");

Term left = create_album(&tools, "left", "Left is a plaintext editor.", 
  "<p>Left is <b>distractionless plaintext editor</b> designed to quickly navigate between segments of an essay, or multiple documents. It features an auto-complete, synonyms suggestions, writing statistics, markup-based navigation and a speed-reader.</p>"
  "<p>The " LINKNAME("https://github.com/hundredrabbits/Left", "application") " was initially created to help " SEND("rekka") " with the writing of the upcoming novel " SEND("wiktopher") ", and later made available as a free and " LINKNAME("https://github.com/hundredrabbits/Left", "open source") " software.</p>"
  MODITCHIO("173127")
  "<p>Learn more by reading the " LINKNAME("https://github.com/Hundredrabbits/Left", "manual") ", or have a look at a " LINKNAME("https://www.youtube.com/watch?v=QloUoqqhXGE", "tutorial video") ". If you need <b>help</b>, visit the " LINKNAME("https://hundredrabbits.itch.io/left/community", "Community") ".</p>"
  "<p>Left was ProductHunt's <b>Product of the Day</b> on " LINKNAME("https://www.producthunt.com/posts/left", "January 28, 2018") ".</p>");
add_link(&left, "download", "http://hundredrabbits.itch.io/Left");
add_link(&left, "sources", "https://github.com/hundredrabbits/Left");
add_link(&left, "community", "https://hundredrabbits.itch.io/left/community");

Term nasu = create_album(&tools, "nasu", "Nasu is a spritesheet and nametable editor.", 
  "<p>Nasu is a spritesheet and nametable editor created to help us design and assemble the assets of our famicom games. It can import and export both .chr spritesheets and .asm nametables.</p>"
  "<p>The " LINKNAME("https://github.com/hundredrabbits/Nasu", "application") " was initially created to help us with the porting of " SEND("donsol") " to the Famicom, and was later made available as a free and " LINKNAME("https://github.com/hundredrabbits/Nasu", "open source") " software.</p>"
  MODITCHIO("560470")
  "<p>Learn more by reading the " LINKNAME("https://100r.co/site/nasu.html", "manual") ". If you need <b>help</b>, visit the " LINKNAME("https://hundredrabbits.itch.io/nasu/community", "Community") ".</p>");
add_link(&nasu, "download", "http://hundredrabbits.itch.io/Nasu");
add_link(&nasu, "sources", "https://github.com/hundredrabbits/Nasu");
add_link(&nasu, "live", "https://hundredrabbits.github.io/Nasu");
add_link(&nasu, "community", "https://hundredrabbits.itch.io/nasu/community");

Term utilities = create_index(&visual, "utilities", "The Utilities are a collection of little tools created solve specific problems.", 
  "<p>A collection of small applications that don't quite have a place in the wiki just yet.</p>");

Term noodle = create_term(&utilities, "noodle", "Noodle is a sketching tool.", 
  "<p>Noodle is a <b>pixel drawing tool</b> based on the " LINKNAME("https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm", "Bresenham algorithm") ". You can use it directly in your browser " LINKNAME("https://hundredrabbits.github.io/Noodle/", "here") ".</p>"
  "<p>Noodle is the first in a series of image processing tools, exploring the concept of " LINKNAME("https://brandur.org/small-sharp-tools", "Small Sharp Tools") " for graphical tasks, as an alternative take to the general purpose software " SEND("ronin") ".</p>"
  MODYOUTUBE("zvO5JRF47bc")
  "<p>The companion " LINKNAME("https://hundredrabbits.github.io/Poodle/", "scene tool") " is designed to create perspective guide lines with the noodle Bresenham look. The companion " LINKNAME("https://hundredrabbits.github.io/Moogle/", "cropping tool") " is designed to handle all resizing and cropping tasks, instead of adding these features directly into Noodle.</p>"
  "<p>Noodle works exceptionally well with the " SEND("macintosh") " application " SENDNAME("hypertalk", "hypercard") ", you can find a collection of drawings created with it " LINKNAME("https://neauoire.github.io/neauismea/", "here") ".</p>"
  "<p>Learn more about the " SENDNAME("zoe_format", ".zoe file format") ".</p>");
add_link(&noodle, "sources", "https://github.com/hundredrabbits/Noodle");
add_link(&noodle, "live", "https://hundredrabbits.github.io/Noodle");
add_link(&noodle, "inktober 2019", "https://neauoire.github.io/neauismea");

Term enfer = create_term(&utilities, "enfer", "Enfer is a virtual synthetiser.", 
  "<p><b>Enfer</b> is a web-based sampler and synthetiser designed to be used with " SEND("orca") ", it is the tool that created the sound for the " SEND("azolla") " tracks.</p>"
  "<p>The sampler is meant to be used with the " LINKNAME("https://www.akaipro.com/lpd8-lpd8", "Akai LPD8") " midi controller while livecoding, its interface is reflecting the state of the knobs on the controller.</p>"
  MODYOUTUBE("iYEUthDpYbQ"));
add_link(&enfer, "sources", "https://github.com/neauoire/Enfer");

Term zoe_format = create_term(&utilities, "zoe format", "The zoe file format is designed to store binary picture data.", 
  "<p>The format was designed to make it easier to read and write uncompressed pixel data for monochromatic pictures, more specifically to help move " SEND("noodle") " pictures from and to the " SEND("macintosh") " system.</p>");
add_link(&zoe_format, "sources", "https://github.com/XXIIVV/zoe-format");

Term games = create_portal(&visual, "games", "The Games are a collection of experimental interactive projects.", NULL);

Term markl = create_term(&games, "markl", "Markl is a TAIBA game. In Development.", 
  "<p><b>Markl</b> is a game in which players must " LINKNAME("https://twitter.com/hundredrabbits/status/916842882677358592", "program") " their character's fighting style, to face various opponents in a battle happening too fast for humans to compete.</p>"
  "<p>There are 4 characters to choose from, with unique attributes and stats, allowing for varied loadouts and combat styles.</p>"
  "<p>The game will be released as " SENDNAME("hundred_rabbits", "hundred rabbits") " in the fall of 2019, for all desktop platforms. The game supersedes the " SEND("blindfolk") " project.</p>"
  "<p><b>TAIBA</b>: Tactical AI Battle Arena</p>");
add_link(&markl, "sources", "https://github.com/hundredrabbits/Markl");

Term oquonie = create_term(&games, "oquonie", "Oquonie is a textless isometric puzzle game.", 
  "<p>You must make your way through a seemingly endless succession of rooms. You will not be alone. Your incarnations will have the help of <b>bizaroid</b> characters that speak an " SENDNAME("camilare", "an obscure language") ".</p>"
  "<p>We made Oquonie while living in " SEND("japan") ". The game was our first collaborative project as " SENDNAME("hundred_rabbits", "hundred rabbits") ", and a reflection of our experience navigating a new country, with language as a recurent obstacle. Oquonie is about being lost in a foreign space.</p>"
  "<p>A big inspiration for this project was the short story \"A town without streets\" by Junji Ito, about a city of endless interconnecting houses and rooms, where privacy is non-existent. To preserve the little privacy they do have, the townspeople wear masks.</p>"
  MODITCHIO("23183")
  "<p>Back in 2013, we both had full-time jobs in different studios in Tokyo, we worked on Oquonie after work, and on weekends, for a total of 6 months. You can learn more about the development of the project " LINKNAME("https://100r.co/site/oquonie.html", "here") ".</p>"
  "<p>Oquonie features an original " SENDNAME("oquonie soundtrack", "soundtrack") " and was best described as <i><a href='http://killscreendaily.com/articles/oquonie-maze-worth-entering/' target='_blank' rel='noreferrer' class='external '>Animal Crossing in a K-Hole</a></i>. You can find help in the Oquonie Guide " SEND("camilare") ".</p>");
add_link(&oquonie, "builds", "https://hundredrabbits.itch.io/oquonie");
add_link(&oquonie, "sources", "https://github.com/hundredrabbits/oquonie");

Term camilare = create_term(&oquonie, "camilare", "This Oquonie Guide is aimed at players who have gone past the loop of character changes.", NULL);

Term verreciel = create_term(&games, "verreciel", "Verreciel is a space exploration game.", 
  "<p><b>Verreciel</b> is an experimental space exploration game happening within a small glass capsule.</p>"
  "<p>The game's controls are inspired from <b>modular synthesisers</b>, where modules are routed into one another to create more complex operations. The game joins the sequence of linguistically involved projects like " SEND("paradise") ", " SEND("hiversaires") " and " SEND("oquonie") ".</p>"
  "<p>An " SENDNAME("verreciel_soundtrack", "original soundtrack") " was created for the game and released on " SEND("beldam_records") ".</p>"
  MODITCHIO("173320"));
add_link(&verreciel, "itunes", "https://hundredrabbits.itch.io/verreciel");
add_link(&verreciel, "sources", "https://github.com/Echorridoors/Verreciel");

Term paradise = create_term(&games, "paradise", "Paradise is an interactive-fiction playground.", 
  "<p>In <b>Paradise</b>, you are but a force acting upon places, objects, words — vessels.</p>"
  "<p><b>Paradise</b> is currently being expanded into an " LINKNAME("https://github.com/hundredrabbits/Paradise", "experimental shell") ", and file-system, for an upcoming light Linux distribution. The project also features an inline scripting language inspired from " LINKNAME("https://en.wikipedia.org/wiki/Lisp_(programming_language)", "LISP") ", called Lain.</p>"
  "<ul><li>create a coffee machine</li><li>enter the machine</li><li>program create a coffee</li><li>leave</li><li>use the machine</li></ul>"
  "<p>Until then, in this anonymous world you can create anything, traverse vastly different universes, and share your world with others.</p>"
  MODITCHIO("251450")
  QUOTE("I have always imagined that <b>Paradise</b> will be a kind of library.", "Jorge Luis Borges"));
add_link(&paradise, "sources", "http://github.com/hundredrabbits/Paradise");
add_link(&paradise, "builds", "https://hundredrabbits.itch.io/paradise");
add_link(&paradise, "live", "https://hundredrabbits.github.io/Paradise/");

Term maeve = create_term(&paradise, "maeve", "Maeve is an automated Paradise vessel",
  "<p>Traveling across the " SEND("nataniev") " landscapes, <b>Maeve</b> is a service bot.</p>"
  "<p>You can get help from Maeve within " SEND("oscean") " by typing <code>~</code> in the search bar, to see a list of available commads, type <code>~help</code>.</p>");

Term parade = create_term(&paradise, "parade", "Parade is an experimental operating system inspired from Paradise.", 
  "<p>The <b>Parade</b> is an experimental operating system using " SEND("paradise") " as a <i>filesystem</i>.</p>");

Term hardware = create_portal(&research, "hardware", "A handful of experimental projects on small Hardware.", NULL);

Term raspberry = create_portal(&hardware, "raspberry", "The Raspberry is a small inexpensive single-board computer.", 
  "<p>The <b>Raspberry Pi</b> is a small inexpensive single-board computer.</p>");

Term media_station = create_term(&raspberry, "media station", "The Media Station aboard Pino.", 
  "<p>Our " SEND("media_station") " is a " LINKNAME("http://osmc.tv", "OSMC") " powered " SENDNAME("raspberry", "Raspberry Pi") ".</p>"
  "<p>OSMC is a <b>fast and beautiful operating system</b> for the RPi board, it instantly gets media from our external drives, and streams audio to our " SEND("radio_station") " via Airplay.</p>"
  "<p>Setting up OSMC is extremly simple, one simply needs to burn a SD Card with the " LINKNAME("https://osmc.tv/download/", "latest Build") ", it installs itself upon boot and is usable in matters of seconds on the Raspberry Pi 3B+. This can be operated solely by touch, and requires no keyboard.</p>");
add_link(&media_station, "osmc", "http://osmc.tv");

Term radio_station = create_term(&raspberry, "radio station", "The Radio Station aboard Pino.", 
  "<p>Our " SENDNAME("pino", "sailboat") "'s speakers are connected via " LINKNAME("https://www.apple.com/airplay/", "Airplay") " through Pimoroni's " LINKNAME("https://learn.pimoroni.com/tutorial/sandyj/streaming-airplay-to-your-pi", "Phat Beat") " for " SEND("raspberry") ".</p>"
  "<p>The hat has two speaker-wire outputs, making a cheap and powerful stereo. We share this device among our " SEND("media_station") " and phones.</p>");
add_link(&radio_station, "guide", "https://learn.pimoroni.com/tutorial/sandyj/streaming-airplay-to-your-pi");

Term framboisedorf = create_term(&raspberry, "framboisedorf", "Overview of the Framboisedorf toy piano.", 
  "<p>A hackable toy piano to play " LINKNAME("https://twitter.com/neauoire/status/1029498719811424256", "muzzak") " on rainy days.</p>"
  "<p>Features 6 synth & 1 drum instruments, 5 octaves, and automated arpgeggios. Connect to a speaker and play. Read the full guide on " LINKNAME("https://github.com/neauoire/Framboisedorf.local", "Github") ", or watch a " LINKNAME("https://youtu.be/U8q_yZ3XEKU", "demo video") ".</p>");
add_link(&framboisedorf, "sources", "https://github.com/neauoire/Framboisedorf");
add_link(&framboisedorf, "guide", "https://learn.pimoroni.com/tutorial/piano-hat/getting-started-with-piano-hat");
add_link(&framboisedorf, "projects", "https://github.com/pimoroni/Piano-HAT");
add_link(&framboisedorf, "youtube", "https://youtu.be/U8q_yZ3XEKU");

Term weather_station = create_term(&raspberry, "weather station", "The documentation for the Weather Station aboard Pino.", 
  "<p>Our " SENDNAME("pino", "sailboat") "'s " SEND("weather_station") " is a simple solderless " SEND("raspberry") " project.</p>"
  "<p>Its purpose is to display a simple reading of the changes in barometric pressure to monitor the onset of stormy weather.</p>");
add_link(&weather_station, "sources", "https://github.com/hundredrabbits/weather-station");

Term instrument = create_term(&raspberry, "instrument", "The Instrument is the sailing computer inside Pino", 
  "<p>The application displays various data about the course, speed, location and time.</p>"
  "<p>Its original purpose was to help with night sailing where the compass and some of our sailing instruments were hard to see.</p>");
add_link(&instrument, "sources", "http://github.com/hundredrabbits/Instrument");

Term microbit = create_term(&hardware, "microbit", "The Microbit is a small educational micro-controller from BBC.", 
  "<p>Here's a list of <b>simple projects & sources</b> for the <a href='#microbit' data-goto='microbit' target='_self' class='local '>Microbit</a>. The Microbit is an excellent toy to learn to code and create electronics projects.</p>");
add_link(&microbit, "official site", "https://microbit.org/");

Term playground = create_term(&hardware, "playground", "The Playground is a flexible experimental micro-controller from Adafruit.", 
  "<p>The Playground Express is a ATSAMD21 ARM Cortex M0 Processor, running at 3.3V and 48MHz, the USB port can act as serial port, keyboard, mouse, joystick or MIDI.</p>");
add_link(&playground, "adafruit", "https://www.adafruit.com/product/3333");

Term norns = create_term(&hardware, "norns", "The Norns is an open-source DSP computer, with 3 knobs and 3 keys.", 
  "<p>I currently maintain a <b>programming tutorial guide</b> for the " SEND("norns") ", which can be found " LINKNAME("https://llllllll.co/t/norns-tutorial/23241", "here") ". You can also find a version of " SEND("orca") " for the Norns " LINKNAME("https://llllllll.co/t/orca/22492", "here") ".</p>");
add_link(&norns, "tutorial", "https://llllllll.co/t/norns-tutorial/23241");

Term monome = create_album(&hardware, "monome", "The Monome is an open-source controller, each of its 128 keys can light up between 16 levels of brightness.", 
  "<p>I presently use the device for audio & visual experiments under the " SEND("alicef") " alias, ultimately I would like to carry the " SEND("monome") " and the " SEND("norns") " along with me on stage during events.</p>"
  "<p>I created a handful of scripts for the device, such as the implementations for the " LINKNAME("https://github.com/neauoire/linn", "Linnstrument Keyboard layout") ", and " LINKNAME("https://github.com/neauoire/rack", "Ableton Drum Rack layout") ".</p>");
add_link(&monome, "website", "https://monome.org/");
add_link(&monome, "linn forum", "https://llllllll.co/t/using-a-grid-as-linnstrument/23637");
add_link(&monome, "rack forum", "https://llllllll.co/t/using-a-grid-as-drum-rack/23932");

Term famicom = create_album(&hardware, "famicom", "The famicom is an 8bit video game console by Nintendo.", 
  "<p>The famicom notes were created during the production of the NES release of " SEND("donsol")", to learn more about programming for the console, see " SEND("assembly") ".</p>");
add_link(&famicom, "famicom cookbook", "https://github.com/hundredrabbits/Famicom-Cookbook");

Term mobile = create_portal(&visual, "mobile", "The Mobile collection is both mobile tools and games.", 
  "<p>As of <b>March 2019</b>, these applications are no longer maintained.</p>");

Term bifurcan = create_album(&mobile, "bifurcan", "Bifurcan is a watchface.", 
  "<p>Every second, <b>The Labyrinth</b> reorganize itself to display the time in twists and turns.</p>"
  "<p>It takes a little practice to be able to see the patterns in the lines. Clicking on the screen will unveil the time as seen in this " LINKNAME("https://www.youtube.com/watch?v=HzXIJpzPB6c", "video") ".</p>"
  "<p>If you have a " LINKNAME("https://getpebble.com", "Pebble Watch") ", you can download it as a " LINKNAME("http://www.mypebblefaces.com/apps/10183/7055/", "watchface") ", the Pebble C script was written by Chase Colburn and is also available on " LINKNAME("https://github.com/chasecolburn/line-maze", "Github") ". The screensaver version was done by " LINKNAME("http://tekgo.org", "Tekgo") " and was also added to the source code. Named after a " LINKNAME("http://en.wikipedia.org/wiki/The_Garden_of_Forking_Paths", "Borges short") ".</p>"
  "<p>As of March 2019, This application is no longer maintained.</p>");
add_link(&bifurcan, "itunes", "https://itunes.apple.com/ca/app/bifurcan/id737264896");
add_link(&bifurcan, "sources", "https://github.com/Echorridoors/Bifurcan");
add_link(&bifurcan, "pebble", "http://www.mypebblefaces.com/apps/10183/7055/");

Term keyboard_468 = create_album(&mobile, "keyboard 468", "Keyboard 468 was a 18-keys keyboard.", 
  "<p>The letters are <b>sorted by frequency</b> in the English language, and their likeliness to follow the last input character.</p>"
  "<p>The purpose of this experimental keyboard is to have a keyboard displaying large letters, making it so you only ever need to <b>type using the two rows at the top</b>, maximizing the space and allowing for big large letters. The hidden letters are accessible through the <i>alt</i> key, alongside symbols and numbers.</p>"
  "<p>As of March 2019, This application is no longer maintained. <br />This project was superseded by the " SENDNAME("juni", "Juni Layout") ".</p>");
add_link(&keyboard_468, "itunes", "https://itunes.apple.com/ca/app/468-keyboard/id954698999");
add_link(&keyboard_468, "sources", "https://github.com/Echorridoors/Keyboard468");

Term alphavetist = create_album(&mobile, "alphavetist", "Alphavetist is an alphabet learning tool.", 
  "<p>Currently included are the Hebrew, " SENDNAME("russian", "Cyrillic") ", Korean, Inuktitut, Greek, Morse and " SEND("japanese") " alphabets.</p>"
  "<p>As of March 2019, This application is no longer maintained.</p>");
add_link(&alphavetist, "itunes", "https://itunes.apple.com/ca/app/hahapapa/id689193147");
add_link(&alphavetist, "sources", "https://github.com/Echorridoors/alphavetist");

Term vocavularist = create_album(&mobile, "vocavularist", "Vocavularist, is a vocabulary learning tool.", 
  "<p><b>Vocavularist</b> contains the 600 first kanji, 600 simple Russian words and 800 simple korean expressions.</p>"
  "<p>As of March 2019, This application is no longer maintained.</p>");
add_link(&vocavularist, "itunes", "https://itunes.apple.com/us/app/nijuniju/id686266543");
add_link(&vocavularist, "sources", "https://github.com/Echorridoors/Vocavularist");

Term rafinograde = create_album(&mobile, "rafinograde", "Rafinograde was a drawing tool.", 
  "<p><b>Rafinograde</b> was superseded by " SEND("dotgrid") " for Desktop platforms.</p>"
  "<p>As of March 2019, This application is no longer maintained.</p>");
add_link(&rafinograde, "itunes", "https://itunes.apple.com/us/app/rafinograde/id951781579");
add_link(&rafinograde, "sources", "https://github.com/Echorridoors/Rafinograde");

Term noirca = create_album(&mobile, "noirca", "Noirca is a monochromatic camera tool.", 
  "<p><b>Noirca</b> has one purpose, to launch quickly and render the photos with a softly washed out B&W film quality.</p>"
  "<p>As of March 2019, This application is no longer maintained.</p>");
add_link(&noirca, "itunes", "https://itunes.apple.com/us/app/noirca/id893715212");
add_link(&noirca, "sources", "https://github.com/Echorridoors/noirca");

Term dew = create_album(&mobile, "dew", "Dew was an alarm and timer application for iOS.", 
  "<p>The application will then  wake you with a soft white noise tone that will gradually bring you back to reality.</p>"
  "<p>As of March 2019, This application is no longer maintained.</p>");
add_link(&dew, "itunes", "https://itunes.apple.com/ca/app/dew/id954020907");
add_link(&dew, "sources", "https://github.com/Echorridoors/dew");

Term ledoliel = create_album(&mobile, "ledoliel", "Ledoliel is a dating-sim game.", 
  "<p>In <b>Ledoliel</b>, one must try and figure out what topics their guests might want to discuss, gift they might want to recieve and, places they may like to be <i>touched</i>.</p>"
  "<p>As of March 2019, This application is no longer maintained.</p>");
add_link(&ledoliel, "itunes", "https://itunes.apple.com/us/app/ledoliel/id891693763");
add_link(&ledoliel, "sources", "https://github.com/Echorridoors/Ledoliel");

Term unreleased = create_portal(&visual, "unreleased", "A list of Unreleased projects.", NULL);

Term unity = create_portal(&unreleased, "unity", "The Unity collection contains various older desktop games.", 
  "<p>As of <b>January 2015</b>, these applications are no longer maintained.</p>"
  "<p>Sadly, a lot of these games were lost in a computer death, and are only listed here for memory's sake. Some additional Unity games are available under " SEND("collegiennes") ".</p>");

Term siseon = create_term(&unity, "siseon", "Siseon is an exploration game set within a life-infested megastructure.", 
  MODYOUTUBE("es6YXGlsgxw"));

Term zjeveni = create_term(&unity, "zjeveni", "Zjeveni is a third person exploration game about climbing to the high points of the structure.", NULL);

Term drypoint = create_term(&unity, "drypoint", "Drypoint is a very hard platformer game for keyboard cowboys.", 
  "<p>See if you can get to the blue door. Read about Drypoint on the " LINKNAME("http://forums.tigsource.com/index.php?topic=8241", "TIGSource forum tread") ".</p>");

Term valentinel_hopes = create_term(&unity, "valentinel hopes", "Valentinel Hopes is a platformer inspired from parkour and trance music.", 
  "<p>The game has no music, you are invited to listen to your own.</p>");

Term cenote = create_term(&unity, "cenote", "Cenote is an experimental platformer inspired by Underwater Base Jumping.", 
  "<p>The goal is to reach a small red planet with the highest amount of points left. Cenote is the spiritual prequel of " SEND("zjeveni") ".</p>");

Term cyanosis_fever = create_term(&unity, "cyanosis fever", "Cyanosis Fever was an abstract world of static to get lost into.", 
  "<p>If you start to foam, close the game.</p>");

Term donsol = create_album(&games, "donsol", "Donsol is a dungeon-crawler card game.", 
  "<p><b>Donsol</b>, designed by " LINKNAME("https://twitter.com/johneternal", "John Eternal") ", is a card game about exploring a dungeon of 54 playing cards.</p>"
  MODITCHIO("109936"));
add_link(&donsol, "itch", "https://hundredrabbits.itch.io/donsol");
add_link(&donsol, "video", "https://www.youtube.com/watch?v=GNoZrr56GqA");
add_link(&donsol, "sources", "https://github.com/hundredrabbits/Donsol");

Term donsol_famicom = create_album(&donsol, "donsol famicom", "Donsol Famicom is a port of the dungeon-crawler card game for the classic Nintendo.",
  "<p><b>Donsol</b> is a " SENDNAME("donsol", "dungeon crawler card game") " played with a standard deck of 54 playing cards. The game was programmed entirely in " SENDNAME("assembly", "6502 assembly")", the art assets were created by " SEND("rekka") ", the game was designed by John Eternal and the " SEND("famicom") " rom will be released by " SEND("hundred rabbits") ".</p>"
  "<p>The game should be released in the " SENDNAME("calendar", "spring of 2020") ". A cartridge release is being considered, " LINKNAME("https://www.patreon.com/100", "stay tuned") " for more updates.</p>");
add_link(&donsol_famicom, "itch", "https://hundredrabbits.itch.io/donsol");
add_link(&donsol_famicom, "video", "https://www.youtube.com/watch?v=GNoZrr56GqA");
add_link(&donsol_famicom, "sources", "https://github.com/hundredrabbits/Donsol");

Term hiversaires = create_album(&games, "hiversaires", "Hiversaires is a textless point-n-click game.", 
  "<p><b>Hiversaires</b> is the first part of a series of textless experimental projects, that also includes the isometric adventure game " SEND("oquonie") ".</p>"
  MODITCHIO("225445")
  "<p>The dark world of Hiversaires features an original Aliceffekt " LINKNAME("https://aliceffekt.bandcamp.com/album/hiversaires-soundtrack", "soundtrack") " to lure you through its entangled corridors. The game was originally released on iOS platforms, and re-released on all desktop platforms in 2018, thanks to " LINKNAME("http://twitter.com/rezmason/status/964277430176309248", "Jeremy Sachs") " who also ported " SEND("verreciel") ".</p>");
add_link(&hiversaires, "itch", "http://hundredrabbits.itch.io/Hiversaires");
add_link(&hiversaires, "itunes", "https://itunes.apple.com/au/app/hiversaires/id630992348");

Term purgateus = create_album(&games, "purgateus", "Purgateus is a video game remix of Proteus.", 
  "<p>This video game remix behave like " LINKNAME("https://en.wikipedia.org/wiki/Proteus_", "Proteus") ", but looks and " SENDNAME("purgateus_soundtrack", "sounds") " different.</p>"
  "<p>Learn more about the project on " LINKNAME("http://venuspatrol.com/purgateus/", "Venus Patrol") ", the remix was inspired from a tweet by " LINKNAME("https://twitter.com/whatisian/status/468819959859007488", "Ian Snyder") "</p>"
  MODBANDCAMP("3667464517"));
add_link(&purgateus, "venus patrol", "http://venuspatrol.com/purgateus/");
add_link(&purgateus, "download", "https://drive.google.com/open?id=0B24klRuG3GLNaHlYNVJQd1lXVzQ");
add_link(&purgateus, "soundtrack", "https://aliceffekt.bandcamp.com/album/purgateus");

Term collegiennes = create_portal(&unreleased, "collegiennes", "The Collegiennes collective is a game jam team.", NULL);

Term diluvium = create_album(&collegiennes, "diluvium", "Diluvium was a multiplayer typing tactics game.", 
  "<p>This is a multiplayer typing tactics game where you incarnate an animal summoner.</p>"
  "<p>Created by Henk Boom, " LINKNAME("http://dom2d.com", "Dominique Ferland") ", " LINKNAME("http://theinstructionlimit.com/", "Renaud Bedard") " and Devine Lu Linvega, " SEND("diluvium") " was first showcased at the " LINKNAME("https://www.facebook.com/events/447362851940595/", "Indies Meetup") " in june of 2012.</p>"
  "<p>You must type, quickly and intelligently, sequences of animal names to counter and destroy your opponent.</p>"
  MODYOUTUBE("z7NNBzNXncw")
  "<p>The game will <i>most likely</i> let you summon any animal you can think of, choose wisely for each animal has it's own speed, power and intelligence stats.</p>");
add_link(&diluvium, "youtube", "http://youtu.be/z7NNBzNXncw");
add_link(&diluvium, "sources", "https://github.com/Collegiennes/diluvium");

Term volkenessen = create_album(&collegiennes, "volkenessen", "Volkenessen is a multiplayer physics-based fighting game.",
  "<p>Players start with 9 attached items on their back, and the goal is to strip the other player of their items.</p>"
  "<p>When items are removed, they clutter up the playing area, making it even more chaotic and hilarious. The washing machine and sink in the background can also fall and bounce around!</p>"
  "<p>Winning game of the Montreal edition of the Global Game Jam 2012, Volkenessen is a 2D Fighting game developed by " LINKNAME("http://theinstructionlimit.com/", "Renaud Bedard") " and myself.</p>"
  MODYOUTUBE("VheiqV4AuRE")
  "<p>To hit the other player, you need to get close to him by hitting away from him, then hit him by moving away from him. Ramming into the opponent just doesn't do it, you need to throw punches, and depending on the impact velocity, even that might not be enough. You can throw double-punches to make sure you land a solid hit and take off an item.</p>");
add_link(&volkenessen, "download", "http://theinstructionlimit.com/volkenssen-global-game-jam-2012");
add_link(&volkenessen, "sources", "https://github.com/Collegiennes/volkenessen");

Term waiting_for_horus = create_album(&unity, "waiting for horus", "Waiting For Horus was a fast paced multiplayer arena type 3rd person shooter.", 
  "<p>It was originally created by " LINKNAME("http://theinstructionlimit.com", "Renaud Bedard") " and I as a weekend project to play with friends over IRC.</p>"
  MODYOUTUBE("2tSoZ-jd6cA")
  "<p>I have very fond memories of building and playing this amazing project with friends. " LINKNAME("https://mangadrive.bandcamp.com", "Mangadrive") " created some amazing music for the project.</p>");
add_link(&waiting_for_horus, "sources", "http://github.com/merveilles/WaitingForHorus");

Term pico3 = create_album(&collegiennes, "pico3", "Pico3 is a colour-based 3D puzzler.", 
  "<p>It was created in collaboration with " LINKNAME("http://theinstructionlimit.com/", "Renaud Bedard") ".</p>"
  "<p>Also check out " SEND("pico_battle") ".</p>");
add_link(&pico3, "win", "http://theinstructionlimit.com/collegiennes/pico_windows.zip");
add_link(&pico3, "osx", "http://theinstructionlimit.com/collegiennes/pico_mac.zip");

Term pico_battle = create_term(&collegiennes, "pico battle", "Pico Battle is a colour-based multiplayer battle puzzler.", 
  "<p>You must learn to build shields to defend yourself against incoming colors.</p>"
  LINKNAME("http://theinstructionlimit.com/", "Renaud Bedard") " and I showcased an experimental game at <b>Prince of the Arcade</b> last year but, between " SEND("volkenessen") ", " SEND("diluvium") " and " SEND("waiting_for_horus") ", only got back to release it now."
  MODYOUTUBE("et58Ndob9M4")
  "<p>Unlike our last game, text-heavy " SEND("diluvium") ", <b>Pico Battle</b> is wordless. There is no contextual hints within the game, but an audio tutorial that starts automaticaly in the lobby.</p>"
  "<p>Upon launching the game, you will find yourself in the Lobby, a temporary haven. You should look for an hexagon floating about the edges of your screen (right click drag to rotate around the planet) and click on it to practice against the AI. You might see circles too, they are other players and could challenge you as soon as you raise your shield.</p>"
  "<p>To protect yourself against incoming attacks, find the patch of dirt marked by a black and white circle, and connect a node to it. The shield will light up, eating away at the incoming bullets with a similar hue. In the lobby, you are invisible to potential attackers as long as your shield is unpowered.</p>"
  "<p>To win against your opponent, locate a patch of mushrooms and connect nodes to it — this is your cannon. It needs a minimum amount of power to be able to fire, and based on the incoming nodes, will fire bullets of various sizes and colours; easier or harder to defend against. The idea being to match the colour of incoming bullets with your shield, and to differ as much as possible from the opponent's shield colour (which is indicated by the contour of his circular icon) with your cannon's bullets.</p>");
add_link(&pico_battle, "site", "http://theinstructionlimit.com/pico-battle");
add_link(&pico_battle, "sources", "https://github.com/Collegiennes/picoBattle");

Term spagettini_scale = create_term(&physical, "spagettini scale", "This Spagettini Scale was first featured on the Makerbot Blog and should help you always cook the right quantity of pasta.", 
  "<p>My first experiments were at creating household items.</p>");

Term spool_holder = create_term(&physical, "spool holder", "This Spool Holder works with the PP3DP Printer and should allow you to fit a larger spool on your printer.", 
  "<p>When you need big spools..</p>");
add_link(&spool_holder, "download", "http://www.thingiverse.com/thing:18833");

Term laeisthic = create_portal(&aliceffekt, "laeisthic", "The Laeisthic albums are Neauismetic albums occurring only within the Laeisth continent of Dinaisth.", NULL);

Term children_of_bramble = create_term(&laeisthic, "children of bramble", "Children Of Bramble is a Laeisthic album that sings of the Oasis of Rlionn.", 
  "<p>This album begins by the Oasis of " SEND("laeisth") " to finally reach the castle of " SEND("andes") " and its sandsunken structure.</p>"
  "<p>This single is the first part of the " SEND("laeisthic") " collection, and shares some narrative concepts with " SEND("telekinetic") ".</p>"
  MODBANDCAMP("163410848"));
add_link(&children_of_bramble, "bandcamp", "https://aliceffekt.bandcamp.com/album/children-of-bramble");

Term known_magye = create_term(&laeisthic, "known magye", "Known Magye is a Laeisthic album telling the tales of the industrious times of Dinaisth.", 
  "<p>Sometimes reminiscent of the compositions of " SEND("children_of_bramble") ", sometimes of the drowned sounds of " SEND("telekinetic") ", this single is a fair mix of ambient and breaks.</p>"
  "<p>This single is the second part of the " SEND("laeisthic") " collection, and was recorded live from " SENDNAME("travel", "San Fransisco") "'s <b>POW POW POW</b> which was controlled entirely with the " LINKNAME("https://www.leapmotion.com", "Leap Motion") ".</p>"
  MODBANDCAMP("1531404629"));
add_link(&known_magye, "bandcamp", "https://aliceffekt.bandcamp.com/album/known-magye");

Term extended_sleep = create_term(&laeisthic, "extended sleep", "Extended Sleep is the sequel album to Known Magye, a deeper exploration of its stories.", 
  "<p>This single is the third part of the " SEND("laeisthic") " collection, and was performed at the AMaze Festival in Berlin, on April 23rd 2015.</p>"
  MODBANDCAMP("2987872258"));
add_link(&extended_sleep, "bandcamp", "https://aliceffekt.bandcamp.com/album/extended-sleep");

Term duomic = create_portal(&aliceffekt, "duomic", "The Duomic albums are Neauismetic records of the travels of Neonev, from Duomo to Dilitriel.", NULL);

Term opal_inquisitors = create_term(&duomic, "opal inquisitors", "The Opal Inquisitors is the first Duomic album.", 
  "<p>These recordings are taken aboard the " SEND("vermillionth") " tunneler, traveling up the spires of " SEND("duomo") ", where " SEND("neonev") " departs from central " SEND("dinaisth") " and head through the " SENDNAME("dei_dain", "Dei Dain Canals") ".</p>"
  MODBANDCAMP("1049304423"));
add_link(&opal_inquisitors, "bandcamp", "https://aliceffekt.bandcamp.com/album/the-opal-inquisitors");

Term portalion = create_term(&duomic, "portalion", "Portalion is an album where Neonev leaves Duomo to explore the shores of Laeisth.", 
  "<p>On a foggy night of the <i>Sixth Season</i>, embarking on one of the vessels of the <i>Septechoes</i> in the desert of <i>Clionn</i>.</p>"
  "<p>" SEND("neonev") " sails toward <i>Whiinders</i> to see its <i>Immortal Birds</i> once more.</p>"
  MODBANDCAMP("1367389203"));
add_link(&portalion, "bandcamp", "https://aliceffekt.bandcamp.com/album/portalion");

Term dei_dain = create_term(&duomic, "dei dain", "Dei Dain is the third Duomic album.", 
  "<p>In which " SEND("neonev") " travels from the desert of " SEND("laeisth") " to the nightly scapes of " SEND("dilitriel") ".</p>"
  MODBANDCAMP("4246216793"));
add_link(&dei_dain, "bandcamp", "https://aliceffekt.bandcamp.com/album/dei-dain");

Term habitants_du_soleil = create_term(&duomic, "habitants du soleil", "Les Habitants Du Soleil is a single track Duomic album.", 
  "<p>The singular " SEND("duomic") " track <b>Nepturne 7757</b> is a moment in the narrative of the " SENDNAME("aitasla", "Aitasla Solei") ", the nearest star to " SEND("dinaisth") ".</p>"
  "<p>Our telescope has revealed a minuscule " SENDNAME("dinaisth", "satellite") " orbiting our world.</p>"
  "<p>我々の望遠鏡は、世界を周回する小さな衛星を検出しました。</p>"
  MODBANDCAMP("3495178462")
  "<p>The album cover was part of the " LINKNAME("http://famicase.com", "Famicase Exhibition 2018") " showcased at Super Meteor in Tokyo, " SEND("japan") ".</p>");
add_link(&habitants_du_soleil, "bandcamp", "https://aliceffekt.bandcamp.com/album/les-habitants-du-soleil");
add_link(&habitants_du_soleil, "famicase", "http://famicase.com");

Term lives = create_portal(&aliceffekt, "lives", "Various albums recorded as Lives.", NULL);

Term shikanokoa_vs_1h1d = create_term(&lives, "shikanokoa vs 1h1d", "Shikanokoa Vs 1h1d is an album of improvisational tracks.", 
  "<p>It was recorded in Osaka at the event of the same name.</p>");

Term pedestrian_paradise = create_term(&lives, "pedestrian paradise", "Pedestrian Paradise is an album made from various bits and pieces of unreleased material.", 
  "<p>It was recorded live at the <i>Piknik Electronic</i> event in Montreal.</p>"
  MODBANDCAMP("1545290997"));

Term nor_let_the_fools = create_term(&lives, "nor let the fools", "Nor Let The Fools created from unreleased materials.", 
  "<p>The album was recorded live, in Tokyo at a chiptune/mashup party.</p>"
  MODBANDCAMP("1838099761"));
add_link(&nor_let_the_fools, "bandcamp", "http://aliceffekt.bandcamp.com/album/nor-let-the-fools-mistake-love");

Term to_the_aeons_hell = create_term(&lives, "to the aeons hell", "To The Aeons Hell was created in the spirit of Nor let the fools, being a mixture of unreleased remixes.", 
  "<p>The album was recorded live, in Tokyo at a chiptune/mashup party.</p>"
  MODBANDCAMP("3333907614"));
add_link(&to_the_aeons_hell, "bandcamp", "http://aliceffekt.bandcamp.com/album/accursed-be-it-to-the-aeons-hell");

Term vermillionth = create_term(&lives, "vermillionth", "Vermillionth was the recording of the live performance at the Kinetik Festival, in Montreal.", 
  "<p>It was performed live with Yameki and Veroníque, at the large Usine C venue, it includes a cover of Memmaker.</p>");
add_link(&vermillionth, "bandcamp", "https://aliceffekt.bandcamp.com/album/vermillionth");

Term time_alloy = create_term(&polygonoscopy, "time alloy", "The Time Alloy is a series of Polygonoscopic samples, created for The sartre mechanism.", NULL);

Term demo = create_portal(&aliceffekt, "demo", "The Demo albums are created with specific pieces of hardwares.", NULL);

Term superworker = create_term(&demo, "superworker", "Superworker is an album created with the PO24.", 
  "<p>The album contains 3 tracks created from <i>over 80 sessions</i>, arranged into chiptune experiments.</p>"
  "<p>Due to the lack of power during the 4 weeks long " SENDNAME("marquesas", "ocean crossing") ", the pocket battery powered synth proved to be the perfect composition tool. The tracks also include spoken words from " LINKNAME("https://en.wikipedia.org/wiki/Alan_Watts", "Alan Watts") ".</p>"
  MODBANDCAMP("610742154"));
add_link(&superworker, "bandcamp", "https://aliceffekt.bandcamp.com/album/superworker");

Term supervisitor = create_term(&demo, "supervisitor", "Supervisitor is a concept album created with the Microbrute synthetiser by Arturia.", 
  "<p>The album was released during the event " SEND("dodecae") " in <b>Toronto</b>.</p>"
  MODBANDCAMP("3564075825"));
add_link(&supervisitor, "bandcamp", "https://aliceffekt.bandcamp.com/album/supervisitor");
add_link(&supervisitor, "itunes", "https://itunes.apple.com/ca/album/supervisitor-ep/id951144870");

Term dodecae = create_term(&supervisitor, "dodecae", "The Dodecae was a collaboration with the BentoMiso co-working space.", 
  "<p>Presented live experimental music from " LINKNAME("http://tympanikaudio.com/releases/ta025", "Adversary") ", " LINKNAME("https://ilkae.bandcamp.com", "Ilkae") ", " LINKNAME("https://dualryan.bandcamp.com", "Dualryan") " and " LINKNAME("https://aliceffekt.bandcamp.com", "Aliceffekt") " alongside the visualists " LINKNAME("http://theinstructionlimit.com", "Nonante") " and " LINKNAME("http://www.pocaille.com", "Melesul3") ".</p>"
  "<p>The event was following the yearly " LINKNAME("https://bentomiso.com/bit-bazaar-winter-market-2014/", "Bit Bazzar") " market on <i>December 6th, 2014</i>.</p>");
add_link(&dodecae, "event", "https://www.facebook.com/events/558238014277230/?fref=ts");

Term soundtrack = create_portal(&aliceffekt, "soundtrack", "The Soundtrack collection contains various scores written for Software projects.", NULL);

Term oquonie_soundtrack = create_term(&soundtrack, "oquonie soundtrack", "The Oquonie Soundtrack, Impossible Spaces, is the ambient score of the game Oquonie.", 
  MODBANDCAMP("2065824251"));

Term rabbits_soundtrack = create_term(&soundtrack, "rabbits soundtrack", "The Rabbits Soundtrack is the drone audio tracks of the Hundred Rabbits video diaries.", 
  "<p>This soundtrack contains 2 recorded podcasts and a selection of tracks from the videos.</p>"
  MODBANDCAMP("1969793667"));
add_link(&rabbits_soundtrack, "bandcamp", "https://aliceffekt.bandcamp.com/album/hundred-rabbits");

Term purgateus_soundtrack = create_term(&soundtrack, "purgateus soundtrack", "The Purgateus Soundtrack is the score for the Purgateus remix of the game Proteus.", 
  "<p>The album was recorded while talking across " SEND("purgateus") ".</p>"
  MODBANDCAMP("3667464517"));

Term noon_guest = create_term(&soundtrack, "noon guest", "Noon Guest is the official MoonQuest soundtrack.", 
  "<p>Created over the span of 2 years, this ambient album navigates across various biomes populated with a wide collection of <b>chatting critters</b>.</p>"
  "<p>The album condenses 70 minutes of xenomorphic field recordings into 25 minutes of ambience from the game, interspersed with fragments of electronic and techno music.</p>"
  MODBANDCAMP("3182076487"));
add_link(&noon_guest, "bandcamp", "https://aliceffekt.bandcamp.com/album/noon-guest");
add_link(&noon_guest, "on steam", "https://store.steampowered.com/app/511540/MoonQuest/");

Term remix = create_portal(&aliceffekt, "remix", "The Remix collection contains a list of the Aliceffekt remixes and unique tracks made for compilations.", NULL);
add_dict(&remix, &rare_tracks);

Term typography = create_album(&illustration, "typography", "Typography work created for Nataniev and Lietal projects.", 
  "<p>This font collection can be used freely on your projects. Enjoy.</p>");
add_link(&typography, "sources", "https://github.com/neauoire/Font-Collection");

Term vast = 
create_album(&physical, "vast", "Vast is the first book of Elodie Lareine, a manual of procedural imagery.", 
  "<p>I recently found myself illustrating " SENDNAME("miniscopie", "Elodie") "'s abstract book \"<i>Vast - the perfect, the circular, the subjugated</i>\".</p>"
  "<p>A strangely perfect nonsensical coffee table curiosity that grabbed me from the moment I heard of its ties with some of the same Borgesian concepts that have also been exploring lately.</p>"
  "<p>I have created a series of ink fractals to ornate the book's preface, table of content and cover.</p>"
  MODITCHIO("23341"));

Term defraction_optics = create_album(&physical, "defraction optics", "Defraction Optics is the second book of Elodie Lareine, a manual of procedural imagery, in the fashion of Vast.", 
  "<p>A guide to null;</p>"
  MODITCHIO("23342"));
add_link(&defraction_optics, "itch", "https://reine.itch.io/defractions");

Term thousand_rooms = create_album(&physical, "thousand rooms", "Thousand Rooms is a visual novel.", 
  "<p>" SEND("thousand_rooms") " was created in collaboration with illustrator " SENDNAME("rekka", "Rekka Bellum") ", following the behaviours of four characters and a room.</p>"
  MODITCHIO("146658")
  "<p>I have written this book with the hopes of creating a sort of <i>Borges for children</i>, in which the reader follows a bat, a cat, an owl and a fox who try and make sense of this " SENDNAME("paradise", "simple system") ".</p>"
  "<p>The book also encourages to try and understand the rules, and plan unsuggested avenues. We are releasing the book in English, French, Russian, Japanese & " SEND("lietal") ".</p>");
add_link(&thousand_rooms, "itcho", "https://hundredrabbits.itch.io/thousand-rooms");
add_link(&thousand_rooms, "sources", "http://github.com/hundredrabbits/Thousand-Rooms/graphs/contributors");

Term wallpapers = create_album(&illustration, "wallpapers", "Collection of Wallpapers related to Nataniev and Horaire.", NULL);

Term neauismetica = create_index(&research, "neauismetica", "The Neauismetica is a series of notes on the fiction of Dinaisth.", 
  "<p>The tales of the <b>Neauismetica</b> unfold on a minuscule " SENDNAME("dinaisth", "celestial object") ", where three " SENDNAME("characters", "Immortals") " dwell.</p>"
  "<p>Originally written in French, \"<b>Les Récits De Dinaisth</b>\" begins when most things have ended, on the surface of a Satellite where the remaining immortals have gathered, and are looking up at the <b>lightless skies</b>.</p>"
  "<p>This series of disjointed " SENDNAME("neon_hermetism", "concepts") ", " SEND("characters") " and " SENDNAME("dinaisth", "places") " are the connecting thread that lives through " SEND("aliceffekt") "'s music, " SENDNAME("devine lu linvega", "Devine") "'s " SENDNAME("illustration", "illustrations") ", and are the culture behind the " SEND("lietal") " Language.</p>"
  QUOTE("Immortals speak not with words, but wait for things to happen, and merely point at them.", "Coralinev")
  "<center><img src='../media/identity/crest.png' width='200'/></center>");

Term es_gulf_sunflowers = create_term(&neauismetic, "es gulf sunflowers", "Es Gulf Sunflowers is a Neauismetic album.", 
  "<p>It remembers the sunken fields of " SENDNAME("dinaisth", "Es") ", the underwater gate, and the vast ocean terrace with its display of sunflowers.</p>"
  MODBANDCAMP("1429563952"));
add_link(&es_gulf_sunflowers, "bandcamp", "https://aliceffekt.bandcamp.com/album/es-gulfssunflowers");

Term damoiseau_canalx = create_term(&neauismetic, "damoiseau canalx", "Damoiseau Canalx was created in the spirit of Blam, exploring industrial sounds with 2-step styles.", 
  "<p>The album was recorded live, at Passport in Montreal during the last AMP event and is being released as-is.</p>"
  "<p>The album was composed as side project while working on " SEND("ten_axitecture") " and includes bits and pieces from " SEND("blam") ".</p>"
  MODBANDCAMP("743341250"));
add_link(&damoiseau_canalx, "bandcamp", "https://aliceffekt.bandcamp.com/album/damoiseau-canalx");

Term the_sixth_season = create_term(&neauismetic, "the sixth season", "The Sixth Season sings the Neauismetic tales of the establishment of the Oasis by Rlionn.",
  "<p><i>Whiinders</i> and the likes, a glorious beginning in " SEND("laeisth") ".</p>"
  "<p>This album established the sound that " SEND("aliceffekt") " decided to persue for the " SEND("neauismetic") " releases.</p>");
add_link(&the_sixth_season, "bandcamp", "http://aliceffekt.bandcamp.com/album/orchestrate-the-sixth-season");

Term neon_hermetism = create_portal(&neauismetica, "neon hermetism", "Neon Hermetism is a collection of general Neauismetic concepts.", 
  "<p>The <b>Neon Hermetic</b> concepts are the foundations to understanding the " SEND("neauismetica") ", its characters and their purpose.</p>"
  "<p><b>Science has long since ended</b>, and has been replaced by the art of operating " SENDNAME("actors", "teleogic constructors") ", machines capable of looking across timelines and moving themselves toward the longest lasting " SENDNAME("soies", "Occurence") ".</p>"
  "<p><i>Beyond the computing beautiful, <br />sleeps languages of impossible meanings.</i></p>");

Term feu = create_term(&neon_hermetism, "feu", "The Feu era is known as the era of time which began at the End Of Science.", 
  "<p>From the moment " SENDNAME("actors", "Teleogic Constructors") " began altering the " SENDNAME("soies", "Courses of Time") " and will events into happening, traditional rational intelligence and curiosity were then seen as no more than crafts, or relics of a older time.</p>"
  "<p>As per <b>Neon Hermetism</b>, the whole dimensionality of Time is of a finished shape; accessible and " SENDNAME("soies", "traversible") ". It is hypothetized that the universe is an operating function, rendering a final organization of space via the " SEND("ehrivevnv") ". In order words, the universe exists to formulate a being which is to enter the celestial puzzle, and to emerge as the resulting value.</p>");

Term actors = create_term(&neon_hermetism, "actors", "The Actors are beings unaffected by determinism, that have free will.", 
  "<p>Their name \"<i>actor</i>\" comes from their ability to actually <b>act</b>, outside of the will of " SENDNAME("mirrors", "determinism") ".</p>"
  "<p>Natural Actors, or anomalies, were found to have existed before the " SEND("feu") ", but the True Age of Actors came about with the synthesis of the first Actor by " SEND("neonev") " and the Immigrants.</p>"
  "<p>The first synthesized " SENDNAME("actors", "actor") " was tasked to position itself into the " SEND("longest_end") ", meaning that it would effectively take control of all things, and of all of time, to steer the sequence of events allowing itself to exist within the " SENDNAME("longest_end", "longest lasting possible timeline") " of the computing occurrence.</p>"
  "<p>Actors have no names, and their number is unknown, it is possible that multiple actors, or multiple instances of the same actor, are competing for the " SENDNAME("soies", "Longest End") ".</p>");

Term ehrivevnv = create_term(&neon_hermetism, "ehrivevnv", "The Ehrivevnv is a dimensional puzzle.", 
  "<p>It presenting itself as a <b>synthetic celestial structure</b>, around which " SEND("dinaisth") " orbits.</p>"
  "<p>The Ehrivevnv was found to exists in the timelines that persisted until the End of Time(see " SEND("feu") "). This particularity has brough many forms of life to congregate onto " SEND("dinaisth") " to study it, and has given it its classification of puzzle.</p>"
  "<p>The puzzle is orbited by both " SEND("dinaisth") ", and " SEND("aitasla") ". Its discovery, and the research that it inspired, ultimately brought about the " SENDNAME("feu", "completion of Science") ".</p>"
  "<p>This superstructure is located further than natural light could ever reach, blanketed in perpetual darkness and cold, in near infinite space and " SENDNAME("vetetrandes", "stasized time") ". The only light ever to reach the surface of the puzzle is emited from " SEND("dinaisth") ".</p>"
  "<p>It is believed by " SEND("neon_hermetism") " that it might be the creation of " SEND("actors") " — " SEND("soies_injection") ".</p>"
  QUOTE("Et haec revelantur in virtute et veritate non Vi.", "Unknown"));

Term soies = create_term(&neon_hermetism, "soies", "The Soies are the studies of the influence of Actors.", 
  "<p>The " SENDNAME("soies_machine", "Soies machines") " finds their own location according to the " SEND("longest_end") ", by generating the value disallowed to exist withinin the currently renderer occuring.</p>"
  "<p>It allows for the study of unexisting events, to align the Occuring with the neighboring optimal possible worlds.</p>"
  "<p>In other words, by generating the first events outside of the renderable, or Possible World, the " SEND("actors") " steer themselves inside and outside of the possible and impossible chain of events, granting themselves access to various normaly impossible actions.</p>"
  "<center><img src='../media/identity/soies.png' width='200'/></center>"
  "<p>This line of research is tied to the discovery of the " SEND("ehrivevnv") " as the resolve of the puzzle only exists within the " SEND("longest_end") ".</p>");

Term longest_end = create_term(&soies, "longest end", "The Longest End is the succeeding occurence.", 
  "<p>The <b>Longest End</b> is the longest surviving occurrence amongst the inifities of other timelines.</p>"
  "<p>The " SEND("actors") "' goal is to steer the occurring chain of events to exist within the longest lasting instance of the universe.</p>");
// add_list(&longest_end, "<b>The Impossibilities</b>: The entirety of all potential spacetime. The impossibilities stores the events banned from happening, compressing the possible events.");
// add_list(&longest_end, "<b>The Possibilies</b>: The possible spacetime storages the events allowed by " SENDNAME("mirrors", "determinism") ", condensing into the occuring.");
// add_list(&longest_end, "<b>The Occuring</b>: While it is not technically allowed to traverse between possible and occuring space, the " SEND("soies") " model allow to manipulate the possible space by forcing events to occur outside of the resolving spacetime.");
// add_list(&longest_end, "<b>The Longest End</b>, or <i>resolving spacetime</i>: It is the surviving spacetime, its finality, the destination and meeting space of " SEND("actors") ".");

Term soies_machine = create_term(&soies, "soies machine", "The Soies Machine was the last machine.", 
  "<p>The <b>Soies Machine</b> is a kind of clock, with needles rotating around each available axis of space, at the fastest allowed speed by the " SENDNAME("soies", "Occurence") ".</p>"
  "<p>The purpose of the machine was to locate the required design across all timelines, forcing the " SENDNAME("soies", "Occuring") " to render as the " SEND("longest_end") ".</p>"
  "<p>Sealed in an <b>Optimal Cartesian Vaccum</b>, the clock spins inside a pocket of syntetic space ruled by optimal natural laws; an uttermost stable engineered universe, in a vaccum.</p>"
  "<p>Each \"needle\" rotate in its own dimension, vanishing upon reaching the fatest renderable possibility — Effectively locating the <b>occurring</b> within the possibles and impossible spaces.</p>");

Term soies_injection = create_term(&soies, "soies injection", "A Soies Injection is a syntetic event found in the occurring.", 
  "<p>Injections are unnatural events found in the " SENDNAME("soies", "Occurring") ", forced into existence by " SEND("actors") " condensing the possible events.</p>"
  "<p>The " SEND("andes_castel") " found in " SEND("laeisth") " is a known <b>injection</b>, the " SENDNAME("neon_hermetism", "Neon Hermetists") " suggest the " SEND("ehrivevnv") " to also be an injection.</p>");

Term neausea = create_term(&neon_hermetism, "neausea", "The Neausea is a sickness manifested in beings who knows their Soies position.", 
  "<p>" SEND("actors") " and beings such as " SEND("paradichlorisse") ", can carry it. A weaker form can be contracted when one is in contact with " SEND("nohlxeserre") " languages.</p>"
  "<p>The experience of <b>Neausea</b>, by the afflicted, would at first seem like one can travel through time. But the subject's impression of time-traveling is due to their focus shifting across possible sequences of events.</p>"
  "<p>To the observer, the subject would simply collapse, by the time the body would hit the ground, the subject's mental gaze would have traveled across different possible timelines, but would have in the process <i>lost the track of Time</i> — Effectively extracting themself from the " SENDNAME("soies", "Occurring") ".</p>"
  "<p>" SEND("andes") " is the only character known to have survived an encounter with the " SEND("nohlxeserre") " Languages. The fossilized mountains of corpses by the sides of " SEND("paradichlorisse") " are a testament of the ones who have tried to look at Time and perished.</p>"
  "<p><i>In debt are are my impossible selves, <br />for all the horrible days.</i></p>");

Term nohlxeserre = create_term(&neausea, "nohlxeserre", "Nohlxeserre is an hypothetical language from the Neauismetica.", 
  "<p><b>Nohlxeserre</b> is a language that delivers a richer and more precise rendition of its meaning than actual experience.</p>"
  "<p>The richness and detail of experiencing an event, pales in comparison to having it recited – Effictively inducing the symptoms of " SEND("neausea") ", stasis, and ultimately death.</p>"
  "<p>The Nohlxeserre Language is the language of the " SEND("actors") ". Andes, as opposed to " SEND("neonev") ", did not found itself on " SEND("dinaisth") " looking for " SEND("actors") ", but for " SEND("paradichlorisse") ". Whom Andes says \"<i>Speaks the language of the birds</i>\".</p>"
  "<q>When " SEND("paradichlorisse") " spoke of silence, silence fell.</q>");

Term dinaisth = create_portal(&neauismetica, "dinaisth", "Dinaisth is the name of the Satellite onto which unfolds the events of the Neauismetica.", 
  "<p><b>Dinaisth</b> is a small celestial object that orbits the " SEND("ehrivevnv") " megastructure, beyond the furthest reaching starlight.</p>"
  "<center><img src='../media/identity/dinaisth.flag.color.svg' width='300'/></center>"
  "<p>The <b>Flag of Dinaisth</b> depicts the " SENDNAME("ehrivevnv", "Ultraviolet Sun") ", reflected upon the " SENDNAME("kanikule", "Kanikule Ocean") " below the " SENDNAME("feu", "Lightless Sky") ".</p>");

Term kanikule = create_term(&dinaisth, "kanikule", "Kanikule is the ocean surrounding Neau.", 
  "<p><b>Kanikule</b> is an infinite ocean that an immortal would spend an infitite amount of time crossing, effectively reaching the outer-shores mortal.</p>"
  "<p>While one can sail away from its center, <b>Neau</b>, one cannot return to it, for it occupies no space in the ocean. Neau is a circular city at the center of " SEND("kanikule") ". The blue roofed city the birthplace of " SEND("lietal") ", and is also the place from which the " SEND("neauismetica") " derives its name.</p>");

Term vetetrandes = create_term(&dinaisth, "vetetrandes", "Vetetrandes is the remains of a city where Yajnev rests.", 
  "<p>As you would approach the epicenter of the bound city, time would become increasingly more " SENDNAME("soies_machine", "unmoving") ".</p>"
  "<p>At its center, one would find the corpse of " SEND("yajnev") ", and where Yajnev's head would have been, a hollow mask. Locked inside the mask is the only instance of true space that can be said to be \"outside\".</p>"
  "<p>The trek across Vetetrandes is only possible through the guiding of an " SENDNAME("actors", "Actor") ", as the local void existing in Vetetrandes is unacted, or unoperated and unredered.</p>"
  "<p>The " SENDNAME("neon_hermetism", "Neon Hermetists") " believe this location to be an ancient and broken " SEND("soies_machine") ".</p>");

Term laeisth = create_term(&dinaisth, "laeisth", "Laeisth is a desert on Dinaisth.", 
  "<p>Surrounding an Oasis, a blackened chasm where creeps the clones of its violent host " SEND("rlionn") ", the " SEND("andes_castel") " stands quiet.</p>");

Term andes_castel = create_term(&laeisth, "andes castel", "The Andes Castel is a large unnatural structure found in Laeisth.", 
  "<p>Injected into " SEND("dinaisth") " by " SEND("andes") ", the castellum is a seemingly artificial structure found North of the " SENDNAME("laeisth", "Laeisth Desert") ".</p>"
  "<p>While its intricate networks of ornate tunnels and decorated halls appear to suggest its creation to be the result of artificial construction —  It was found by the " SENDNAME("neon_hermetism", "Neon Hermetists") " to have come into being from the natural sway of the " SENDNAME("kanikule", "ocean") ", erosion and accumulation of debris, across a long period of time.</p>"
  "<p>When looking North from the " SENDNAME("laeisth", "Oasis") ", three High Towers, connected by bridges, are visible above the horizon. Its very existence suggest an " SENDNAME("soies_injection", "injection") " into the " SEND("soies") ".</p>"
  "<p>The bridge connecting the center, and highest, Tower(B) to the rightmost one(C)(when observed from the Oasis) has been sectioned. A silhouette of the Castel can be seen on the " SEND("neauismetica") " sigil.</p>"
  "<center><img src='../media/identity/crest.png'/></center>"
  "<p>The buildings have been mostly left vacant, except from the occasional visit of the " SENDNAME("rlionn", "Rlionns") ".</p>");

Term duomo = create_term(&dinaisth, "duomo", "Duomo covers most of the northern hemisphere of Dinaisth.", NULL);

Term neau = create_term(&kanikule, "neau", "Neau is a location found at the center of Kanikule.", NULL);

Term dilitriel = create_term(&dinaisth, "dilitriel", "Dilitriel is the central region of Dinaisth.", NULL);

Term aitasla = create_term(&dinaisth, "aitasla", "Aitasla is a satellite orbiting orbiting the Ehrivevnv.", 
  "<p>Folk stories, from " SEND("dinaisth") ", about the satellite include tall tales of the existence of beings with " SENDNAME("habitants_du_soleil", "large organic hats") ".</p>"
  "<p>The " SEND("aitasla") " object is rumoured to be the location of the " SEND("hiversaires") " station.</p>");

Term characters = create_index(&neauismetica, "characters", "Characters are a selection of resident Immortals of Dinaisth.", 
  "<p>While some happened to find themselves on " SEND("dinaisth") " for various reasons unrelated to the " SEND("ehrivevnv") ", the " SEND("neauismetica") " focuses on the handful few that worked directly with or alongside the " SENDNAME("neon hermetism", "neon hermetists") ".</p>"
  "<p>The name comes from the " SEND("nohlxeserre") ", which is also known as <b>The Language Of The Birds</b>.</p>");

Term rlionn = create_term(&characters, "rlionn", "Rlionn is a being who periodically manifest itself on Laeisth.", 
  "<p>Rlionn is not a single individual but a trait that manifests itself as a collective state of mind for the inhabitant of the Oasis.</p>"
  "<p>Spoken-of in tales and songs, the story of her children are sung in the album " SEND("children_of_bramble") " and illustrated in the " SENDNAME("laeisth", "The Rlionn Oasis") " short.</p>");

Term neonev = create_term(&characters, "neonev", "Neonev is a daughter of Rlionn.", 
  "<p>While most of " SEND("rlionn") "'s Children do not stray far from the Oasis, one has left the desert of " SEND("laeisth") " to travel " SEND("dinaisth") ".</p>"
  "<p><b>Neonev</b> has crossed " SEND("kanikule") " during the " SENDNAME("feu", "first season") ".</p>");

Term andes = create_term(&characters, "andes", "Andes immigrated through a Soies Injection.", 
  "<p>Shortly before the " SENDNAME("feu", "first season") " and brought along tools to study the " SEND("ehrivevnv") ".</p>"
  "<p><b>Andes</b> was already present on " SEND("dinaisth") " when " SEND("neonev") " and the other immigrants arrived, the role of Andes in the " SENDNAME("yajnev", "Yajnev Collapse") " is unknown, but his arrival coincides with the destruction of " SEND("vetetrandes") ".</p>"
  "<p>Prior to their arrival, a structure bearing their markings had been errected in " SEND("laeisth") ", known as the " SEND("andes_castel") ", suggesting an external manipulation of the " SEND("soies") ".</p>");

Term yajnev = create_term(&characters, "yajnev", "The death of Yajnev engulfed Vetetrandes in an opaque impenetrable lock.", 
  "<p>Yajnev is a <i>Local-type</i> " SENDNAME("actors", "actor") ", meaning that its acting was mainly spacial, and only briefly temporal.</p>"
  "<p>Its nervous imprint of local space could steer events locally, as well as affect time.</p>"
  "<p>The space, and time, surrounding its body was animated by " SEND("yajnev") "'s reflexion and thoughts. The effect of the Immigrats approaching " SEND("dinaisth") " might have caused the collapse, as it may have had an effect similar to that of a foreign body injecting itself in the network of dimensional nerves.</p>");

Term paradichlorisse = create_term(&characters, "paradichlorisse", "Paradichlorisse is a machine that speaks Nohlxeserre.", 
  "<p>Its purpose is unknown, but it was observed reciting stories in a fashion that ressembled the navigation of the " SEND("soies") ".</p>"
  "<p>Upon reaching its location, one would infinitely collapse as they would begin experiencing <i>every life and every death</i> for ever, recited in the " SENDNAME("nohlxeserre", "speech") " of the infinite being.</p>"
  "<p><i>When Paradichlorisse spoke of silence, silence fell.</i></p>");

Term photography = create_portal(&visual, "photography", "The Photography Portal collects various albums over multiple mediums.",
  "<p>View the list of " SEND("camera") " equipment.</p>");

Term macro = create_album(&photography, "macro", "The Macro album contains various shots from up close.", NULL);

Term personal = create_album(&photography, "personal", "The Personal album contain various memories.", NULL);

Term film = create_album(&photography, "film", "Color Film photography diary of the life aboard Pino.",
  "<p>This album will be periodically updated with shots taken with the " SENDNAME("camera", "250 Jaher") " Voigtländer.</p>"
  "<p>A " SEND("black") " and white album is also maintained.</p>");

Term black = create_album(&photography, "black", "Black and White film photography diary of the life aboard Pino.",
  "<p>This album will be updated periodically, shot with the " SENDNAME("camera", "250 Jaher") " Voigtländer.</p>"
  "<p>A color film photography album can be found " SENDNAME("film", "here") ".</p>");

Term infrared = create_album(&photography, "infrared", "The Infrared photographs were taken with a modified Nikon camera.", NULL);

Term travel = create_portal(&photography, "travel", "Travel diaries around the world.", NULL);

Term japan = create_portal(&travel, "japan", "A variety of diary entries written throughout trips to Japan.", 
  QUOTE("Let's never come here again 'cos it would never be as much fun.", "Charlotte, Lost in Translation"));

Term minamiise = create_album(&japan, "minamiise", "We sailed to Minamiise in the spring of 2019, from Shizuoka.", 
  "<p>Go to the last train station, take the bus and get off at the last stop, walk to the end of town and proceed into the forest. When the forest ends and you find yourself on the shore, you will have arrived.</p>"
  QUOTE("There are no trains in Minamiise.", "Wikipedia"));

Term shizuoka = create_album(&japan, "shizuoka", "We sailed to Shizuoka in the late winter of 2019, from Ogasawara.", 
  "<p>We sailed to " SEND("shizuoka") ", from " SEND("ogasawara") ", which offered the most beautiful sight of " SENDNAME("fuji", "Mount Fuji") ".</p>");

Term ogasawara = create_album(&japan, "ogasawara", "We sailed to Ogasawara in the late winter of 2019, from Fiji.", 
  "<p>We sailed into the " LINKNAME("https://en.wikipedia.org/wiki/Bonin_Islands", "Futami arbor") " on our way to " SENDNAME("japan", "Osaka") " from the " SENDNAME("marshall_islands", "marshall islands") ".</p>"
  "<p>The island of Chichijima is one of the most beautiful place I have had the chance of spending time at, it exists at the intersection of my favourite climate and " SENDNAME("nutrition", "foods") ". We spent our time there " SENDNAME("bike", "cycling") " up and down the coastal slopes, and cooking delicious meals from our favourite Japanese ingredients.</p>"
  "<p>Reaching the Japanese island marked the completion of a " SENDNAME("goals", "dream of mine") ".</p>"
  MODYOUTUBE("ueTCjpNXing"));

Term yokohama = create_album(&japan, "yokohama", "We cycled to Yokohama, from Tokyo.", NULL);

Term fuji = create_album(&japan, "fuji", "Our trip up Mount Fuji, Japan.", 
  "<p>We climbed it at night, and arrived at the top for sunrise.</p>");
add_link(&fuji, "wikipedia", "https://en.wikipedia.org/wiki/Mount_Fuji");

Term osaka = create_album(&japan, "osaka", "We traveled to Osaka in 2010 to attend the 1H1D music festival, and returned in 2019.", NULL);

Term tokyo = create_album(&japan, "tokyo", "Unforgettable time in Tokyo between 2010 and 2012.", NULL);

Term fiji = create_album(&travel, "fiji", "We sailed to Fiji from New Zealand, aboard Pino.", 
  "<p>We lived by the towns of " LINKNAME("https://en.wikipedia.org/wiki/Savusavu", "Savusavu") ", " LINKNAME("https://en.wikipedia.org/wiki/Lami,_Fiji", "Lami") " and " LINKNAME("https://en.wikipedia.org/wiki/Vuda_Point", "Vuda") " for the Summer of 2018.</p>"
  "<p>We stopped in <b>Fiji</b> on our way to " SEND("japan") " from " SEND("new_zealand") ", living off watermelon and bittermelon, breadfruit and passionfruit. It felt great to finally be pointing North, after heading west throughout our " SEND("marquesas") " Ocean crossing.</p>");

Term marquesas = create_album(&travel, "marquesas", "Travel pictures from our crossing of the South Pacific Ocean, from Mexico to the Marquesas.", 
  "<p>Some of the first pictures taken after " SENDNAME("the_sublime", "sailing across") " the South Pacific Ocean from " SEND("mexico") " to the " LINKNAME("https://en.wikipedia.org/wiki/Marquesas_Islands", "Marquesas Islands") ".</p>"
  "<p>We then proceeded toward " SEND("niue") " island.</p>");
add_link(&marquesas, "trip", "http://100r.co");

Term marshall_islands = create_album(&travel, "marshall islands", "We sailed to the Marshall Islands from Fiji, aboard Pino.", 
  "<p>We lived in <b>Majuro</b> for a few weeks waiting for a weather window to would allow us to sail " SENDNAME("japan", "north") ".</p>");

Term niue = create_album(&travel, "niue", "That time we sailed to the gorgeous coral shores of the country of Niue.", 
  "<p>We reached the " LINKNAME("https://en.wikipedia.org/wiki/Niue", "incredible island") " of " SEND("niue") " in July of 2017, on our way across the " SEND("marquesas") " Ocean.</p>"
  "<p>We anchored by the pier, and explored its canyons and chasms for a week, before proceeding toward " SEND("new_zealand") ".</p>");
add_link(&niue, "wikipedia", "https://en.wikipedia.org/wiki/Niue");

Term france = create_album(&travel, "france", "That time I played a show in Paris, France.", NULL);

Term the_sublime = create_album(&travel, "the sublime", "The Sublime, are various pictures taken at sea aboard Pino.", NULL);

Term new_zealand = create_album(&travel, "new zealand", "That time we lived in New Zealand.", 
  "<p>Most of our <b>New Zealand</b> pictures were taken on " SEND("film") ".</p>"
  "<p>We sailed to New Zealand aboard " SEND("pino") " in 2016, from " LINKNAME("https://en.wikipedia.org/wiki/Tonga", "Tonga") ", on our way to " SEND("japan") ", during our " SEND("marquesas") " circumnavigation. We were moored in Whangarei for 8 months.</p>");

Term america = create_album(&travel, "america", "Various landscapes taken around America.", 
  "<p>Some taken while in a 52 hours train ride during " LINKNAME("http://trainjam.com", "Train Jam") " in 2015, from Chicago; others taken when we " SENDNAME("pino", "sailed") " into the San Francisco Bay from Vancouver.</p>");

Term germany = create_album(&travel, "germany", "That time I played a show in Berlin, Germany.", 
  "<p>We first went to " SEND("germany") " for the Amaze festival, and I later returned for the React Berlin conference and a livecoding show.</p>");

Term austria = create_album(&travel, "austria", "Trip to Austria, in September of 2015, for Ars Electronica.", NULL);

Term netherlands = create_album(&travel, "netherlands", "Trip to Netherlands in 2015 for Indievelopment.", NULL);

Term czech = create_album(&travel, "czech", "Trip to Czech Republic in 2011.", 
  "<p>Back in " SENDNAME("calendar", "2011") ", I traveled alone and spent a few days with friends in " LINKNAME("https://en.wikipedia.org/wiki/Prague", "Prague") " and nearby.</p>");

Term canada = create_album(&travel, "canada", "Despite being from there, Canada has become a travel destination to me.", NULL);

Term mexico = create_album(&travel, "mexico", "That time we lived in Mexico.", NULL);

Term devine_lu_linvega = create_term(&about, "devine lu linvega", "Devine Lu Linvega is a generalist.", 
  "<p><b>Devine Lu Linvega</b> is composing " SENDNAME("audio", "experimental music") ", illustrating a " SENDNAME("visual", "fictional world") ", and developing " SENDNAME("research", "esoteric software") ".</p>"
  "<p>Since 2006, Devine has been populating this " SENDNAME("about", "wiki") " with notes on various topics, including on " SEND("language") ", " SEND("lifestyle") " and " SEND("nutrition") ". You can learn more about their <b>related interests</b> in the " SEND("mirrors") ", and in the " SEND("directory") ".</p>"
  "<p>They currently live aboard a " SENDNAME("pino", "sailboat") ", somewhere along the foggy coast of " SEND("japan") ". You can follow their position " LINKNAME("http://100r.co/live", "here") ", or learn more about offgrid living " LINKNAME("https://100r.co/site/off_the_grid.html", "here") ".</p>"
  "<p>Get in touch via email at <b>aliceffekt@gmail.com</b>, or<br />on the fediverse at <b><a href='http://merveilles.town/@neauoire' target='_blank' rel='noreferrer' class='external '>merveilles.town/@neauoire</a></b>.</p>"
  "<q>To flee is Life,<br />To linger, " SEND("death") ".</q>");

Term lifestyle = create_index(&devine_lu_linvega, "lifestyle", "The collection of diary entries on Lifestyle.", 
  "<p>I rarely find myself blogging, but from time to time, I will write a long-form reply to someone on a forum, I've collected these entries here. You can find more collected questions & answers in the " SEND("faqs") ".</p>");

Term aesthetics = create_term(&lifestyle, "aesthetics", "The Aesthetics diaries.", 
  "<p>I have aligned my life toward a singular design, the <b>acceleration of Arts & Science</b>.</p>"
  "<p>The analysis of " SENDNAME("horaire", "personal statistics") " recorded through " SENDNAME("routine", "daily journaling") ", revealed that " SEND("travel") " converts into the most " SENDNAME("horaire", "hours of inspiration") ". From this insight, I have oriented my creative work toward facilitating opportunities to travel.</p>"
  "<p>Multi-tasking revealed itself to have a negative impact on my productivity. Working within the confines of a single medium, would convert into long periods of lesser creativity and intermittent productivity. Living at any one place over a period of a year showed a decay in inspiration. Leaving school, learning to play music, moving abroad — showed an improvement in the realization of <i>Arts & Sciences</i>.</p>"
  "<p>Automating work always converted to higher long-term output than attempts at brute force. Building specific " SEND("tools") " mostly returned higher performance than " SENDNAME("about", "learning general purpose tools") ".</p>"
  "<q>Optimizing toward the <b>need for less revenue</b> has yielded better results than optimizing toward the generation of more.</q>"
  "<p>Remaining immobile in moments of doubts and planning, always converted into better output, against acting impulsively and making possible accidental steps away from the acceleration of <i>Arts & Sciences</i>.</p>"
  "<p>I have kept " SENDNAME("journal", "journals") " recording the oscillation of <b>Efficiency</b> and <b>Effectiveness</b>, and used this data to optimize and navigate my own personal tempers of productivity. Based on previously recorded patterns, I assign to myself each day a single task to complete. The task is chosen specifically to utilize the optimal amount of available stamina.</p>"
  "<p>When a workday ends before the daily task is completed, the day was a planning failure; and the task is broken down into smaller tasks, each assigned to one day. When a task is completed too early, the day is also a planning failure.</p>"
  "<p>I do not get out of bed until I have chosen a task to complete & and a lesson to learn, and I do not go to sleep until I have " SENDNAME("routine", "logged the results") ". The tasks are selected in the following order: I first address the problems that slow me down, the things I find lacking in my life and the answers to questions that occupies my mind.</p>");

Term nomad = create_term(&lifestyle, "nomad", "The Nomad diaries.", 
  "<p>My first encounter with a <i>sailing nomad</i> was during my stay in " SENDNAME("czech", "Prague") ". There was a time when I may have felt homesick, but for now, <i>Home</i> was becoming an increasingly vague concept shedding the little meaning it might have once held.</p>"
  "<p>The monthly rent of our beach-side appartment in " SEND("tokyo") " was of about 1.75K$, and transitioning from it, to a sailboat, implicated some serious downsizing. The way we looked at it was that, within 3 years, our 20K$ sailboat would be paid at the rate of 600$ per month — Or that by halving the costs of our current living situation, we could become both \"homeowners\" while keeping our traveling options open.</p>"
  "<p>To think that, at the time, the harder things to let go of were instruments, old consoles, books and some camera equipment — When the truly hard things to let go of would be the habitual bath, tap water and reliable internet connection. </p>"
  "<p>But surely I did not do all this travel for the travel alone, I must have had passions, habits and goals before I left — Everything that used to define me is beginning to feel increasingly like distractions, simulations to protect me from truly experiencing anything. I had never let myself feel cold, I had never let myself feel hungry.</p>"
  "<p>The wind rocks the ship sideways, keeping me up at night, but all I can feel is that humbling sense of being present and part of nature. I have long forgotten about tap water, don't mind the warm water from the plastic jugs, I began to wonder why people even feel the need to take showers every day, and time away from social networks really does make me feel better.</p>"
  "<q>I traded the things I thought I cared about, for things I didn't know existed.</q>"
  "<p>Eventually, I got back to building things, I learned how to fix sails, repair a toilet, create electronic systems, maintain an engine — Even to live without power.</p>"
  "<p>We have seen every sunset and almost every sunrise, we have sailed with dolphins, we have climbed mountains on deserted islands, and we have met the most amazing people. When it is our time to go, we will have no regrets, for we were fortunate to have seen more than most.</p>");

Term routine = create_album(&lifestyle, "routine", "Notes on Routine and Habits.", 
  "<p>A <b>typical day</b> usually begins at around 6:00am.</p>"
  "<p>I tend to try and <b>keep my eyes shut</b> until I have mentally drafted a " SENDNAME("aesthetics", "rough plan") " of the things I will want to have done by the end of that day. I rise to grind coffee — I usually ever <b>only drink one cup</b> per day.</p>"
  "<p>I immediately set off to complete the task I planned in bed. I know to have about 3 hours of undisturbed flow before the distraction surrounding lunch-time pulls me away from the work. My goal for each day, is to complete <b>a single task</b> that should take about 3 hours to complete — Or between " LINKNAME("https://en.wikipedia.org/wiki/Pomodoro_Technique", "4 to 5 pomodoros") ".</p>"
  "<p>After the last pomodoro, I usually <b>cook for a half-hour</b>, and then <b>eat for a half-hour</b>, and then <b>walk for a half-hour</b>, to fully leave the haze of the <i>flowstate</i>. The afternoon is spent doing maintenance, superficial work and experiments. But mostly, the afternoon is spent reading and learning. The goal is to build a catalog of exciting things to wake up to the next day and to experiment with.</p>"
  "<p>The superficial work that I do involves replying to blogs & forums, editing wikipedia entries, doing maintenance to various repositories, answering emails and so on..</p>"
  "<p>The day ends with <b>journaling for a half-hour</b> at which point I record the task done, and the " SENDNAME("mirrors", "lessons learned") ". Before sleeping, I usually <b>read for a half-hour</b>, I go to bed with a " SENDNAME("readings", "book") ", and a highlighter pen. I overline the things I want to keep for a later use, or to revisit.</p>");
add_link(&routine, "full interview", "https://interfacelovers.com/interviews/devine-lu-linvega");

Term longtermism = create_term(&lifestyle, "longtermism", "Notes on Longtermism and sustainability.", 
  "<p>In an age of disposable smart devices and unrepairable electronics, there are few topics that occupy my mind as much as <b>solutioning for technological resilience</b>.</p>"
  "<p>" SENDNAME("pino", "Living aboard a sailboat") ", away from reliable internet connectivity and outside of delivery networks, encourages us at " SENDNAME("hundred_rabbits", "Hundred Rabbits") ", to consider ways with which we can strenghten the toolset onto which we rely, to reflect on novel ways to simplify the systems that we use, and to optimize toward more environmentally conscious practices.</p>"
  "<p>We must abandon 3-in-1 packages, bloated always-online services and general planned obsolesce, and establish practices of recyclism, minimum viable products, small-sharp modular utilities. We see smart and resilience as opposing attributes to a device, smart is inherently contrary to a single purpose tool, and thus incompatible with longtermism.</p>"
  "<p>Our focus over the past years has gradually shifted toward open-source software and modular(combinable) electronics. Looking back, we are proud of the open-source tools that we created, enabling a handful of people to exit subscription services, and inscrutable closed-source utilities. Moving forward, we are thinking more and more about hardware, or at least software that resides closer to the metal.</p>"
  "<p>I periodically find myself thinking about operating systems, or more specifically the interaction design of OSes. In attempting to tackle the difficult UX challenges of that space, unrealizing that my failure to solve these issues might very well come from the simple fact that the purpose of operating systems is to enable multi-tasking, multi-tasking that I try to eradicate from my daily life, making these issues deeply unsolvable and my love for sharp tools and OSes irreconcilable.</p>"
  "<p>Sometimes I wonder if we shouldn't re-orient our focus onto things that can run on small low-power open-source single-purpose boards, but I also consider the impact of pushing for the purchase and production more electronics as problematic; perhaps creating software targeting old hardware might be what I'm looking for.</p>"
  "<p>Despite all this, I dream of a line of simple electronics, each one designed for a single purpose. Or even for things beyond the realm of electronics, like a kit bicyle with all its superfluousities removed.</p>"
  "<p>My dream sailboat has no diesel engine, no fuel outboard and no lead acid battery storage, but instead a compressed air engine with its compression stored in diving tanks, a bike crank powered compressor, a hydro generator pump, and a dynamo to charge our low-power electronics. The only crucial electronic systems connected to the house tanks would be the AIS transceiver, the VHF radio, a basic chartplotter and habitat lighting. Our work and entertainment electronics, like our laptops and cameras, would run off solar charging a minimal array of LiPo batteries.</p>"
  "<p>Is there a way to create and distribute software and electronics in a way that is environmentally conscious? perhaps " LINKNAME("https://en.wikipedia.org/wiki/Degrowth", "not") ".</p>");

Term nutrition = create_album(&lifestyle, "nutrition", "The Nutrition diaries.", 
  "<p>The function of proteins is to be used for tissue growth and repair, but when carbohydrates and calories are lacking, proteins can be consumed for fuel.</p>"
  "<p>The human body's own proteins are constantly being broken down into <b>amino acids</b> and used throughout its systems.</p>"
  "<p>The human body is mostly made of proteins, and proteins are made of amino acids - permutations of carbon, oxygen, hydrogen, nitrogen and sometimes sulphur. There are 22 amino acids in total and all but 9 can be synthesized, the <b>Essential Amino Acids</b>.</p>"
  "<p>To be used for growth and repair, a protein needs have access to the full sequence of required essential amino acids. If an essential amino acid is missing, the unusable remaining amino acids are broken down into fats or sugars.</p>"
  "<p>Examples of foods with essential amino acid content of at least 70% of a complete protein(see <i>Limiting Amino Acids</i>) are oats, garbanzo beans, sunflower seeds, buckwheat, red/white/black beans, rice, peanuts and pumpkin seeds.</p>"
  "<q>There are a few things in life that are as transformative and transhumanistic as " SEND("nutrition") "</q>"
  "<p>There are also high-quality proteins in green beans, swiss chard, broccoli, mustard greens, asparagus and potatoes but in lesser quantity.</p>"
  "<p>Soy products have within them 100% of a complete protein, or the correct ratio of essential amino acids for the body to use in tissue growth and repair.</p>"
  "<p>The high-quality protein foods can be made whole by combining with other ingredients, but the basic optimal combinations is <b>Beans with grains, nuts or seeds</b>.</p>"
  QUOTE("The doctor of the future will give no medicine, but will instruct his patient in the care of the human frame in diet and in the cause and prevention of diseases.", "Thomas Edison, 1903"));
add_link(&nutrition, "wikiversity", "https://en.wikiversity.org/wiki/Should_we_go_vegan%3F");
add_link(&nutrition, "vegan health", "https://veganhealth.org/daily-needs/");
add_link(&nutrition, "low-cost meals plans", "https://www.vrg.org/journal/vj2006issue2/2006_issue2_mealplans.php");

Term journal = create_term(&devine_lu_linvega, "journal", "The Journal shows recent activity.", NULL);
add_link(&journal, "rss feed", "https://wiki.xxiivv.com/links/rss.xml");

Term tracker = create_term(&journal, "tracker", "The Tracker shows latest changes of the journal.", 
  "<p>This wiki uses the " SENDNAME("arvelie", "Arvelie time format") ", find today's date and learn more about the time formats " SENDNAME("time", "here") ". Visit the " SEND("calendar") " to see the list of past and upcoming events, or check out the " SENDNAME("now", "/now page") " to find active projects.</p>");
add_link(&tracker, "rss feed", "https://wiki.xxiivv.com/links/rss.xml");

Term calendar = create_term(&journal, "calendar", "The Calendar shows upcoming and past events of the journal.", 
  "This wiki uses the " SENDNAME("arvelie", "Arvelie time format") ", find today's date and learn more about the time formats " SENDNAME("time", "here") ". To see a list of recent changes to the wiki, see the " SEND("tracker") ".");
add_link(&calendar, "rss feed", "https://wiki.xxiivv.com/links/rss.xml");

Term identity = create_term(&journal, "identity", "Various notes on the visual choices made for the Nataniev projects.", 
  "<p>Additional details can be found in the " SEND("faqs") ".</p>");

Term meta = create_term(&journal, "meta", "Various notes on the wiki itself.", 
  "<h3>Templating</h3>"
  "<table border='1'>"
  "<tr><td>{hundred_rabbits}</td><td>send unnamed</td></tr>"
  "<tr><td>{https://wiki.xxiivv.com}</td><td>link unnamed</td></tr>"
  "<tr><td>{hundred_rabbits send description}</td><td>send named</td></tr>"
  "<tr><td>{https://wiki.xxiivv.com link description}</td><td>link named</td></tr>"
  "</table>");

Term now = create_term(&journal, "now", "The now page shows infographics of current activity.", 
  "<p>The history of project activity is recorded with the " SENDNAME("horaire", "horaire time-tracker") ", to find the complete history of activity, visit the " SEND("tracker") ".</p>");

Term inventory = create_portal(&devine_lu_linvega, "inventory", "The collection of technical details on the Inventory.", 
  "<p>Some of the items I carry around with me in my " SENDNAME("travel", "travels") ".</p>");

Term everyday = create_album(&inventory, "everyday", "Everyday items found in my bag or pockets.", NULL);
add_list(&everyday, &everyday_items);

Term essentials = create_album(&inventory, "essentials", "Most practical cooking and repair tools.", 
  "<p>Here are some of my favourite items aboard " SEND("pino") ".</p>");
add_list(&essentials, &essentials_items);

Term skate = create_album(&inventory, "skate", "The Skate specs.", 
  "<p>For when the sun is just about to set, and when the road is that perfect kind of slick, we carry a little " LINKNAME("https://www.pennyskateboards.com/us/blackout-27.html", "skateboard") " with us on " SEND("pino") ". We have the 68cm board, with the 59mm wheels.</p>");

Term bike = create_album(&inventory, "bike", "The Bike specs.", 
  "<p>The bike that I presently carry aboard our sailboat " SEND("pino") ", it has been modified quite a bit, notably that its bolts and nuts have been replaced with 316 marine-grade stainless steel to sustain some salt water spray.</p>"
  "<p>This is the <b>Trek District S</b>(2014), with a travel ratio of 48/15(3.2), the tires are 700x25C(200g) and the tubes 700x18-25C with 48mm valves. I chose the aluminum wheel because it can be installed with an ilan key alone, it is made entirely of aluminum so it does not rust as much as the other less resilient lighter wheels I had. My lock is the Abus Foldable.</p>");

Term studio = create_album(&inventory, "studio", "The Studio equipment.",
  "<p>While the " SEND("aliceffekt") " sounds were mostly sampled from the " LINKNAME("https://www.arturia.com/microbrute/overview", "Microbrute") ", the " SEND("alicef") " sounds came from the " LINKNAME("https://www.eltamusic.com/polivoks-mini", "Поливокс") ".</p>");
add_dict(&studio, &studio_workstation);
// add_code(&studio, "Factory Reset: A + B while plugging in the power.");
// add_code(&studio, "Calibrate: Bypass + B footswitches for two seconds.");

Term computer = create_album(&inventory, "computer", "Technical details on my current Computer setup.", 
  "<p>I presently use an <b>Apple Macbook Pro</b> with the " LINKNAME("https://elementary.io", "Elementary") " GNU/Linux operating system. I also occasionally use " SEND("plan9") " and " SEND("macintosh")" for various experimental projects.</p>"
  "<p>I also use a " SENDNAME("keyboard", "mechanical keyboard") " and an old Intuos 3 Wacom tablet. To learn more about which audio equipment I use, see the " SEND("studio") ".</p>");
add_dict(&computer, &macbook_workstation);
add_dict(&computer, &software_links);
add_link(&computer, "usesthis", "https://usesthis.com/interviews/devine.lu.linvega/");

Term macintosh = create_portal(&computer, "macintosh", "Notes and links related to the Macintosh II computer.", 
  "<p>The " LINKNAME("https://en.wikipedia.org/wiki/Macintosh_II", "Macintosh II") " computer used the excellent OS7 operating system, supporting great software such as " SENDNAME("hypertalk", "Hypercard") ", and " SENDNAME("pascal", "THINK Pascal") ".</p>");
add_dict(&macintosh, &macintosh_software);
add_link(&macintosh, "Mini vMac", "https://www.gryphel.com/c/minivmac/");
add_link(&macintosh, "macintosh cookbook", "https://github.com/hundredrabbits/Macintosh-Cookbook");

Term hypertalk = create_album(&macintosh, "hypertalk", "Hypertalk is the programming language used in the mac software Hypercard.", NULL);
add_link(&hypertalk, "tutorial guide", "https://opus.uleth.ca/bitstream/handle/10133/856/Christmas_Kevin_G.pdf");
add_link(&hypertalk, "tutorial video", "https://www.youtube.com/watch?v=LVq67vYyAqo");
add_link(&hypertalk, "tips and tricks", "http://www.jaedworks.com/hypercard/HT-Masters/scripting.html");

Term pascal = create_album(&macintosh, "pascal", "Pascal is an imperative and procedural programming language designed for teaching students structured programming.", 
  "<p>My main interest in the language is building little " SEND("macintosh") " applications, and generally exploring the " LINKNAME("https://qiita.com/ht_deko/items/cd245180363e1911afa7", "THINK PASCAL 4.0.2") " compiler. I have saved many example files in the " LINKNAME("https://github.com/hundredrabbits/Macintosh-Cookbook", "Macintosh Cookbook") " repository.</p>");
add_link(&pascal, "macintosh cookbook", "https://github.com/hundredrabbits/Macintosh-Cookbook");
add_link(&pascal, "pascal central", "http://pascal-central.com");
add_link(&pascal, "user manual", "https://archive.org/details/THINKPascalUserManual1991/mode/2up");

Term plan9 = create_album(&computer, "plan9", "Notes and links related to the Plan9 operating system.", 
  QUOTE("An argument for simplicity and clarity.", "Rob Pike"));
add_dict(&plan9, &plan9_links);
add_link(&plan9, "notes", "https://github.com/neauoire/p9-notes");
add_link(&plan9, "irc", "https://9p.io/wiki/plan9/IRC/index.html");

Term camera = create_album(&inventory, "camera", "The Camera specs.", 
  "<p>For " SEND("film") ", I use the <b>Voigtländer's Bessa R3M 250 Jahre</b>, and for digital, <b>Sony's Alpha a6000 24.3 MP</b>.</p>"
  "<p>My favourite " SENDNAME("black", "black and white") " film is " LINKNAME("http://amzn.to/2GgyBUX", "Ilford's DELTA 3200") ". I use Novoflex's " LINKNAME("https://www.novoflexus.com/products/lens-adapters/for-leica-lenses/novoflex-nex-lem.htm", "NEX/LEM Adapter") " to fit M-Mount lenses.</p>"
  "<p>My lenses are the Voigtländer Super Wide Heliar <b>15mm</b> f4.5, the Voigtländer Ultron <b>28mm</b> f2 and the Nikkor <b>50mm</b> f1.2</p>");

Term keyboard = create_album(&inventory, "keyboard", "The mechanical Keyboard specs.", 
  "<p>I currently use the " LINKNAME("https://olkb.com/planck/hi-pro-mod-aluminum-milled-bottom", "OLKB Hi-pro mod") " Planck 6 hotswap, plate, Halo Clear switches and Acute caps.</p>"
  "<h3>Previous Models</h3>"
  "<p>The keycaps were the " LINKNAME("https://www.massdrop.com/buy/npkc-blank-pbt-keycaps", "Blank Mint PBT") " with " LINKNAME("http://www.keyboardco.com/blog/index.php/2012/12/an-introduction-to-cherry-mx-mechanical-switches/", "Red Cherry MX") " switches. I have also installed " LINKNAME("http://www.amazon.ca/gp/product/B00VHXHP6Q?psc=1&redirect=true&ref_=oh_aui_detailpage_o00_s00", "sound dampening o-rings") ". The keyboard connected, with a braided " LINKNAME("http://www.amazon.ca/gp/product/B004YD6LW0?psc=1&redirect=true&ref_=oh_aui_detailpage_o00_s00", "90 degrees angle USB wire") ". The color choice is inspired from the " SEND("verreciel") " interface.</p>");

Term directory = create_album(&devine_lu_linvega, "directory", "The Directory is a curated list of timeless art.", NULL);
add_dict(&directory, &books);
add_dict(&directory, &movies);
add_dict(&directory, &albums);
add_dict(&directory, &comics);
add_dict(&directory, &videogames);

Term bookmarks = create_term(&directory, "bookmarks", "The Bookmarks is a curated list of websites.", 
  QUOTE("Computer Science is no more about computers than astronomy is about telescopes.", "E. W. Dijkstra"));
add_dict(&bookmarks, &technology_links);
add_dict(&bookmarks, &hardware_links);
add_dict(&bookmarks, &operating_system_links);
add_dict(&bookmarks, &plan9_links);
add_dict(&bookmarks, &programming_links);
add_dict(&bookmarks, &solarpunk_links);
add_dict(&bookmarks, &personal_wiki_links);
add_dict(&bookmarks, &wiki_links);
add_dict(&bookmarks, &podcast_links);
add_dict(&bookmarks, &blog_links);
add_dict(&bookmarks, &entries_links);
add_dict(&bookmarks, &collapsology_links);
add_dict(&bookmarks, &general_knowledge_links);
add_dict(&bookmarks, &software_links);

Term readings = create_term(&directory, "readings", "The Readings is a curated list of books.", 
  "<p>For a list of all time favourites, see " SEND("directory") ".</p>");
add_dict(&readings, &readlist_2020);
add_dict(&readings, &readlist_2019);
add_dict(&readings, &readlist_2018);
add_dict(&readings, &readlist_2017);
add_dict(&readings, &readlist_2016);

Term goals = create_album(&devine_lu_linvega, "goals", "A list of general Goals.", 
  "<p><b>Internal</b> are goals dealing with personal growth, and <b>external</b>, as having an effect on the outside world.</p>"
  "<h3>Internal Targets</h3>"
  "<q><b>See the world</b>. Travel the earth by my own means and my own terms. Find countries too small to be seen on a map and go there.</q>"
  "<p><b>— Status</b> Currently living in " SEND("japan") ", after effectively completing a 4 years long " SENDNAME("pino", "sailing") " adventure circumnavigating the " SENDNAME("marquesas", "Pacific Ocean") ", across countries I did not know existed.</p>"
  "<q><b>Become polyglot</b>. Fluently speak <b>French</b>, " SEND("english") ", " SEND("russian") " and " SEND("japanese") ", to speak four languages from four different roots.</q>"
  "<p><b>— Status</b> Acquired a basic understanding of written and spoken Japanese after living in " SEND("tokyo") " for 2 years. Took introductory " SEND("russian") " classes, have yet to visit Russia. English, done. French, done.</p>"
  "<h3>External Targets</h3>"
  "<q>Facilitate the creation and <b>acceleration of arts & sciences</b> through tooling and mentorship.</q>"
  "<p><b>— Status</b> Created free and open-source " SEND("tools") " to compose music, to create graphics and to write. Currently building decentralized social & networking platforms to fuel collaboration among a collective of artists and developers.</p>"
  "<q><b>Minimize pain and suffering</b>, including that of non-human animals through the promotion and application of pragmatic solutions to nutrition and sustainable energy.</q>"
  "<p><b>— Status</b> Currently living and working off-the-grid off solar energy, and have optimized for means of generating the least amount of waste through an ascetic lifestyle and a plant-based diet.</p>");

Term death = create_term(&journal, "death", "The Death Progress Bar.",
  QUOTE("Death is only one of many ways to lose your life.", "Simon Alvah, North To The Night")
  "<h3>Marbles Jar</h3>"
  "<p>The " LINKNAME("http://www.johnmaxwell.com/blog/dont-lose-your-marbles", "Jars of Marbles model") " says that \"The average person lives <b>about 75 years, of 52 weeks each, totalling 3,900 Saturdays</b> which the average person has in their lifetime.\"</p>"
  "<h3>80'000 Hours</h3>"
  "<p>The " LINKNAME("https://80000hours.org/career-guide/introduction/", "80'000h model") " says that \"You'll spend about 80,000 hours working in your career: <b>40 hours a week, 50 weeks a year, for 40 years</b>\".</p>");
add_link(&death, "le soleil est noir", "https://www.youtube.com/watch?v=MtFeMT5Uugc");

Term faqs = create_index(&devine_lu_linvega, "faqs", "Answers to the frequently asked questions, Faqs.", 
  "<p>This is a living document, I'm constantly updating this page with new questions and updated answers. This collection of questions and answers come from various interviews taken over the years, many of them are archived " LINKNAME("https://gist.github.com/neauoire", "here") ".</p>");
add_link(&faqs, "archives", "https://gist.github.com/neauoire");

Term audio_faqs = create_term(&faqs, "audio faqs", "", 
  "<h4>What inspired you to play music?</h4>"
  "<p>I knew that I should want to write my own music when I was at a chiptune concert, I realized at that moment that I could write music with non-traditional and custom-made instruments.</p>"
  "<h4>When were you first introduced to chiptune music?</h4>"
  "<p>At the Gamma Festival in Montreal, Bubblyfish was the first performing chiptune act that I ever saw.</p>"
  "<h4>What kind of music do you play and why?</h4>"
  "<p>I tend to navigate the space between ambient and industrial music, I write starkly contrasted rhythmic music as I find it best to describe the environments explored in the songs.</p>"
  "<h4>What themes are you trying to uncover in your music?</h4>"
  "<p>Most of the music I write as " SEND("aliceffekt") " is about a character's travels across the frigid scapes of this fictional world called the " SEND("neauismetica") ", on this foreign planet called " SEND("dinaisth") ".</p>"
  "<h4>Why did you decide to accompany your music with visuals?</h4>"
  "<p>The visuals came first, and I wrote the music to accompany the drawings. So the music merely accompany the visuals.</p>"
  "<h4>Do you have a set of tracks you play regularly?</h4>"
  "<p>I tend to write music for specific events that occur in the Neauismetica, and when I perform live, I pick moments which best fit with the other performers.</p>"
  "<h4>What is your approach when you perform live?</h4>"
  "<p>It depends, sometimes it's improvisational, like the " SEND("telekinetic") " show. Or sometimes it's procedural, like the " SEND("ehrivevnv_studies") ", where I merely make sure that everything is tuned properly. Sometimes I mix old songs and focus on building interesting visuals if the venue allows for it. As of late, I have been livecoding, where the song writing is done as a performance.</p>"
  "<h4>How do you approach songwriting?</h4>"
  "<p>I tend to write the song in my head entirely, and put it down in one setting. I often write music about the Neauismetica, it's a kind of mental place, a pool of endless musical idea I can visit and explore, it's where most of the songs come from.</p>"
  "<h4>When performing live, what's your setup like?</h4>"
  "<p>It varies, I've written a couple of shows to be performed with a specific synth, or a specific hardware like with the LeapMotion. Typically, I just use a combination of midi controllers and livecoding.</p>"
  "<h4>What instruments do you play?</h4>"
  "<p>None. I'm not interested in the tactile aspect of music rendition, my love is for composition and synthesis.</p>"
  "<h4>Where does the name Aliceffekt comes from?</h4>"
  "<p>Alice Effekt was a " LINKNAME("https://youtu.be/VSKXfDMpqns?t=51m8s", "track by Drome") " that I liked a lot when I started writing music. My goal was to write music just like it. But it has since evolved into something else.</p>");

Term visual_faqs = create_term(&faqs, "visual faqs", "", 
  "<h4>Which creative discipline did you begin with, and how did you shift to other mediums?</h4>"
  "<p>At first, I stumbled onto photo manipulation. From DeviantArt, to Raster and to " LINKNAME("http://www.depthcore.com","Depthcore") ", I was moving from working with photos, to drawing, and eventually modeling. While I enjoyed visual arts, I felt that to keep sharpening the rendition of the worlds I was drawing, I needed to add a new dimension and so I began writing soundtracks to the pictures, and eventually putting all of it together in the form of websites, and games.</p>"
  "<h4>What is the meaning of the glyph in your avatar?</h4>"
  "<p>It is an old rendition of the character for blue, found in the the Shuowen Jiezi, the character dictionary written by Xu Shen, 100 CE. This particular glyph has probably never been used outside of paleography. I found it to be very beautiful, and the word \"blue\" has a special meaning in the stories from which my handle \"neauoire\" comes from.</p>"
  "<h4>What is the significance of your neck tattoo?</h4>"
  "<p>My tattoo is three dots in the shape of a triangle, or at an equal distance from each other, it signifies audio, visual and research. I call this arrangement \"trisight\", it's a reminder that, being a generalist, I must constantly pull from these 3 mediums in order to create complete works.</p>"
  "<h4>Where does your name come from?</h4>"
  "<p>I began using the name online around 2005, Devine Lu Linvega comes from Davine Lu Linvega of the series " LINKNAME("https://en.wikipedia.org/wiki/Blame!", "Blame") ", by Tsutomu Nihei, which was very influential to me at the time.</p>"
  "<h4>Why did you choose that name?</h4>"
  "<p>I had been looking for a name that did <b>not</b> represent who I was, but instead who I would like to become. I wanted something that would serve as a reminder to put curiousity above power, that did not lock myself in the past, but would force me forward toward that ideal.</p>"
  "<h4>Who is Davine Lu Linvega in the book?</h4>"
  "<p>She was unique from other antagonists in that she doesn't seem to desire killing humans, instead, she devotes her time and energy into finding a way to access an hyper-evolved version of the Internet in the universe of BLAME. As seen in her dying words, Davine was not motivated by a pursuit for power, but rather wanted to see the Netsphere out of pure curiosity.</p>");

Term research_faqs = create_term(&faqs, "research faqs", "", 
  "<h4>What are the most important concepts that you impart in your works?</h4>"
  "<p>A lot of my work deal with foreignness and adaptiveness, some of the most romantic ideas that one will find in my work is that of explorers wandering the remains of a long extinguished civilisation, and trying to make sense of it.</p>"
  "<h4>Why do you release free software?</h4>"
  "<p>Being away from accessible internet connectivity, the most practical mean for us to develop and release projects is via " LINKNAME("https://en.wikipedia.org/wiki/The_Cathedral_and_the_Bazaar", "the bazaar model") ", where the code is often maintained by others while we are away, and so as to not capitalize unfairly on all the help that we receive, we decided to only accept donations.</p>"
  "<h4>Why do you release open-source software?</h4>"
  "<p>Being incapable of sitting through a class back in high-school, most of the learning that I was able to do was from looking at other people's sources and trying to make sense of the way they think and understand the reasons for solutioning in that particular way. For an ecosystem of tools to be truly resilient, individuals must be able to repair, maintain and inspect the software that they use.</p>"
  "<h4>Why is journaling important to you?</h4>"
  "<p>I keep records of everything I make, and everything I consume. The idea is to better understand my creative patterns, and to predict changes in mood and interest. Ultimately, the goal is to plan more efficiently, to spend my time with more efficacy and to work less.</p>");

Term lifestyle_faqs = create_term(&faqs, "lifestyle faqs", "", 
  "<h4>What is your background?</h4>"
  "<p>I was born in March of 1986. I was a notoriously distracted student in high school, I tried attending a few art classes in college before realizing that it was not the right environment to learn the things I was interested into. </p>"
  "<p>I was first interested in illustration and motion graphics. I soon started writing music to complement the pictures and animations, and finally I began implementing interaction and turn these multimedia pieces into games, websites and tools.</p>"
  "<h4>Where do you work?</h4>"
  "<p>I work at a small research studio aboard a sailboat, called " SEND("hundred rabbits") ", where we do experiments in resilience and self-reliance using " LINKNAME("https://100r.co/site/philosophy.html", "low-tech solutions") ".</p>"
  "<h4>What do you do during the daytime?</h4>"
  "<p>The ways in which I spend my time varies wildly from day to day, but mostly experimental research, my interests include alternative ways to store power and minimum viable solutions for " SENDNAME("longtermism", "technological tooling") ".</p>"
  "<h4>What is your routine?</h4>"
  "<p>I go to bed choosing one thing to accomplish the next day, I wake up to tackle this " SENDNAME("routine", "singular task") ". I tend to work only in the morning, get everything done before lunch. The afternoons, I spend mostly reading and learning things to help me solve the next day's task. I usually wake up with the sun, and sleep soon after sunset.</p>"
  "<h4>Where do you go to get inspired?</h4>"
  "<p>I share a " SENDNAME("merveilles", "small forum") " with a few online friends and whenever I am looking for a new favourite thing, or some help — I know I can find it there. Everyone should build a small network, a place where they can feel comfortable to experiment, show works-in-progress and exchange on the topics of art and science in a safe place among like-minded people.</p>"
  "<h4>Why do you think people should travel more?</h4>"
  "<p>I found " SEND("travel") " to be a good catalyst toward learning " SENDNAME("language", "new languages") ", for developing an interest in foreign cultures and ultimately for building empathy, curiosity and creativity.</p>"
  "<h4>How do you draw the line between what is published, and what stays private?</h4>"
  "<p>Working " SENDNAME("identity", "behind an avatar") " and living online through a proxy name offers a good healthy distance between the work and the self. The Devine Lu Linvega project focuses on making explicit the reflections, and techniques for the creative process. My intimate life, my health, my friends and family are outside of the scope of this project.</p>");

Term mirrors = create_portal(&research, "mirrors", "The collection of Mirrors.", 
  "<p>The <b>mirrors</b> are collected notes on the topics of " SEND("knowledge") " and " SEND("wisdom") ".</p>"
  "<p>Morals refer mainly to guiding principles, and ethics refer to specific rules and actions, or behaviors. A moral precept is an idea or opinion that’s driven by a desire to be good. An ethical code is a set of rules that defines allowable actions or correct behavior.</p>"
  QUOTE("Mystery exists in the mind, not in reality. <br />Confusion exists in the map, not in the territory.", "E.T. Jaynes"));

Term wisdom = create_index(&mirrors, "wisdom", "A collection of notes on Wisdom.", 
  "<p>The end of the cycle is that of the independent, clear-minded, all-seeing Child. That is the level known as <b>wisdom</b>.</p>"
  "<p>To be a philosopher is not merely to have subtle thoughts, but so to love wisdom as to live according to its dictates, a life of <b>simplicity, independence, magnanimity, and trust</b>.</p>"
  QUOTE("There are two wisdoms: the first inclines to " SEND("action") ", the second to " SEND("inaction") ".", "Stanislaw Lem, Cyberiada"));

Term action = create_term(&wisdom, "action", "A collection of notes in regard to Action.", 
  "<p><b>Ahimsa</b>, or <i>Cause no injury, do no harm</i>, is a Buddhist concept referred to as nonviolence, and it applies to all living beings—including all animals.</p>"
  QUOTE("Be mindful of impermanence.<br /> Be careful of idleness.", "Unknown"));
add_list(&action, &action_wisdom);

Term inaction = create_term(&wisdom, "inaction", "A collection of notes in regard to Inaction.", 
  "<p><b>Wu Wei</b> means without doing, causing, or making. It flows like water, reflects like a mirror, and responds like an echo.</p>"
  QUOTE("Many people are afraid of Emptiness, <br />because it reminds them of Loneliness.", "Unknown"));
add_list(&inaction, &inaction_wisdom);

Term knowledge = create_index(&mirrors, "knowledge", "A collection of notes on general Knowledge.", 
  "<p>The <b>knowledge portal</b> serves as a clipboard, a place to collect various bits of knowledge from various books and their authors.</p>");

Term programming = create_term(&knowledge, "programming", "A collection of notes on Programming.", 
  QUOTE("To make a magical technology, it must be sufficiently advanced.", "Lion Kimbro"));
add_list(&programming, &programming_knowledge);
add_list(&programming, &programming_practices);

Term design = create_term(&knowledge, "design", "A collection of notes on Design.", NULL);
add_list(&design, &design_knowledge);
add_list(&design, &design_pragnanz);

Term work = create_term(&knowledge, "work", "A collection of notes on Work.", 
  QUOTE("Work expands so as to fill the time available for its completion.", "Parkinson's law")
  QUOTE("A leader is best when people barely know they exists, when their work is done, their aim fulfilled, people will say: we did it ourselves.", "老子(Lao Tse), 道德經(Dao De Jing)"));
add_list(&work, &work_knowledge);
add_list(&work, &work_habits);
add_list(&work, &work_charisma);

Term writing = create_term(&knowledge, "writing", "A collection of notes on Writing.", 
  QUOTE("I have only made this letter longer because I have not had the time to make it shorter.", "Blaise Pascal, The Provincial Letters"));
add_list(&writing, &writing_knowledge);

Term health = create_term(&knowledge, "health", "A collection of notes on Health.", NULL);
add_list(&health, &health_knowledge);
add_list(&health, &health_breathing);

Term ascetism = create_term(&knowledge, "ascetism", "A collection of notes on Ascetism.", 
  QUOTE("A man is wealthy in proportion to the things he can do without.", "Epicurus"));

Term discourse = create_term(&mirrors, "discourse", "A cheatsheet on Discourse.", 
  QUOTE("You should attempt to re-express your target's position so clearly, vividly, and fairly that your target says, “Thanks, I wish I'd thought of putting it that way.”", "Rapoport's First Rule")
  "<p>The arguments rankings are taken from " LINKNAME("http://slatestarcodex.com/2018/05/08/varieties-of-argumentative-experience/", "Scott Alexander") ", and the responses rankings are taken from " LINKNAME("http://www.paulgraham.com/disagree.html", "Paul Graham") ".</p>");
add_link(&discourse, "kind communication", "https://www.gnu.org/philosophy/kind-communication.html");
add_dict(&discourse, &arguments);
add_dict(&discourse, &responses);
add_list(&discourse, &three_gates);
add_dict(&discourse, &beliefs);

Term morals = create_term(&mirrors, "morals", "A cheatsheet on Morals.", 
  QUOTE("The world is a comedy to those that think, a tragedy to those that feel.", "Howace Walpole"));
add_dict(&morals, &psychology_lexicon);
add_dict(&morals, &personalities);
add_dict(&morals, &biases);
add_dict(&morals, &groupthink_biases);
add_dict(&morals, &effects);
add_dict(&morals, &fallacies);
add_dict(&morals, &illusions);
add_dict(&morals, &sociology);

Term ethics = create_term(&mirrors, "ethics", "A collection of notes on various topics concerning ethics.", 
  "<p>We live in a time of social, economic and ecological unravelling. All around us are signs that our whole way of living is already passing into history.</p>"
  QUOTE("The end of the human race will be that it will eventually die of civilisation.", "Ralph Waldo Emerson")
  QUOTE("We're Solarpunks because the only other options are denial or despair.", "Adam Flynn, Notes toward a manifesto"));
add_dict(&ethics, &green_anarchism);
add_dict(&ethics, &animal_rights);
add_dict(&ethics, &adaptation);
add_dict(&ethics, &recyclism);
add_list(&ethics, &dark_mountaineers);
add_list(&ethics, &solarpunk_knowledge);

Term vegan = create_term(&ethics, "vegan", "A cheatsheet on various tropes against vegan discourse.", NULL);

Term technology = create_term(&mirrors, "technology", "A cheatsheet on various topics of technology.", NULL);
add_dict(&technology, &principles);
add_dict(&technology, &spacetime);
add_dict(&technology, &aeropunk);
add_dict(&technology, &linguistics);

Term documentation = create_term(&notebook, "documentation", "A cheatsheet on Documentation.", 
  "<p>This outlines the " SEND("documentation") " guidelines for the release of Nataniev projects.</p>"
  QUOTE("Clarity is better than cleverness", "unknown"));
add_link(&documentation, "sources", "https://www.divio.com/blog/documentation/");

Term quotes = create_term(&mirrors, "quotes", "A collection of Quotes.", NULL);

Term language = create_portal(&research, "language", "Various Language notes on natural, synthetic and programming languages.", 
  "<p>Welcome to the <b>Language Portal</b>, the goal of these pages is to host a few resources, summaries and notes from my own language studies. .</p>"
  QUOTE("Kolik jazyků znáš, <br />tolikrát jsi člověkem.", "Tomáš Garrigue Masaryk"));
add_link(&language, "koseki-091450", "http://glyphwiki.org/wiki/koseki-091450");
add_link(&language, "unicode u+21dc9", "https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=U%2B21DC9");

Term english = create_term(&language, "english", "Assorted notes on the English language.", NULL);

Term assembly = create_term(&language, "assembly", "6502 Assembly is the language used to program the famicom microprocessor.", 
  "<p>This page is a collection of notes on the basics of 6502 assembly, assembled from various guides and tutorial. Understanding these notes require prior understanding of " SENDNAME("binary", "binary numbers") ".</p>");
add_link(&assembly, "famicom cookbook", "https://github.com/hundredrabbits/Famicom-Cookbook");

Term binary = create_term(&language, "binary", "Binary numbers are a base 2 numeral system.", NULL);

Term unix = create_album(&language, "unix", "Unix is a family of computer operating systems that derive from the original Unix from Bell Labs.", NULL);

Term the_sartre_mechanism = create_term(&notebook, "the sartre mechanism", "The The Sartre Mechanism short.",
  "<p>It was the first day of the winter when a friend invited me to witness the completion of a recent project.</p>"
  "<p>Crouched over a heap of cogs, she did not look over as I hung my snow-covered coat on something that, by the look of it, might very well be a time machine. A distracted gaze turned for a moment, perhaps to make sure that I did not break anything as I navigated the busy studio.</p>"
  "<p>What I first perceived as a pile of junk turned out to be an intricate clocklike mechanism; where the needles would have been, a small hand rested at the end of a short metallic arm.</p>"
  "<p>My friend held a minuscule weight above the tiny hand, before carefully laying it onto its opened palm. Whirring and clicking, a second arm emerged and plucked a gear out from its own ticking body and laid it back into the toolbox at its side. In controlled gestures, activated by the weight, tiny arms dismantled bolts and screws, while carefully putting them in that toolbox, gradually taking the casing of the mechanism apart, leaving its core exposed.</p>"
  "<p>I stared in silent awe, at the busy mechanical concerto playing its own requiem. The arms eventually began to unbuilding the core, growing forever weakly as it dismantled the remaining components, moving them back into the box. This obscene ritual of disembowelment and exposé on pointlessness ended as the tiny arms and the weight had fallen back into the toolbox.</p>"
  "<p>Written by " LINKNAME("https://twitter.com/voidshaper", "Voidshaper") " & " SENDNAME("devine lu linvega", "Neauoire") ".</p>");

Term talk = create_album(&notebook, "talk", "For when I Talk in public.", 
  "<p>Often orbiting around the topics of " SEND("nataniev") ", " SEND("oscean") " and " SEND("horaire") ", the <code>/Talk</code> is used mainly as a marker for Live events.</p>");
add_link(&talk, "sources", "https://github.com/neauoire/Talk-Amaze");

Term systems = create_index(&notebook, "systems", "Various experimental writing and numerical Systems.", NULL);

Term vedic = create_term(&systems, "vedic", "The Vedic multiplication table is a very elegant and visual way to multiply.", 
  "<p>To find the result, draw lines for each individual numbers, where each number intersects the other's perpendicularly and <b>count the number of intersections</b>.</p>"
  IMAGE("generic", "vedic.svg"));

Term needles = create_term(&systems, "needles", "Needles are glyphs of which the intersection count is equal to the value of the character.", 
  "<p>The glyphs are not used into any specific project, but are available here as a reference of a meaningful numeric glyph system.</p>"
  IMAGE("generic", "needles.svg"));

Term shorthand = create_term(&systems, "shorthand", "Shorthand is a calligraphy style developed to take faster notes.", 
  "<p>I played with different ideas and this is the system that worked best for me. It's a mixture of already existing shorthand systems that fits my writing style.</p>"
  "<p>Simple enough, now most letters are transformed into a single stroke shape that flows and combines to form shorter words, that can be written faster.</p>"
  IMAGE("generic", "shorthand.svg"));

Term marabu = create_term(&unreleased, "marabu", "Marabu is a music tool.",
  "<p><b>Marabu</b> is cross-platform tracker-type composition tool and synthesizer.</p>"
  "<p>Marabu was original built as a fork to the opensource <i>Soundbox</i>, and is meant to be an improvement on functionalities and design.</p>"
  MODITCHIO("173813")
  "<p>You can view the complete " LINKNAME("https://github.com/hundredrabbits/Marabu", "Manual") " on Github.</p>");
add_link(&marabu, "download", "http://hundredrabbits.itch.io/Marabu");
add_link(&marabu, "sources", "https://github.com/neauoire/Marabu");

Term babelium = create_term(&unreleased, "babelium", "Babelium is a roguelike set in the Library of Babel, written by Borges.", 
  "<p>Begin by finding the <i>guide</i>(<b>g</b>), in every second hexagon, the guide will tell you things to look for. If you find yourself to be walking rather slowly, find the closet in which you can sleep standing up.</p>");
add_link(&babelium, "sources", "https://github.com/Echorridoors/Babelium");

Term modernista = create_term(&unreleased, "modernista", "Modernista is a series of 4 prints inspired from American Modernism.", NULL);

Term blindfolk = create_term(&unreleased, "blindfolk", "Blindfolk was a esoteric multiplayer programming combat game.", 
  "<p>Each player programs a short script(called fighting style) for their character that will run automatically every 5 minutes, against all other players.</p>"
  "<p>The scripts contained a series of attacks, moves and blocks, as well as responses to collisions against other players.</p>"
  "<p>It was first created in the span of 48 hours for " LINKNAME("http://globalgamejam.org", "Global Game Jam 2016") ". The game was very popular for the days after its release, but soon became too time-consuming to maintain and keep alive, and was turned off a few days later. This design was revisited and lives on as part of the upcoming game " SEND("markl") ".</p>");
add_link(&blindfolk, "sources", "https://github.com/XXIIVV/vessel.blindfolk");

Term milavrega = create_term(&unreleased, "milavrega", "Milavrega was an experimental iOS game happening on a lost mobile phone.", 
  "<p>You must try and find your way through the folders, emails and contacts to decipher the enigma of the phone's owner.</p>");

Term first_wave = create_portal(&aliceffekt, "first wave", "The First Wave contains material mostly unrelated to the Neauismetica and proto-Aliceffekt.", NULL);

Term regionsteam_snowdays = create_term(&first_wave, "regionsteam snowdays", "Regionsteam Snowdays is the first official Aliceffekt release.", NULL);

Term downtemperature = create_term(&first_wave, "downtemperature", "Downtemperature is the first Aliceffekt EP.", 
  "<p>Released originally as three albums <i>First Air & Last Aid</i>, <i>Goneplains</i> and <i>Downtemperature</i>, the three albums were consolidated into a single release in 2017.</p>");

Term blam = create_term(&first_wave, "blam", "Blam is an improvisational album created as a live performance, that ultimately fell through.", 
  "<p>This album is the precursor to " SEND("damoiseau_canalx") ", it was never performed live as it was intended, but recorded later in the car ride back.</p>"
  "<p>The story behind the reason for why it was never performed will be for another time..</p>");
add_link(&blam, "bandcamp", "https://aliceffekt.bandcamp.com/album/blam-le-passage-sacrilege");

Term vert_kirlian_theatre = create_term(&first_wave, "vert kirlian theatre", "The Vert Kirlian Theatre was created during on a long train ride, on the Yamanote line, during my first trip to Tokyo.", 
  "<p>This release inspired the creation of " SEND("from_saharaphorest") ".</p>");

Term ann_yozora_saint = create_term(&first_wave, "ann yozora saint", "Ann Yozora Saint was originally released as two albums, Ann Yozora Saint and Lu Floral Funeralis, they were consolidated into a single release in 2017.", NULL);
add_link(&ann_yozora_saint, "bandcamp", "https://aliceffekt.bandcamp.com/album/ann-yozora-saint");

Term nether_esper_inserts = create_term(&first_wave, "nether esper inserts", "Nether Esper Inserts was originally released as two albums, Nether Esper Inserts and Howls Virgil Systems, they were consolidated into a single release in 2017.", NULL);

Term otoroutes_miniatures = create_term(&first_wave, "otoroutes miniatures", "Otoroutes Miniatures was created especially for the first large Toy Company festival.", NULL);

Term idyllic_miners = create_term(&first_wave, "idyllic miners", "Idyllic Miners was created for the Kinetik Festival.", NULL);
add_link(&idyllic_miners, "bandcamp", "https://aliceffekt.bandcamp.com/album/genesis-iii-20-ov-idyllic-miners");

Term lietal = create_term(&language, "lietal", "Lietal is an experimental synthetic language.", NULL);

Term japanese = create_term(&language, "japanese", "The Japanese page is a collection of Japanese study notes.", NULL);
add_link(&japanese, "sci.lang.japan", "http://rut.org/~wmaton/www/pub/jap.guide.txt");

Term russian = create_term(&language, "russian", "The Russian page is a collection of Russian study notes.", NULL);

// Redirects

Term software = create_term(&tracker,"software", "Traveling toward software, please hold..", REDIRECT("tools"));
Term workstation = create_term(&tracker,"workstation", "Traveling toward workstation, please hold..", REDIRECT("computer"));

Term *lexicon[] = { 
  &home, &audio, &visual, &research, &about, &tracker, &journal, &calendar, 
  &dodecae, &efli, &alicef, &aliceffekt, &es_gulf_sunflowers, &damoiseau_canalx, 
  &the_sixth_season, &hex_hive_necklace, &victorian_punch, &rekka, &wiktopher, 
  &hundred_rabbits, &drownspire, &merure, &vambits, &pino, &illustration, 
  &beldam_records, &ten_axitecture, &miniscopie, &ramiel, &eschatolor, 
  &looking_glace, &verreciel_soundtrack, &getapan_728k, &azolla, &malice, 
  &collected_works, &markl, &verreciel, &modernista, &nereid, &beauty, 
  &serventines, &polygore, &pearls, &occulter, &oquonie, 
  &camilare, &babelium, &physical, &polygonoscopy, &methascope, &kaleidoscope, 
  &hypervoid, &brane, &astratas, &ar_moire, &nervous, &artwork, &sketchbook, 
  &flactals, &old_cities, &lard_shader, &ring_of_scales, &vetetrandes_lettres, 
  &from_saharaphorest, &ehrivevnv_studies, &yajnev_studies, &telekinetic, 
  &telekinesis, &nataniev, &oscean, &indental, &tablatal, &lain, &runic, 
  &horaire, &nataniev_time, &arvelie, &neralie, &webring, &merveilles, 
  &rotonde, &riven, &tools, &orca, &juni, &pilot, &ronin, &dotgrid, &left, 
  &nasu, &utilities, &noodle, &enfer, &paradise, &maeve, &parade, &games, 
  &hardware, &raspberry, &media_station, &radio_station, &framboisedorf, 
  &weather_station, &instrument, &microbit, &playground, &norns, &monome,
  &famicom, &mobile, &bifurcan, &keyboard_468, &alphavetist, &vocavularist, 
  &rafinograde, &noirca, &dew, &ledoliel, &automatons, &the_will_the_wisp, 
  &dictionarism, &glossolaliarium, &advent_v, &unity, &siseon, &zjeveni, 
  &drypoint, &valentinel_hopes, &cenote, &cyanosis_fever, &donsol, &hiversaires, 
  &purgateus, &collegiennes, &diluvium, &volkenessen, &waiting_for_horus, 
  &marabu, &pico3, &pico_battle, &spagettini_scale, &spool_holder, &donsol_famicom, 
  &laeisthic, &children_of_bramble, &known_magye, &extended_sleep, &zoe_format,
  &duomic, &neauismetic, &opal_inquisitors, &portalion, &dei_dain, 
  &habitants_du_soleil, &lives, &shikanokoa_vs_1h1d, &pedestrian_paradise, 
  &nor_let_the_fools, &to_the_aeons_hell, &vermillionth, &time_alloy, &demo, 
  &superworker, &supervisitor, &soundtrack, &oquonie_soundtrack, 
  &rabbits_soundtrack, &purgateus_soundtrack, &noon_guest, &remix, &typography, 
  &vast, &defraction_optics, &thousand_rooms, &wallpapers, &neauismetica, 
  &neon_hermetism, &feu, &actors, &ehrivevnv, &soies, &longest_end, 
  &soies_machine, &soies_injection, &neausea, &nohlxeserre, &dinaisth, 
  &kanikule, &vetetrandes, &laeisth, &andes_castel, &duomo, &neau, &dilitriel, 
  &aitasla, &characters, &rlionn, &neonev, &andes, &yajnev, &paradichlorisse, 
  &photography, &macro, &personal, &film, &black, &infrared, &travel, &essentials,
  &the_sublime, &japan, &minamiise, &shizuoka, &ogasawara, &yokohama, &fuji, 
  &osaka, &tokyo, &fiji, &marquesas, &marshall_islands, &niue, &mexico, &france, 
  &new_zealand, &america, &canada, &germany, &austria, &czech, &netherlands, 
  &lifestyle, &aesthetics, &nomad, &routine, &longtermism, &nutrition, &macintosh, 
  &inventory, &everyday, &skate, &bike, &studio, &computer, &plan9, &camera, 
  &keyboard, &directory, &bookmarks, &readings, &goals, &identity, &death, &faqs, 
  &audio_faqs, &visual_faqs, &research_faqs, &lifestyle_faqs, &mirrors, &wisdom, 
  &action, &inaction, &knowledge, &programming, &design, &work, &writing, &meta, 
  &health, &ethics, &technology, &ascetism, &discourse, &vegan, &morals, 
  &documentation, &quotes, &language, &english, &grimgrains, &notebook, 
  &the_sartre_mechanism, &talk, &systems, &vedic, &needles, &shorthand,
  &unreleased, &blindfolk, &milavrega, &devine_lu_linvega, &first_wave, 
  &regionsteam_snowdays, &downtemperature, &blam, &vert_kirlian_theatre, 
  &ann_yozora_saint, &nether_esper_inserts, &otoroutes_miniatures, &now,
  &idyllic_miners, &lietal, &japanese, &russian, &binary, &assembly, &hypertalk,
  &pascal, &unix, &software, &workstation
};
