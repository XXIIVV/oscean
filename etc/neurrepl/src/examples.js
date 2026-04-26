let examples={}
examples.hello_world=`Take some matches* and some wood*:
	and make a fire*.

Some matches*, some wood* and water*:
	will leave wet-ashes*.

If there's a fire*:
	then there's light*.

Putting some water*;
	will extinguish the fire*.

I got matches* and wood*.`
examples.chores=`Chores.
	- Cook dinner*
	- Clean dishes*
	- Shovel snow*
	: The chores are done*.

Once you're done*:
	you can go play*.

Removed snow*, did dinner* & dishes*.
`
examples.salad=`Take flour* water* and sugar*:
	and bake a cake*.

Take apples* oranges* cherries*:
	and make a fruit-salad*.

Put the fruit-salad* on the cake*:
	and you get a fruit-cake*.

I have flour*, apples*, water*, oranges*, sugar* and cherries*.`
examples.rock_paper_scissors=`Winning moves.
rock* scissors*: *: rock-wins*.
scissors* paper*: *: scissors-wins*.
paper* rock*: *: paper-wins*.

Handle ties.
rock* paper* scissors*: no-tie/2*; nobody-wins*.
game*: *: nobody-wins*.

Start game*.
One plays rock*.
Two plays rock*.
`
examples.tic_tac_toe=`Tic-Tac-Toe.

Winning states for X player.
xa* xb* xc*: *: win-x*.
xd* xe* xf*: *: win-x*.
xg* xh* xi*: *: win-x*.
xa* xe* xi*: *: win-x*.
xg* xe* xc*: *: win-x*.
xa* xd* xg*: *: win-x*.
xb* xe* xh*: *: win-x*.
xc* xf* xi*: *: win-x*.

Winning states for O player.
oa* ob* oc*: *: win-o*.
od* oe* of*: *: win-o*.
og* oh* oi*: *: win-o*.
oa* oe* oi*: *: win-o*.
og* oe* oc*: *: win-o*.
oa* od* og*: *: win-o*.
ob* oe* oh*: *: win-o*.
oc* of* oi*: *: win-o*.

Set move in the format xa, ob, xc, etc

	a | b | c
	--+---+--
	d | e | f
	--+---+--
	g | h | i .

Play oc*.
Play xb*.
Play oe*.
Play xh*.
Play og*.
`
examples.seasons=`A loop in Neur is created by tying neurons into a loop.
We'll create an organism that lives for 3 years before going back to sleep.

wake*: spring*: summer*: autumn*: winter*:
    spring* Year1* Year2/2* Year3/2*.

These memory neurons will remain active through the seasons.

Year1*: Year1* Year2*.
Year2*: Year2* Year3*.

These last connections will turn off the years and break the loop.

Year3*; summer* Year1* Year2* Year3*.

Hey, it's time to wake* up.`
examples.scaler=`pulse-1*; pulse-1*: capacitor*.
pulse-2*; pulse-2*: delay*: capacitor*.

capacitor*: A/2* B/1*.

B*:B*:A*.
A*;A*;B*.

A*: output*.

pulse-1* pulse-2*.
`
examples.logic=`a*; a*.
b*; b*.

a* b*: AND*.

a*: OR*.
b*: OR*.

Activate both a* & b*.
`
