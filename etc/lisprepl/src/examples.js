/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {


"hello": 

`(and 
	(print 'Hello)
	(print 'World)
	())`,

"factorial":

`(define fac 
	(lambda (n)
		(if (< n 2)
			1 
			(* n (fac (- n 1))))))

(print (fac 5))`,

"fizzbuzz": 

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

}