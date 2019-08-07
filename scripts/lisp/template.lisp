'use strict'

const template = `

; database

(database:create-table "glossary" Indental List)
(database:create-table "horaire" Tablatal Log)
(database:create-table "lexicon" Indental Term)
(database:create-index)
(database:map)

(dom:set-html _activity 
  (concat 
    (wrap (link "calendar" "Calendar" "local calendar sprite_calendar") "li")
    (wrap (link "journal" "Journal" "local journal sprite_journal") "li")
    (wrap (link "tracker" "Tracker" "local tracker sprite_tracker") "li")))

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
      (link "About" "BY-NC-SA 4.0")
      " "
      (neralie)) "center"))

(dom:set-html _footer (wrap (concat __socials __author __license) "div" "wr"))

; display

(defn display-glyph (res) (
  (dom:set-attr _path "d" (res:glyph))))

(defn set-theme (pixels) (
  (if 
    (gt (dom:get-lum pixels) 170)
    (dom:set-class _header "light")
    (dom:set-class _header "dark"))))

(defn display-photo (res) (
  (if (eq res:name "HOME")
    (def photo-log (until 
      (database:select-table "horaire") 
      (λ (a) (tunnel a "pict"))))
    (def photo-log 
      (res:photo)))
  (def photo-path 
    (concat "media/diary/" photo-log:pict ".jpg"))
  (if 
    photo-log 
    (dom:show _title) 
    (dom:hide _title))
  (dom:set-html _title 
    (concat (link "Journal" photo-log:name) " — " (photo-log:time)))
  (if
    photo-log 
    (dom:get-pixels photo-path 0.1 set-theme)
    (dom:set-class _header "light"))
  (if photo-log
    (dom:remove-class _header "no_photo")
    (dom:add-class _header "no_photo"))
  (if 
    photo-log
    (dom:set-html _photo (concat "<media id='media' style='background-image: url(" photo-path ")'></media>"))
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
        (λ (a) (wrap (link a:1 a:0) "li")))) "ul" "links") )
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
    (wrap (link (tunnel navi-stem:parent "name") navi-stem:name) "li" "parent"))
  (def __children 
    (join (for navi-stem:children 
      (λ (a) (if  
        (and (eq (index a:tags "hidden") -1))
        (concat "<li class='" (if (eq a:name res:name) "active") "'>" (link a:name) "</li>"))))))
  (def __directory 
    (wrap (concat __stem __children) "ul" "directory"))
  (dom:set-html _sidebar (concat __date __links __directory))))

(defn display (q) (
  (def res 
    (database:find q))
  (dom:set-title (concat "XXIIVV — " (tc res:name)))
  (dom:set-hash res:name)
  (dom:set-class dom:body "loading")
  (dom:scroll 0)
  (delay 0.1 (λ ()
    ((display-photo res)
    (display-glyph res)
    (display-main res)
    (display-sidebar res)
    (delay 0.1 (λ () 
      (dom:set-class dom:body "ready")))
    )))
  ))

; query

(defn query () (
  (def current-page 
    (replace (substr location:hash 1) "/\+/g" " "))
  (if 
    (eq current-page "") 
    (def current-page "home"))
  (display current-page)))

(on:load query)


(on:page query)

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