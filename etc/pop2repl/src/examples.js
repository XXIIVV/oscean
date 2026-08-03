let examples={}
examples.hello_world=`comment Welcome to POP-2;

function printString s;
	vars cx:1 ch:2 i;
	0 -> i;
loop:
	{s+i} -> ch;
	if cx; then cx => 23, i + 1 -> i, goto loop;
	close
end

vars text:"Hello World!";
printString(#text);
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
	vars p; 1 => p;
loop:
	if n = 0; then p;
	else n*p => p; n-1 => n; goto loop
	close
end
fact(5);
`
