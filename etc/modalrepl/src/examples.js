/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {
/*
@|0.Hello-World */

"0_mod": `<> (Welcome to the Modal playground,
    Click the Rewrite button to evaluate the program.
    Select other examples with the dropdown.)

<> (equal ?a ?a) (Bool True) 
<> (equal ?a ?b) (Bool False)

<> (Rules are made of a left and a right side.
    They are tested in from first to last, from left to right.
    When a match occurs, the lhs is replaced by the rhs.
    Wildcards prefixed with ? will always match.

    Rules without a right-hand side are comments.
    Printing is done with the ?: wildcard.)

<> (print-bool (Bool ?:)) (done.)

(print-bool (equal baz baz))`,

/*
@|Add */

"add": `<> (Add 2 + 3 and print the result)

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

"multiply": `<> (Multiply 2 * 5)

<> (?a * (?b)) ((?a * ?b) + ?a)
<> ((?a) + ?b) (?a + (?b))
<> (0 + ?b) ?b
<> (?a * 0) (0)

<> (wait) (print)
<> ((?:) (print)) ()

((2 * 5) (wait))` ,

/*
@|Find */

"find": `<> (Find a value in a list.)

<> ((find ?target) ?target (?next ?tail))
   (?head (found ?target) ?next ?tail)
<> ((find ?target) ?head (?next ?tail))
   (?head ((find ?target) ?next ?tail))
<> ((find ?target) ?head ())
   ((unfound ?target) ?head ())

<> (Found)
<> (?head ((found ?target) ?next ?tail))
   ((found ?target) ?head (?next ?tail))

<> (Unfound)
<> (?head ((unfound ?target) ?next ?tail))
   ((unfound ?target) ?head (?next ?tail))

(
	(find e)
	a (b (c (d (e (f (g (h ())))))))
)`,

/*
@|Stack-machine */

"stack": 
`<> ((Stack (?tail ?a)) dup)         (Stack ((?tail ?a) ?a))
<> ((Stack (?tail ?a)) pop)         (Stack ?tail)
<> ((Stack ((?tail ?b) ?a)) swap)   (Stack ((?tail ?a) ?b))
<> ((Stack ((?tail ?c) ?b) ?a) rot) (Stack (((?tail ?a) ?b) ?c))

(((((Stack (((D) C) B) A) rot) pop) swap) dup)`,


/*
@|FizzBuzz */

"fizzbuzz": 
`<> (For a hundred numbers:
      - When divisible by 15, print FizzBuzz
      - When divisible by 3, print Fizz
      - When divisible by 5, print Buzz
      - Otherwise, print the number. )

<> ((print-line ?:) ?i ?f ?b) ((print \\n) ?i ?f ?b)
<> ((print ?:) ?i ?f ?b) (?i ?f ?b)

<> (100 ?f ?b) (done.)
<> (?i 3 5)    ((print-line FizzBuzz) (?i) 0 0)
<> (?i 3 ?b)   ((print-line Fizz) (?i) 0 (?b))
<> (?i ?f 5)   ((print-line Buzz) (?i) (?f) 0)
<> (?i ?f ?b)  ((print-line ?i) (?i) (?f) (?b))

(0 0 0)`

}