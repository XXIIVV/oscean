'use strict'
const template = `

; database

(database:create-table "horaire" Tablatal Log)
(database:create-table "lexicon" Indental Term)
(database:create-table "glossary" Indental List)
(database:create-index)
(database:map)

(dom:set-html _activity "<li><a href='calendar' data-goto='calendar' target='_self' class='local calendar sprite_calendar '>Calendar</a></li> <li><a href='journal' data-goto='journal' target='_self' class='local journal sprite_journal '>Journal</a></li><li><a href='tracker' data-goto='tracker' target='_self' class='local tracker sprite_tracker '>Tracker</a></li>")

; footer

(def __socials
  (concat
    (link "https://twitter.com/neauoire" "" "icon twitter sprite_twitter external")
    (link "https://github.com/neauoire" "" "icon github sprite_github external")
    (link "https://merveilles.town/@neauoire" "" "icon merveilles sprite_merveilles external")
    (link "http://webring.xxiivv.com/#random" "" "icon rotonde sprite_rotonde external")
    (link "https://creativecommons.org/licenses/by-nc-sa/4.0" "" "icon cc sprite_cc external")
    (link "https://100r.co" "" "icon hundredrabbits sprite_hundredrabbits external")))

(def __author 
  (concat 
    (link "Devine Lu Linvega") 
    " © " 
    (tunnel (last (database:select-table "horaire")) "time") 
    "—" 
    (tunnel (first (database:select-table "horaire")) "time")))

(def __license
  (wrap 
    (concat 
      (link "wiki" "BY-NC-SA 4.0")
      " "
      (neralie)) "center"))

(dom:set-html _footer (wrap (concat __socials __author __license) "div" "wr"))

; display

(defn display-glyph (res) (
  (dom:set-attr _path "d" (res:glyph))))

(defn display-photo (res) (
  (def photo-log 
    (res:photo))
  (if 
    photo-log 
    (dom:show _title) 
    (dom:hide _title))
  (dom:set-html _title 
    (concat "<a href='journal' data-goto='journal' target='_self' class='local'>" photo-log:name "</a> — " (photo-log:time)))
  (if 
    photo-log
    (dom:set-html _photo (concat "<media id='media' style='background-image: url(media/diary/" photo-log:pict ".jpg)'></media>"))
    (dom:set-html _photo ""))))

(defn display-main (res) (
  (def _head (res:head))
  (def __portal (res:_portal))
  (if 
    (is:real res:data)
    (def _body (res:body))
    (
      (def similar-terms
        (find-similar (uc res:name) (keys database:index)))
      (def similar-text 
        (concat "Did you mean " (bold (link (tc (tunnel similar-terms:0 "word")))) ", " (link (tc (tunnel similar-terms:1 "word"))) ", or " (link (tc (tunnel similar-terms:2 "word"))) "? "))
      (def pull-request-text
        (concat "You can create the page by submitting a " (link "https://github.com/XXIIVV/Oscean/blob/master/scripts/database/lexicon.ndtl" "pull request") ", or if you think this is an error, please contact " (link "https://twitter.com/neauoire" "@neauoire") "."))
      (def _body 
        (wrap (concat similar-text pull-request-text) "p"))))
  (if 
    (eq __portal "")
    (dom:hide _portal)
    (dom:show _portal))
  (dom:set-html _portal (res:_portal))
  (dom:set-html _main (concat _head _body))))

(defn display-sidebar (res) (
  (def __links 
    (wrap 
      (join (for (entries res:links) 
        (λ (a) (concat "<li><a href='" a:1 "'>" a:0 "</a></li>")))) "ul" "links") )
  (def span-from 
    (if 
      (gt (len res:diaries) 0) 
      (tunnel res "span" "from") 
      (:time (last (database:select-table "horaire")))))
  (def span-to 
    (if 
      (gt (len res:diaries) 1) 
      (tunnel res "span" "to") 
      (:time (first (database:select-table "horaire")))))
  (def __date 
    (wrap (concat span-from " — " span-to) "h2"))
  (def navi-stem 
    (if (gt (len res:children) 0) res (tunnel res "parent")))
  (def __stem 
    (wrap (link navi-stem:name) "li" "parent"))
  (def __children 
    (join (for navi-stem:children 
      (λ (a) (if  
        (and (not-eq a:name res:name) (eq (index a:tags "hidden") -1))
        (concat "<li>" (link a:name) "</li>"))))))
  (def __directory 
    (wrap (concat __stem __children) "ul" "directory"))
  (dom:set-html _sidebar (concat __date __links __directory))))

(defn display (q) (
  (def res 
    (database:find q))
  (dom:set-title (concat "XXIIVV — " (tc res:name)))
  (dom:set-hash res:name)
  (dom:scroll 0)
  (display-photo res)
  (display-glyph res)
  (display-main res)
  (display-sidebar res)))

; query

(defn query () (
  (def current-page 
    (replace (substr location:hash 1) "/\+/g" " "))
  (if 
    (eq current-page "") 
    (def current-page "home"))
  (display current-page)))

(on:load query)

; click

(defn goto 
  (target) 
  ((display target)))

(on:click goto)

; search

(defn search (e) (
  (if (eq e:key "Enter") (
    (goto (tunnel e "target" "value"))))))

(dom:bind _search "keydown" search)

`