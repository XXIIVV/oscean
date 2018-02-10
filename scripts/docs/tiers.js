var payload = new Runic(`
> <table class='book'>
> <tr><th colspan='3'>The Self</th></tr>
> <tr><td>Defined by intentions</td>  <td>Defined by association</td> <td>Defined by the past</td></tr>
> <tr><td>Self-Actualization</td>     <td>Social Validation</td>      <td>Comfort and Basic Needs</td></tr>
> <tr><td>Made</td>                   <td>Shaped</td>                 <td>Molded</td></tr>
> <tr><td>Defines a label</td>        <td>Picks a label</td>          <td>Is given a label</td></tr>
> <tr><th colspan='3'>The Aspirations</th></tr>
> <tr><td>Wants to do</td>            <td>Wants to be</td>            <td>Wants to have</td></tr>
> <tr><td>Wants to live forever</td>  <td>Wants to be remembered</td> <td>Wants to die happy</td></tr>
> <tr><td>Fears the lack of time</td> <td>Fears being wrong</td>      <td>Fears not having enough</td></tr>
> <tr><td>Thinks of the future</td>   <td>Thinks of what others will think</td><td>Thinks of the money</td></tr>
> <tr><th colspan='3'>The Actions</th></tr>
> <tr><td>Talks about ideas</td>      <td>Talks about people</td>         <td>Talks about things</td></tr>
> <tr><td>Thinks in pictures</td>     <td>Thinks in words</td>         <td>Thinks in feelings</td></tr>
> <tr><td>Likes the story</td>        <td>Likes the artis</td>         <td>Likes the effects</td></tr>
> <tr><td>Clings to the future</td>   <td>Clings to the present</td>  <td>Clings to the past</td></tr>
> <tr><td>Innovates</td>              <td>Improves</td>                <td>Repeats  </td></tr>
> <tr><td>Does it with you</td>       <td>Tells you what to do</td>   <td>Does it for you</td></tr>
> <tr><td>Solves the problem</td>     <td>Asks for the solution</td>   <td>Copies the solution</td></tr>
> <tr><td>Make it happen</td>         <td>Fake it till you make it</td> <td>Wait until it happens</td></tr>
> <tr><td>Praises what you did</td>   <td>Praises who you are</td>      <td>Praises what you have</td></tr>
> <tr><th colspan='3'>The Authority</th></tr>
> <tr><td>Logic, Power, Authenticity</td><td>Authority, Purpose, Conformity</td><td>Experience, Freedom, Complacency</td></tr>
> <tr><td>Create</td><td>Resell</td><td>Consume</td></tr>
> <tr><td>Imagination</td><td>Rearrangement</td><td>Trial and error</td></tr>
> <tr><td>Respects you</td><td>Respects your status</td><td>Respects you earnings</td></tr>
> <tr><td>Looks for equals</td><td>Looks for leaders</td><td>Looks for gods</td></tr>
> <tr><td>Puppet master</td><td>Strings</td><td>Puppet</td></tr>
> <tr><td>Power is created</td><td>Power is given</td><td>Power is born into</td></tr>
> <tr><td>Defensive if misunderstood</td><td>Defensive of their authority</td><td>Defensive of anything personal</td></tr>
> <tr><td>Because I want to</td><td>Because you’re supposed to</td><td>Because it feels good/bad</td></tr>
> <tr><td>Wrong if illogical</td><td>Wrong if no one else agrees</td><td>Wrong if I don’t see it</td></tr>
> <tr><td>Kantian</td><td>Utilitarian</td><td>Hedonistic</td></tr>
> <tr><td>Can't stand boredom</td><td>Can't stand uncertainty</td><td>Can’t stand pain</td></tr>
> <tr><th colspan='3'>The Truth</th></tr>
> <tr><td>Understands</td><td>Memorizes</td><td>Improvises</td></tr>
> <tr><td>From experiments</td><td>From memorization</td><td>From conditioning</td></tr>
> <tr><td>Rather be unhappy with truth</td><td>Rather be happy with a lie</td><td>Rather not know</td></tr>
> <tr><td>Arrogance is ignoring reason</td><td>Arrogance is ignoring majority</td><td>Arrogance is being right too often</td></tr>
> <tr><td>Truth is objective</td><td>Truth is what others say</td><td>Truth is what I see</td></tr>
> <tr><td>Know the truth</td><td>Know your place</td><td>Know your limits</td></tr>
> <tr><td>Perception is malleable</td><td>Perception is reality</td><td>Perception is BS</td></tr>
> <tr><th colspan='3'>The World</th></tr>
> <tr><td>Universe is deterministic</td><td>Universe is rule-based</td><td>Universe is chance</td></tr>
> <tr><td>Because cause-effect</td><td>Because what others say so</td><td>Just because</td></tr>
> <tr><td>Proof by logic</td><td>Proof by social validation</td><td>Proof by empirical evidence</td></tr>
> <tr><td>Unknown is unknown</td><td>Unknown is zero</td><td>Unknown is random</td></tr>
> <tr><td>The world is the beginning</td><td>The world is the world</td><td>The world is the limit</td></tr>
> <tr><td>Trapped by the universe</td><td>Trapped by society</td><td>Trapped by the body</td></tr>
> <tr><td>The world is mine</td><td>The world is everyone else's</td><td>The world is rigged</td></tr>
> <tr><td>Absolutes exist</td><td>Absolutes are bad</td><td>Nothing is absolute</td></tr>
> <tr><td>World is a sandbox</td><td>World is chutes and ladders</td><td>World is a hierarchy</td></tr>
> <tr><td>Chess board</td><td>Race track</td><td>Mouse trap</td></tr>
> </table>
`); invoke.vessel.seal("docs","tiers",payload);
