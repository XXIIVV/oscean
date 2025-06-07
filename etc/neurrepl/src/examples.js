/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {
/*
@|Hello */

"hello": `Welcome to the Neur playground,
Click the Wake Up button to evaluate the program.
Select other examples with the dropdown.

Chores.
	- Cook dinner*
	- Clean dishes*
	- Shovel snow*
	: The chores are done*.

Once you're done*:
	you can go play*.

Removed snow*, did dinner* & dishes*.`,

/*
@|Anon */

"anon": `Anonymous neurons are written as a single star, 
these neurons are useful to synchronize messages.

For example, start*:*:*:*:end*.

The start* neuron will fire and, 
in turn, animate 3 anonymous neurons.
`,

/*
@|Loop */

"loop": `A loop in Neur is created by tying neurons into a loop.
We'll create a loop that spins a signal between three neurons.

We'll begin by connecting wake*:
	to the first* neuron:
	and go through second*:
	then the third*:
	before going back to first*.

Time to wake* up.`,

}