'use strict'
const graph = `

; html graph

(def _header 
  (dom:create "header"))

(def _photo 
  (dom:create "photo"))

(def _menu 
  (dom:create "menu"))

(def _info 
  (dom:create "info"))
(def _activity 
  (dom:create "activity" "ul"))
(def _logo 
  (dom:create "logo" "a" "sprite_logo"))

(def _search 
  (dom:create "search" "input"))


(def _title 
  (dom:create "title"))
(def _glyph 
  (dom:create "glyph" "svg"))

;

(def _core 
  (dom:create "core"))

(def _sidebar 
  (dom:create "sidebar"))
(def _content 
  (dom:create "content"))
(def _navi 
  (dom:create "navi"))

(def _main 
  (dom:create "main"))
(def _tracker 
  (dom:create "tracker"))
(def _calendar 
  (dom:create "calendar"))
(def _journal 
  (dom:create "journal"))

(def _footer 
  (dom:create "footer"))

;

(dom:append _info (_glyph _title))
(dom:append _menu (_info _logo _search _activity))
(dom:append _header (_photo _menu))
(dom:append _content (_main _tracker _calendar _journal))
(dom:append _core (_sidebar _content _navi))
(dom:append dom:body (_header _core _footer))

(dom:set-html _glyph "<path transform='scale(0.165,0.165) translate(-50,-50)' d='M90.0,90.0 L90.0,90.0 L150.0,150.0 L90.0,210.0 M210.0,90.0 L210.0,90.0 L210.0,210.0'></path>")
(dom:set-html _title "<a href='journal' data-goto='journal' target='_self' class='local'>The Family</a> — 10 days ago")
(dom:set-html _activity "<li><a href='calendar' data-goto='calendar' target='_self' class='local calendar sprite_calendar '>Calendar</a></li> <li><a href='journal' data-goto='journal' target='_self' class='local journal sprite_journal '>Journal</a></li><li><a href='tracker' data-goto='tracker' target='_self' class='local tracker sprite_tracker '>Tracker</a></li>")
(dom:set-html _footer "<div class='wr'><a target='_blank' rel='noreferrer' href='https://twitter.com/neauoire' class='icon twitter sprite_twitter external'></a><a target='_blank' rel='noreferrer' href='https://github.com/neauoire' class='icon github sprite_github external'></a>      <a target='_blank' rel='noreferrer' href='https://merveilles.town/@neauoire' class='icon merveilles sprite_merveilles external'></a><a target='_blank' rel='noreferrer' href='http://webring.xxiivv.com/#random' class='icon rotonde sprite_rotonde'></a><a target='_blank' rel='noreferrer' href='https://creativecommons.org/licenses/by-nc-sa/4.0/' class='icon cc sprite_cc'></a><a data-goto='devine lu linvega' href='#devine+lu+linvega'>Devine Lu Linvega</a> © 06I04—06I04<center><a>BY-NC-SA 4.0</a> <span style='color:#ccc'>300:034</span></center><a target='_blank' href='https://100r.co' rel='noreferrer' class='icon hundredrabbits sprite_hundredrabbits'></a><hr></div>")

(database:create-table "horaire" Tablatal Log)
(database:create-table "lexicon" Indental Term)
(database:create-index)


; start handling clicks
(on:click debug)




(defn query () (
  ; current page
  (def current-page 
    (substr location:hash 1))
  (debug current-page)
))


(on:load query)







`