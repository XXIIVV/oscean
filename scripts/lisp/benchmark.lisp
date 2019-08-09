'use strict'; PROJECTS.benchmark = `
; strings
(test "substr" (substr "hello world" 2 4) "llo ")
(test "split" (split "hello world" " ") ("hello" "world"))
(test "replace" (replace "hello world" "hello" "bye") "bye world")
(test "lc" (lc "hello World") "hello world")
(test "tc" (tc "hello World") "Hello World")
(test "uc" (uc "hello World") "HELLO WORLD")
(test "cc" (cc "hello World") "Hello World")
; Basics
(test "add" (add 8 4 2) 14)
(test "sub" (sub 8 4 2) 2)
(test "mul" (mul 8 4 2) 64)
(test "div" (div 8 4 2) 1)
; Others
(test "mod" (mod 6 4) 2)
(test "clamp" (clamp 12 4 8) 8)
(test "step" (step 12 10) 10)
; Logic
(test "lt" (lt 3 4) true)
(test "lt" (lt 4 3) false)
(test "gt" (gt 4 3) true)
(test "gt" (gt 3 4) false)
(test "eq" (eq 3 3) true)
(test "eq" (eq 3 4) false)
(test "neq" (neq 3 4) true)
(test "neq" (neq 3 3) false)
(test "and - true" (and 1 2 true 4) 4)
(test "and - false" (and 1 false 2) false)
(test "or - true" (or false false 2 false) 2)
(test "if - branch 1" (if (gt 3 2) ("branch 1") ("branch 2")) "branch 1")
(test "if - branch 2" (if (lt 3 2) ("branch 1") ("branch 2")) "branch 2")
(test "if - no else" (if (lt 3 2) ("branch 1")) ())
; Arrays
(test "first" (first ("a" "b" "c")) "a")
(test "rest" (rest ("a" "b" "c")) ("b" "c"))
(test "last" (last ("a" "b" "c")) "c")
; Scope
(def aaa 123)
(def addOne (λ (a) (add a 1)))
(test "def - value" aaa 123)
(test "def - func" (addOne 4) 5)
(defn addTwo (a) (add 2 a))
(test "defn" (addTwo 4) 6)
(defn mulTwo "multiplies by two" (a) (mul 2 a))
(test "docstring" (mulTwo 4) 8)
; Generics
(test "concat" (concat 1 4 "-" (add 3 4) ".jpg") "14-7.jpg")
`