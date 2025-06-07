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
We'll create an organism that lives for 3 years before going back to sleep.

wake*: spring*: summer*: autumn*: winter*:
    spring* Year1* Year2/2* Year3/2*.

These memory neurons will remain active through the seasons.

Year1*: Year1* Year2*.
Year2*: Year2* Year3*.

These last connections will turn off the years and break the loop.

Year3*; summer* Year1* Year2* Year3*.

Hey, it's time to wake* up.`,

}