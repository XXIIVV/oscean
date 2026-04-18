let examples = {}


examples.hello_world = `(define double
	(lambda (x) (+ x x)))

(if 
	(eq? (+ (double 6) (* 34 56)) 1916)
	'correct
	'wrong)

(print 
	'(hello world))`,

examples.factorial = 

`(define fac 
	(lambda (n)
		(if (< n 2)
			1 
			(* n (fac (- n 1))))))

(print (fac 5))`,

examples.fizzbuzz = 

`(define print-ln
	(lambda (s)
		(and (print s) (print '-))))

(define fizzbuzz
	(lambda (n f b)
		(if (< n 50)
			(if (and (eq? f 3) (eq? b 5))
				(and (print-ln 'FizzBuzz) (fizzbuzz (+ n 1) 1 1))
				(if (eq? f 3)
					(and (print-ln 'Fizz) (fizzbuzz (+ n 1) 1 (+ b 1)))
					(if (eq? b 5)
						(and (print-ln 'Buzz) (fizzbuzz (+ n 1) (+ f 1) 1))
						(and (print-ln n) (fizzbuzz (+ n 1) (+ f 1) (+ b 1))))))
			())))

(fizzbuzz 1 1 1)`

examples.combinators = `(define I (lambda (a) a))
(define K (lambda (a) (lambda (b) a)))
(define B (lambda (f) (lambda (g) (lambda (x) (f (g x))))))
(define S (lambda (f) (lambda (g) (lambda (x) ((f x) (g x))))))

(define zero (K I))
(define one I)
(define succ (S B))
(define mul B)
(define add ((B S) (B B)))

(define print_church
 (lambda (n) ((n (lambda (x) (+ x 1))) 0)))

(define two (succ one))
(define three (succ two))
(define four (succ three))
(define five (succ four))

(print (print_church zero)) 
(print (print_church three)) 
(print (print_church ((add two) three))) 
(print (print_church ((mul two) three))) 
(print (print_church ((mul three) four))) `