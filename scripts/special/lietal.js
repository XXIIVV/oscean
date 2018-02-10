function lietal_docs()
{
  this.html = function()
  {
    return new Runic(`
* Morphology

& Building words from Lietal's phonemes is called childspeak. It makes for rythmical and syllabic words, but take quite a long time to actually speak it. This documentation uses the phonetically denser {_Adultspeak_}.
& Single syllable words are reversed, so {#vo#} becomes {#${invoke.vessel.lietal.adultspeak("vo")}#}. Vowel sequences, like {#lara#}, are condensed into {#${invoke.vessel.lietal.adultspeak("lara")}#}. Consonant sequences, like {#lyfasa#}, are condensed into {#${invoke.vessel.lietal.adultspeak("lyfasa")}#}. Here are a few examples:

! English  | Childspeak   | Adultspeak
| Yes      | vi           | ${invoke.vessel.lietal.adultspeak("vi")}
| Who      | jada         | ${invoke.vessel.lietal.adultspeak("jada")}
| Outside  | kika         | ${invoke.vessel.lietal.adultspeak("kika")}
| To Read  | fatati       | ${invoke.vessel.lietal.adultspeak("fatati")}
| Whenever | salidi       | ${invoke.vessel.lietal.adultspeak("salidi")}

* Alphabet

& The Alphabet is a collection of 9 elementary particles, each is made of a key(consonant) and one of the 6 values(vowels). Knowing this table should allow you guess the meaning of {*any word construction*}.

= Table

> <table class='outline' style='width:100%'>
> <tr><th>{*Ky*} ${invoke.vessel.lietal.convert("ky").toLowerCase()}</th><th>{*Ty*} ${invoke.vessel.lietal.convert("ty").toLowerCase()}</th><th>{*Dy*} ${invoke.vessel.lietal.convert("dy").toLowerCase()}</th></tr>
> <tr>
> <td>{*Ki*} ${invoke.vessel.lietal.convert("ki").toLowerCase()}<br />{*Ka*} ${invoke.vessel.lietal.convert("ka").toLowerCase()}<br />{*Ko*} ${invoke.vessel.lietal.convert("ko").toLowerCase()}<br />{*Ke*} ${invoke.vessel.lietal.convert("ke").toLowerCase()}<br />{*Ku*} ${invoke.vessel.lietal.convert("ku").toLowerCase()}</td>
> <td>{*Ti*} ${invoke.vessel.lietal.convert("ti").toLowerCase()}<br />{*Ta*} ${invoke.vessel.lietal.convert("ta").toLowerCase()}<br />{*To*} ${invoke.vessel.lietal.convert("to").toLowerCase()}<br />{*Te*} ${invoke.vessel.lietal.convert("te").toLowerCase()}<br />{*Tu*} ${invoke.vessel.lietal.convert("tu").toLowerCase()}</td>
> <td>{*Di*} ${invoke.vessel.lietal.convert("di").toLowerCase()}<br />{*Da*} ${invoke.vessel.lietal.convert("da").toLowerCase()}<br />{*Do*} ${invoke.vessel.lietal.convert("do").toLowerCase()}<br />{*De*} ${invoke.vessel.lietal.convert("de").toLowerCase()}<br />{*Du*} ${invoke.vessel.lietal.convert("du").toLowerCase()}</td>
> </tr>
> <tr><th>{*Ry*} ${invoke.vessel.lietal.convert("ry").toLowerCase()}</th><th>{*Sy*} ${invoke.vessel.lietal.convert("sy").toLowerCase()}</th><th>{*Ly*} ${invoke.vessel.lietal.convert("ly").toLowerCase()}</th></tr>
> <tr>
> <td>{*Ri*} ${invoke.vessel.lietal.convert("ri").toLowerCase()}<br />{*Ra*} ${invoke.vessel.lietal.convert("ra").toLowerCase()}<br />{*Ro*} ${invoke.vessel.lietal.convert("ro").toLowerCase()}<br />{*Re*} ${invoke.vessel.lietal.convert("re").toLowerCase()}<br />{*Ru*} ${invoke.vessel.lietal.convert("ru").toLowerCase()}</td>
> <td>{*Si*} ${invoke.vessel.lietal.convert("si").toLowerCase()}<br />{*Sa*} ${invoke.vessel.lietal.convert("sa").toLowerCase()}<br />{*So*} ${invoke.vessel.lietal.convert("so").toLowerCase()}<br />{*Se*} ${invoke.vessel.lietal.convert("se").toLowerCase()}<br />{*Su*} ${invoke.vessel.lietal.convert("su").toLowerCase()}</td>
> <td>{*Li*} ${invoke.vessel.lietal.convert("li").toLowerCase()}<br />{*La*} ${invoke.vessel.lietal.convert("la").toLowerCase()}<br />{*Lo*} ${invoke.vessel.lietal.convert("lo").toLowerCase()}<br />{*Le*} ${invoke.vessel.lietal.convert("le").toLowerCase()}<br />{*Lu*} ${invoke.vessel.lietal.convert("lu").toLowerCase()}</td>
> </tr>
> <tr><th>{*Jy*} ${invoke.vessel.lietal.convert("jy").toLowerCase()}</th><th>{*Vy*} ${invoke.vessel.lietal.convert("vy").toLowerCase()}</th><th>{*Fy*} ${invoke.vessel.lietal.convert("fy").toLowerCase()}</th></tr>
> <tr>
> <td>{*Ji*} ${invoke.vessel.lietal.convert("ji").toLowerCase()}<br />{*Ja*} ${invoke.vessel.lietal.convert("ja").toLowerCase()}<br />{*Jo*} ${invoke.vessel.lietal.convert("jo").toLowerCase()}<br />{*Je*} ${invoke.vessel.lietal.convert("je").toLowerCase()}<br />{*Ju*} ${invoke.vessel.lietal.convert("ju").toLowerCase()}</td>
> <td>{*Vi*} ${invoke.vessel.lietal.convert("vi").toLowerCase()}<br />{*Va*} ${invoke.vessel.lietal.convert("va").toLowerCase()}<br />{*Vo*} ${invoke.vessel.lietal.convert("vo").toLowerCase()}<br />{*Ve*} ${invoke.vessel.lietal.convert("ve").toLowerCase()}<br />{*Vu*} ${invoke.vessel.lietal.convert("vu").toLowerCase()}</td>
> <td>{*Fi*} ${invoke.vessel.lietal.convert("fi").toLowerCase()}<br />{*Fa*} ${invoke.vessel.lietal.convert("fa").toLowerCase()}<br />{*Fo*} ${invoke.vessel.lietal.convert("fo").toLowerCase()}<br />{*Fe*} ${invoke.vessel.lietal.convert("fe").toLowerCase()}<br />{*Fu*} ${invoke.vessel.lietal.convert("fu").toLowerCase()}</td>
> </tr>
> </table>

= Construction

& Words are not created, but found among the permutations of the 9 elementary particles. Here are a few examples of the resulting translations of {*fo*} and {*la*} declensions:
# ${invoke.vessel.lietal.deconstruct("fo")}
# ${invoke.vessel.lietal.deconstruct("fori")}
# ${invoke.vessel.lietal.deconstruct("foriko")}
# ${invoke.vessel.lietal.deconstruct("la")}
# ${invoke.vessel.lietal.deconstruct("laro")}
# ${invoke.vessel.lietal.deconstruct("laroko")}

* Grammar

& The basic lietal word order is as follow:

# QUESTION SETTING - SUBJECT TOPIC VERB.

= Question

& Question words are used at the beginning of a sentence. For instance, "Where am I?" is translated to ${invoke.vessel.lietal.construction("where I to_be")}, following the {#where I to_be#} construction — and "Who are you?", or {#who you to_be#}, ${invoke.vessel.lietal.construction("who you to_be")}.

# ${invoke.vessel.lietal.deconstruct("jadi")}
# ${invoke.vessel.lietal.deconstruct("jada")}
# ${invoke.vessel.lietal.deconstruct("jado")}
# ${invoke.vessel.lietal.deconstruct("jako")}
# ${invoke.vessel.lietal.deconstruct("jafi")}

= Location

& Locations are the environment of the sentence, it preceeds a sentence. The sentence "I am home" is translated to ${invoke.vessel.lietal.construction("home.child to_be")}, following the {#home.child to_be#} structure. In written Lietal, the particles follow the word they affect.

& Time is also part of the environment of the sentence, it preceeds a sentence.The sentence "I will see you later" is translated to ${invoke.vessel.lietal.construction("future you to_see")}, following the {#future you to_see#} structure.

= Collections

& Sequences of things, or topics, can be grouped together into collections and used as a single entity. The sentence "Between you and I" is translated to ${invoke.vessel.lietal.construction("push you together I pop.between")}, following the {#[you & I].between#} structure.

& Below is another example with a different sentence structure. The sentence "Is the house blue or red?" is translated to {*Tokafo el lyfalo us lyfaloki ul'of*}, following the {#house [ red | blue ].to_be#} structure.

& Numbers are also using collections The sentence "The address is two hundred twenty three" is translated to {*Tokafo'tady el loe'il lira'lio lia ul*}, following the {#house.name [ 100.2 10.3 4 ]#} structure.

* Vocabulary

= Pronouns

& A sentence is expected to be at the first person if a pronoun has not already been declared, pronouns are often ommited when possible.
# ${invoke.vessel.lietal.deconstruct("lari")}
# ${invoke.vessel.lietal.deconstruct("lara")}
# ${invoke.vessel.lietal.deconstruct("laro")}
# ${invoke.vessel.lietal.deconstruct("liri")}
# ${invoke.vessel.lietal.deconstruct("lira")}
# ${invoke.vessel.lietal.deconstruct("liro")}

& The sentence "I give you a book" is translated to {*Lari'ar todoti fïr*}, following the {#you.to book to_give#} structure.

= Verbs

& Verbs are used at the end of a sentence and are generally built from the fy family.The sentence "I take the book home" is translated to {*Tokafo'ar todoti firo*}, following the {#house.to book to_take#} structure.

= Tenses

& Sentences are, by default, at the present tense, a tenses marker is used to contrast against an already defined tense. Tenses markers are used at the end of the sentence.The sentence "I did not go to school" is translated to {*Radoti'ar fori'dijör*}, following the {#school.to to_go.negative_past#} structure.
 
= Prepositions

& Lietal prepositions are aeths used as particles, placed after the word that they affect.The sentence "I will go to the city with you" is translated to {*Doradali'ar lari'is fori'dïr*}, following the {#city.to you.with to_go.future#} structure.

= Colors

& Colors are built by combining lyra(speed) and lyfa(color).The sentence "Yellow is between red and green" is translated to {*Lyfalök el lyfalo es lyfäl ul'käs of*}, following the {#yellow [ red & green ].between to_be#} structure.

= Numbers

& Numbers are built by combining yl(counter) and ys(relation). When base10 is used, eleven is not used.The sentence "1, 2, 3 and 123" is translated to {*Al il lio es loe lira'il lio*}, following the {#1 2 3 & 100 10.2 3#} structure.

* Summary

& Here is an example including all of the previous lessons.
& The sentence "Tomorrow, I might go to either the school, or to the library" is translated to {*Dilai el radoti us kadoti ul fori'dijari*}, following the {#tomorrow [ school | library ] to_go.potential_future#} structure.`);
    
  }
}

var payload = new lietal_docs();

invoke.vessel.seal("special","lietal",payload);