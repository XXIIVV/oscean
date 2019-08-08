'use strict'; const prelude = `
; dom tools
(defn includes (str txt) (gt (index str txt) -1))
(defn get-class (el) (dom:get-attr el "class"))
(defn set-class (el cl) (dom:set-attr el "class" cl))
(defn has-class (el cl) (includes (get-class el) cl))
(defn add-class (el cl) ((if (eq (has-class el cl) false)(set-class el (concat (get-class el) " " cl)))))
(defn del-class (el cl) ((if (eq (has-class el cl) true)(set-class el (replace (get-class el) cl " ")))))
; markup tools
(defn wrap (body tag cl) (concat "<" tag " class='" cl "'>" body "</" tag ">"))
(defn bold (body) (wrap body "b"))
(defn ital (body) (wrap body "i"))
(defn code (body) (wrap body "code"))
`