'use strict'; PROJECTS.prelude = `
; string
(defn includes (str txt) (gt (index str txt) -1))
; array
(defn first (arr) (get arr 0))
(defn last (arr) (get arr (sub (len arr) 1)))
; dom tools
(def dom:get-class (λ (el) (dom:get-attr el "class")))
(def dom:set-class (λ (el cl) (dom:set-attr el "class" cl)))
(def dom:has-class (λ (el cl) (includes (dom:get-class el) cl)))
(def dom:add-class (λ (el cl) ((if (eq (dom:has-class el cl) false) (dom:set-class el (concat (dom:get-class el) " " cl))))))
(def dom:del-class (λ (el cl) ((if (eq (dom:has-class el cl) true) (dom:set-class el (replace (dom:get-class el) cl " "))))))
; markup tools
(defn wrap (body tag cl) (concat "<" tag " " (if cl (concat "class='" cl "'") "") ">" body "</" tag ">"))
(defn bold (body) (wrap body "b"))
(defn ital (body) (wrap body "i"))
(defn code (body) (wrap body "code"))
; time
(defn ms-since (g) (sub (time:now) (time:date g)))
(defn days-since (g) (div (div (ms-since g) 1000) 86400))
`