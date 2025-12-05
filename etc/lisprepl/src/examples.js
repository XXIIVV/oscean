/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {
/*
@|0.Hello-World */

"0_mod": `(+ 2 3)`,

/*
@|Add */

"add": `<> (Add 2 + 3, print the result)

<> (add (?a) ?b) (add ?a (?b))
<> (add 0 ?b) (sum ?b)
<> (print (sum ?:)) ()

(print (add 3 2))`,

/*
@|1 */

"1_mod": `<> (Reverse a List)

<> (reverse List (?x ?y) ?z) (reverse List ?y (?x ?z))
<> (reverse List ?empty ?list) (print List ?list)
<> (print List (?: ?x)) (print List ?x)
<> (print List ()) (done.)

(reverse List (m (o (d (a (l ()))))) ())`,

/*
@|Tic-tac-toe */

"tic-tac-toe": `<> (Tic-tac-toe
    All the winning boards: )

<> (?x ?x ?x
    ?d ?e ?f
    ?g ?h ?i) (Win ?x)
<> (?a ?b ?c
    ?x ?x ?x
    ?g ?h ?i) (Win ?x)
<> (?a ?b ?c
    ?d ?e ?f
    ?x ?x ?x) (Win ?x)
<> (?x ?b ?c
    ?x ?e ?f
    ?x ?h ?i) (Win ?x)
<> (?a ?x ?c
    ?d ?x ?f
    ?g ?x ?i) (Win ?x)
<> (?a ?b ?x
    ?d ?e ?x
    ?g ?h ?x) (Win ?x)
<> (?x ?b ?c
    ?d ?x ?f
    ?g ?h ?x) (Win ?x)
<> (?a ?b ?x
    ?d ?x ?f
    ?x ?h ?i) (Win ?x)

(a b c
 d e f
 g h i)`,

/*
@|Multiply */

"multiply": `<> (Multiply 2 * 5, print the result)

<> (?a * (?b)) ((?a * ?b) + ?a)
<> ((?a) + ?b) (?a + (?b))
<> (0 + ?b) ?b
<> (?a * 0) (0)

<> (wait) (print)
<> ((?:) (print)) ()

((2 * 5) (wait))` ,

/*
@|Find */

"find": `<> (Find a value in a list)

<> ((find ?target) ?target (?next ?tail)) (?head (found ?target) ?next ?tail)
<> ((find ?target) ?head (?next ?tail)) (?head ((find ?target) ?next ?tail))
<> ((find ?target) ?head ()) ((unfound ?target) ?head ())
<> (?head ((found ?target) ?next ?tail)) ((found ?target) ?head (?next ?tail))
<> (?head ((unfound ?target) ?next ?tail)) ((unfound ?target) ?head (?next ?tail))

((find e) a (b (c (d (e (f (g (h ()))))))))`,

/*
@|FizzBuzz */

"fizzbuzz": 
`<> (For a hundred numbers:
      - When divisible by 15, print FizzBuzz
      - When divisible by 3, print Fizz
      - When divisible by 5, print Buzz
      - Otherwise, print the number. )

<> ((print-word ?:) ?i ?f ?b) ((print-line \\n) ?i ?f ?b)
<> ((print-line ?:) ?i ?f ?b) ((?i) (?f) (?b))

<> (100 ?f ?b) (done.)
<> (?i 3 5)    ((print-word FizzBuzz) ?i 0 0)
<> (?i 3 ?b)   ((print-word Fizz) ?i 0 ?b)
<> (?i ?f 5)   ((print-word Buzz) ?i ?f 0)
<> (?i ?f ?b)  ((print-word ?i) ?i ?f ?b)

(1 1 1)`,

/*
@|Fib */

"fib": 
`<> (Print the nth Fibonacci number)

<> (fib 0) 0
<> (fib 1) 1
<> (fib ((?n))) (add (fib (?n)) (fib ?n))

<> (add 0 ?b) ?b
<> (add (?a) ?b) (add ?a (?b))
<> (wait) (print)
<> (?: (print)) ()

((fib 6) (wait))`

}