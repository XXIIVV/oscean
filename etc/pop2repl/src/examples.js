let examples={}
examples.hello_world=`comment Welcome to POP-2;

function printString s;
	vars c:1 cells:2 i;
	0 -> i;
loop:
	{s+i} -> cells;
	if c 
		then c => 23, i + 1 -> i, goto loop
	close
end

printString("Hello World!");
`
examples.string_length=`comment Get the length of a string;

function getStringLength s;
	vars start; s -> start;
loop:
	if {s} & 0xff;
		then s + 1 -> s, goto loop; 
	close
	s - start + 1;
end

getStringLength("POP-2");
`
examples.nested_function=`comment A function calling another inside a loop;

function row w;
	vars x; 0 -> x;
hor:
	if x < w
		then 0x2e => 23, x + 1 -> x, goto hor
	close
	0xa => 23;
end

function box w h;
	vars y; 0 -> y;
ver:
	if y < h
		then row(w), y + 1 -> y, goto ver
	close
end

box(4,5);
`
examples.quoted_function=`comment This example shows how to quote a function and apply it;

function double n;
	n + n;
end

function apply fn n;
	n <> fn;
end

apply(@double, 5);
`
examples.factorial=`comment Factorial, recursive;
function factRec n;
	if n = 0
		then 1
	else 
		n * factRec(n-1)
	close
end
factRec(5);

comment Factorial, tailcalls;
function fact n;
	vars p; 1 -> p;
loop:
	if n = 0
		then p;
	else
		n*p -> p, n-1 -> n, goto loop
	close
end
fact(5);
`
examples.fizzbuzz=`function fizzbuzz;
	vars i; 1 -> i;
loop:
	if i % 15 = 0 
		then printString("FizzBuzz");
	elseif i % 5 = 0
		then printString("Buzz");
	elseif i % 3 = 0
		then printString("Fizz");
	else
		printNumber(i);
	close
	0xa => 23;
	i + 1 -> i;
	if i < 100
		then goto loop
	close
end

function printNumber n;
	if n > 9; 
		then n/10  % 10 + 0x30 => 23
	close
	n % 10 + 0x30 => 23;
end

function printString s;
	vars c:1 cells:2 i;
	0 -> i;
loop:
	{s+i} -> cells;
	if c
		then c => 23, i + 1 -> i, goto loop
	close
end

fizzbuzz();
`
examples.proquints=`comment Convert four bytes into proquints;

printProquints(128, 30, 52, 45);

function printVowel id;
	vars arr:"aiou";
	{#arr + (id & 0x3)}/0x100 => 23;
end

function printConsonant id;
	vars arr:"bdfghjklmnprstvz";
	{#arr + (id & 0xf)}/0x100 => 23;
end

function printProquint hb lb;
	vars combined; 
	hb * 0x100 | lb -> combined;
	printConsonant(combined/0x1000);
	printVowel(combined/0x400);
	printConsonant(combined/0x40);
	printVowel(combined/0x10);
	printConsonant(combined);
end

function printProquints a b c d;
	printProquint(a, b);
	0x2d => 23;
	printProquint(c, d);
end
`
