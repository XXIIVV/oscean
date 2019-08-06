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
  (dom:create "activity"))
(def _logo 
  (dom:create "logo"))
(def _search 
  (dom:create "search"))


(def _title 
  (dom:create "title"))
(def _glyph 
  (dom:create "glyph"))

;

(def _core 
  (dom:create "core"))

(def _sidebar 
  (dom:create "sidebar"))

(def _content 
  (dom:create "content"))

(def _navi 
  (dom:create "navi"))

;

(def _footer 
  (dom:create "footer"))

;

; (dom:append _info (_title _glyph))
; (dom:append _menu (_info _activity _logo _search))
; (dom:append _header (_photo _menu))
; (dom:append _content (_main _tracker _calendar _journal))
; (dom:append _core (_sidebar _content _navi))
(dom:append dom:body (_header _core _footer))

(dom:set-html _footer "<div class='wr'><a target='_blank' rel='noreferrer' href='https://twitter.com/neauoire' class='icon twitter sprite_twitter external'></a><a target='_blank' rel='noreferrer' href='https://github.com/neauoire' class='icon github sprite_github external'></a>      <a target='_blank' rel='noreferrer' href='https://merveilles.town/@neauoire' class='icon merveilles sprite_merveilles external'></a><a target='_blank' rel='noreferrer' href='http://webring.xxiivv.com/#random' class='icon rotonde sprite_rotonde'></a><a target='_blank' rel='noreferrer' href='https://creativecommons.org/licenses/by-nc-sa/4.0/' class='icon cc sprite_cc'></a><a data-goto='devine lu linvega' href='#devine+lu+linvega'>Devine Lu Linvega</a> © 06I04—06I04<center><a>BY-NC-SA 4.0</a> <span style='color:#ccc'>300:034</span></center><a target='_blank' href='https://100r.co' rel='noreferrer' class='icon hundredrabbits sprite_hundredrabbits'></a><hr></div>")

`