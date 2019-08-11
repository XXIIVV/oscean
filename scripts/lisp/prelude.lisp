'use strict'; PROJECTS.prelude = `
; array
(defn first (arr) (get arr 0))
(defn last (arr) (get arr (sub (len arr) 1)))
; dom tools
(defn includes (str txt) (gt (index str txt) -1))
(defn get-class (el) (dom:get-attr el "class"))
(defn set-class (el cl) (dom:set-attr el "class" cl))
(defn has-class (el cl) (includes (get-class el) cl))
(defn add-class (el cl) ((if (eq (has-class el cl) false) (set-class el (concat (get-class el) " " cl)))))
(defn del-class (el cl) ((if (eq (has-class el cl) true) (set-class el (replace (get-class el) cl " ")))))
; markup tools
(defn wrap (body tag cl) (concat "<" tag " class='" (if cl cl "") "'>" body "</" tag ">"))
(defn bold (body) (wrap body "b"))
(defn ital (body) (wrap body "i"))
(defn code (body) (wrap body "code"))
; time
(defn ms-since (g) (sub (time:now) (time:new g)))
(defn days-since (g) (div (div (ms-since g) 1000) 86400))
`