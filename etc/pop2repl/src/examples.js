let examples={}
examples.hello_world=`comment Welcome to POP-2;

function printString s;
	vars c:1 cells:2 i;
	0 -> i;
loop:
	{s+i} -> cells;
	if c; then c => 23, i + 1 -> i, goto loop;
	close
end

vars text:"Hello World!";
printString(#text);
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

vars string:"POP-2";
getStringLength(#string);
`
examples.nested_function=`comment A function calling another inside a loop;

function row w;
	vars x; 0 -> x;
hor:
	if x < w;
		then 0x2e => 23, x + 1 -> x, goto hor;
	close
	0xa => 23;
end

function box w h;
	vars y; 0 -> y;
ver:
	if y < h;
		then row(w), y + 1 -> y, goto ver;
	close
end

box(4,5);
`
examples.quoted_function=`comment This example shows how to quote a function and apply it;

function double n;
	n + n;
end

function apply fn n;
	n <- fn;
end

apply(@double, 5);
`
examples.factorial=`comment Factorial, recursive;
function factRec n;
	if n = 0; then 1;
	else n * factRec(n-1);
	close
end
factRec(5);

comment Factorial, tailcalls;
function fact n;
	vars p; 1 -> p;
loop:
	if n = 0; then p;
	else n*p -> p; n-1 -> n; goto loop
	close
end
fact(5);
`
examples.fizzbuzz=`function fizzbuzz;
	vars i f:"Fizz" b:"Buzz" fb:"FizzBuzz";
	1 -> i;
loop:
	if i % 15 = 0; 
		then printString(#fb);
	elseif i % 5 = 0;
		then printString(#b);
	elseif i % 3 = 0; 
		then printString(#f);
	else
		printNumber(i);
	close
	0xa => 23;
	i + 1 -> i;
	if i < 100; 
		then goto loop;
	close
end

function printNumber n;
	if n > 9; 
		then n/10  % 10 + 0x30 => 23; 
	close
	n % 10 + 0x30 => 23;
end

function printString s;
	vars c:1 cells:2 i;
	0 -> i;
loop:
	{s+i} -> cells;
	if c; then c => 23, i + 1 -> i, goto loop;
	close
end

fizzbuzz();
`
