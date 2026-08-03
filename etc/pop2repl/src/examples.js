let examples={}
examples.hello_world=`function printHello;
	vars text:"Hello World!" cx:1 ch:2 i;
	0 -> i;
loop:
	text{i} -> ch;
	if cx; then cx => 24, i + 1 -> i, goto loop;
	close
end

printHello();`
