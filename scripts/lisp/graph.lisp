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
  (dom:create-ns "glyph" "svg"))
(def _path 
  (dom:create-ns "path" "path"))

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

;

(def _footer 
  (dom:create "footer"))

;

(dom:set-attr _logo "data-goto" "home")
(dom:set-attr _path "transform" "scale(0.165,0.165) translate(-50,-50)")

(dom:append _glyph (_path))
(dom:append _info (_glyph _title))
(dom:append _menu (_info _logo _search _activity))
(dom:append _header (_photo _menu))
(dom:append _content (_main _tracker _calendar _journal))
(dom:append _core (_sidebar _content _navi))
(dom:append dom:body (_header _core _footer))

`