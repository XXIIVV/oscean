'use strict'; PROJECTS.graph = `

; In the real world, it didn’t matter if I was there or not.
; When I realized that, I was no longer afraid of losing my body.

(dom:set-class (dom:body) "loading")

(def _terminal (dom:create "terminal"))
(def _termhand (dom:create "termhand"))
(def _termview (dom:create "termview" "textarea"))
; header
(def _header (dom:create "header"))
(def _photo (dom:create "photo"))
(def _menu (dom:create "menu"))
(def _activity (dom:create "activity" "ul"))
(def _logo (dom:create "logo" "a" "sprite_logo"))
(def _search (dom:create "search" "input"))
(def _title (dom:create "title"))
; core
(def _core (dom:create "core"))
(def _sidebar (dom:create "sidebar"))
(def _content (dom:create "content"))
; footer
(def _footer (dom:create "footer"))
; set
(dom:set-attr _logo "data-goto" "home")
(dom:set-attr _termview "spellcheck" "false")
(dom:set-html _activity 
  (concat 
    (wrap (link "calendar" "Calendar" "local calendar sprite_calendar") "li") 
    (wrap (link "journal" "Journal" "local journal sprite_journal") "li") 
    (wrap (link "tracker" "Tracker" "local tracker sprite_tracker") "li")))
; footer
(def __socials 
  (concat 
    (link "https://github.com/neauoire" "" "icon github sprite_github external") 
    (link "https://merveilles.town/@neauoire" "" "icon merveilles sprite_merveilles external") 
    (link "http://webring.xxiivv.com/#random" "" "icon rotonde sprite_rotonde external") 
    (link "https://creativecommons.org/licenses/by-nc-sa/4.0" "" "icon cc sprite_cc external") 
    (link "https://100r.co" "" "icon hundredrabbits sprite_hundredrabbits external") 
    (link "Devine Lu Linvega") " © 06I04 — " (new "Arvelie") 
    (wrap (concat (link "About" "BY-NC-SA 4.0") " " (new "Neralie")) "center")))
; assemble
(dom:set-html _footer (wrap (concat __socials) "div" "wr"))
(dom:append _terminal (_termhand _termview))
(dom:append _menu (_logo _search _activity))
(dom:append _header (_photo _menu))
(dom:append _core (_sidebar _content))
(dom:append (dom:body) (_terminal _header _core _footer))
`