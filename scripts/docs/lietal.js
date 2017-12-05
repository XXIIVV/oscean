var payload = new Runic(`
* PHONOLOGY
? VIRO KÄR'OF LIETÄL'TAKÏT.
& Lietal is written from left to right with implicit neutrality, singularity and under the present tense. For the most part, its 6 vowels and 9 consonants are voiced similarly to their english equivalents.

& The vowels are sounded as hex{*a*}gram, n{*e*}ver, l{*ea*}ves, {*au*}tomobile, n{*ew*}, journ{*ey*} — And consonants as {*k*}iss, ti{*t*}le, {*d*}evice, retu{*r*}n, {*s*}ymphony, {*l*}igature, {*ge*}nesis, {*v*}ideo, & {*f*}estival.

* MORPHOLOGY

& Building words from Lietal's phonemes is called childspeak. It makes for rythmical and syllabic words, but take quite a long time to speak. This documentation uses the phonetically denser {_Adultspeak_}.
& Single syllable words are reversed, so vo becomes ov. Vowel sequences, like lara, are condensed into lär. Consonant sequences, like lyfasa, are condensed into lyfäs. Here are a gew examples:

~ Yes 
- vi — iv
~ Who 
- jada — jäd
~ Outside 
- kika — kia
~ To Read
- fatati — fatai
~ Whenever  
- salidi — salïd

* ALPHABET

& The Alphabet, or {_Deoto_}, is a collection of 9 elementary particles, each is made of a key(consonant) and one of the 6 values(vowels). Knowing this table show help you guess the meaning of any word construction.

* TABLE

~ {*Ky*} Hierarchy
- {*Ki*} Parent — {*Ka*} Location — {*Ko*} Children
- {*Ke*} Hierarchical — {*Ku*} Cholarchical
~ {*Ty*} State
- {*Ti*} Psychologic — {*Ta*} Phisionomic — {*To*} Physic
- {*Te*} Real — {*Tu*} Unreal
~ {*Dy*} Structure
- {*Di*} Complex — {*Da*} Organic — {*Do*} Synthetic
- {*De*} Order — {*Du*} Chaos
~ {*Ry*} Direction
- {*Ri*} Outward — {*Ra*} Position — {*Ro*} Inward
- {*Re*} Mobile — {*Ru*} Immobile
~ {*Sy*} Relation
- {*Si*} With — {*Sa*} United — {*So*} Without
- {*Se*} Related — {*Su*}  Unrelated
~ {*Ly*} Counter
- {*Li*} Multiple — {*La*} Single — {*Lo*} None
- {*Le*} Push — {*Lu*} Pop
~ {*Jy*} Modality
- {*Ji*} Certain — {*Ja*} Possible — {*Jo*} Impossible
- {*Je*} ? — Ju  ?
~ {*Vy*} Alignment
- {*Vi*} Positive — {*Va*} Neutral — {*Vo*} Negative
- {*Ve*} True — {*Vu*}  False
~ {*Fy*} Interaction
- {*Fi*} To_make — {*Fa*} To_see — {*Fo*} To_be
- {*Fe*} Active — {*Fu*} Inactive

* VOCABULARY

+ PRONOUNS

& A sentence is expected to be at the first person if a pronoun has not already been declared, pronouns are often ommited when possible. 
& The sentence "I give you a book" is translated to {*Lari'ar todoti fïr*}, following the {#you.to book to_give#} structure.

* VERBS

& Verbs are used at the end of a sentence and are generally built from the fy family.The sentence "I take the book home" is translated to {*Tokafo'ar todoti firo*}, following the {#house.to book to_take#} structure.

* TENSES

& Sentences are, by default, at the present tense, a tenses marker is used to contrast against an already defined tense. Tenses markers are used at the end of the sentence.The sentence "I did not go to school" is translated to {*Radoti'ar fori'dijör*}, following the {#school.to to_go.negative_past#} structure.
 
* PREPOSITIONS

& Lietal prepositions are aeths used as particles, placed after the word that they affect.The sentence "I will go to the city with you" is translated to {*Doradali'ar lari'is fori'dïr*}, following the {#city.to you.with to_go.future#} structure.

* COLORS

& Colors are built by combining lyra(speed) and lyfa(color).The sentence "Yellow is between red and green" is translated to {*Lyfalök el lyfalo es lyfäl ul'käs of*}, following the {#yellow [ red & green ].between to_be#} structure.

* NUMBERS

& Numbers are built by combining yl(counter) and ys(relation). When base10 is used, eleven is not used.The sentence "1, 2, 3 and 123" is translated to {*Al il lio es loe lira'il lio*}, following the {#1 2 3 & 100 10.2 3#} structure.

* GRAMMAR

+ QUESTION

& Question words are used at the beginning of a sentence.The sentence "Where am I? Who are you?" is translated to {*Jaky laro of es jäd lari of*}, following the {#where I to_be & who you to_be#} structure.

+ LOCATION

& Locations are the environment of the sentence, it preceeds a sentence.The sentence "I am at my house" is translated to {*Laro'tokafo'ak of*}, following the {#I.house.at to_be#} structure.

+ TIME

& Time is also part of the environment of the sentence, it preceeds a sentence.The sentence "I will see you in the morning" is translated to {*Rïd'ak lari af'dïr*}, following the {#morning.at you to_see.future#} structure.

+ COLLECTIONS

& Sequences of things, or topics, can be grouped together into collections and used as a single entity. The sentence "Between you and I" is translated to {*El lari es laro ul'käs*}, following the {#[ you & I ].between#} structure.

& Below is another example with a different sentence structure. The sentence "Is the house blue or red?" is translated to {*Tokafo el lyfalo us lyfaloki ul'of*}, following the {#house [ red | blue ].to_be#} structure.

& Numbers are also using collections The sentence "The address is two hundred twenty three" is translated to {*Tokafo'tady el loe'il lira'lio lia ul*}, following the {#house.name [ 100.2 10.3 4 ]#} structure.

+ SUMMARY

& Here is an example including all of the previous lessons.
& The sentence "Tomorrow, I might go to either the school, or to the library" is translated to {*Dilai el radoti us kadoti ul fori'dijari*}, following the {#tomorrow [ school | library ] to_go.potential_future#} structure.

`); invoke.vessel.seal("docs","lietal",payload);
