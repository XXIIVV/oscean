/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {
/*
@|0.Hello-World */

"0_mod": `Welcome to the Modal playground,
Click the Rewrite button to evaluate the program.
Select other examples with the dropdown.

<> (equal ?a ?a) (Bool True) 
<> (equal ?a ?b) (Bool False)

Rules are made of a left and a right side.
They are tested in from first to last, from left to right.
When a match occurs, the lhs is replaced by the rhs.
Words prefixed with ? will always match.

Printing to the bottom of the screen is done with ?:

<> (print-bool (Bool ?:)) ()

(print-bool (equal baz baz))`,

/*
@|1 */

"1_mod": `<> (reverse List (?x ?y) ?z) (reverse List ?y (?x ?z))
<> (reverse List ?empty ?list) (print List ?list)
<> (print List (?: ?x)) (print List ?x)
<> (print List ()) (done.)

(reverse List (m (o (d (a (l ()))))) ())`,

/*
@|2 */

"2_mod": `More examples coming soon.`,

}