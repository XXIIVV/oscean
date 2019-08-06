'use strict'
const template = `

; database

(database:create-table "horaire" Tablatal Log)
(database:create-table "lexicon" Indental Term)
(database:create-index)
(database:map)



(dom:set-html _title "<a href='journal' data-goto='journal' target='_self' class='local'>The Family</a> — 10 days ago")
(dom:set-html _activity "<li><a href='calendar' data-goto='calendar' target='_self' class='local calendar sprite_calendar '>Calendar</a></li> <li><a href='journal' data-goto='journal' target='_self' class='local journal sprite_journal '>Journal</a></li><li><a href='tracker' data-goto='tracker' target='_self' class='local tracker sprite_tracker '>Tracker</a></li>")
(dom:set-html _footer "<div class='wr'><a target='_blank' rel='noreferrer' href='https://twitter.com/neauoire' class='icon twitter sprite_twitter external'></a><a target='_blank' rel='noreferrer' href='https://github.com/neauoire' class='icon github sprite_github external'></a>      <a target='_blank' rel='noreferrer' href='https://merveilles.town/@neauoire' class='icon merveilles sprite_merveilles external'></a><a target='_blank' rel='noreferrer' href='http://webring.xxiivv.com/#random' class='icon rotonde sprite_rotonde'></a><a target='_blank' rel='noreferrer' href='https://creativecommons.org/licenses/by-nc-sa/4.0/' class='icon cc sprite_cc'></a><a data-goto='devine lu linvega' href='#devine+lu+linvega'>Devine Lu Linvega</a> © 06I04—06I04<center><a>BY-NC-SA 4.0</a> <span style='color:#ccc'>300:034</span></center><a target='_blank' href='https://100r.co' rel='noreferrer' class='icon hundredrabbits sprite_hundredrabbits'></a><hr></div>")

(on:click debug)

; display

(defn display-glyph (res) (
  (dom:set-attr _path "d" (res:glyph))))

(defn display-photo (res) (
  (def photo-log (res:photo))
  (dom:set-html _title (concat "<a href='journal' data-goto='journal' target='_self' class='local'>" photo-log:name "</a> — " (photo-log:time)))
  (dom:set-html _photo (concat "<media id='media' style='background-image: url(../media/diary/" photo-log:pict ".jpg)'></media>"))))

(defn display-main (res) (
  (def _head (res:head))
  (def _body (res:body))
  (dom:set-html _main (concat _head _body))))

(defn display-sidebar (res) (
  (def __links 
    (wrap 
      (join (for (entries res:links) 
        (λ (a) (concat "<li><a href='" a:1 "'>" a:0 "</a></li>")))) "ul" "links") )
  (def __date (wrap "29G21 — 29G22" "h2"))
  (def __directory (wrap "<li class='parent'><a href='home' data-goto='home' target='_self' class='local  '>Home</a></li><li class='children '><a href='audio' data-goto='audio' target='_self' class='local  '>Audio</a></li><li class='children '><a href='visual' data-goto='visual' target='_self' class='local  '>Visual</a></li><li class='children '><a href='research' data-goto='research' target='_self' class='local  '>Research</a></li>" "ul" "directory"))
  (dom:set-html _sidebar (concat __date __links __directory))))

(defn display (q) (
  (debug (concat "display: " q))
  (def res (database:find q))
  (display-photo res)
  (display-glyph res)
  (display-main res)
  (display-sidebar res)))

; query

(defn query () (
  (def current-page 
    (substr location:hash 1))
  (display current-page)
  ))

(on:load query)

`