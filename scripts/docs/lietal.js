function Lietal_Dict()
{
  this.aebeth = {};
  this.aebeth = {
    "fo" : {en:"to_be",children:{
        "ri" : {en:"to_become",children:{"ko" : {en:"to_enter"} }},
        "ra" : {en:"to_be_there"},
        "ro" : {en:"to_come"},
        "re" : {en:"to_become"},
        "ru" : {en:"to_solidify"},
      }
    },
    "li" : {en:"multiple",children:{
      "ri" : {en:"you(plural)"},
      "ra" : {en:"they(plural)"},
      "ro" : {en:"we"},
    }},
    "la" : {en:"single",children:{
      "ri" : {en:"you(singular)"},
      "ra" : {en:"they(singular)"},
      "ro" : {en:"I"},
    }},
    "lo" : {en:"none",children:{
      "ri" : {en:"none_of_those(far)"},
      "ra" : {en:"none_of_those(nearby)"},
      "ro" : {en:"none_of_those(close)"},
    }},
    "lo" : {en:"none"},
  }
  this.aebeth["ri"] = {en:"outward",children:{}}
  this.aebeth["ra"] = {en:"between",children:{}}
  this.aebeth["ro"] = {en:"inward",children:{}}
  this.aebeth["re"] = {en:"mobile",children:{}}
  this.aebeth["ru"] = {en:"immobile",children:{}}
  this.aebeth["ko"] = {en:"children",children:{}}

  this.adultspeak = function(childspeak)
  {
    childspeak = childspeak.toLowerCase();

    if(childspeak.length == 2){
      var c = childspeak.substr(0,1);
      var v = childspeak.substr(1,1);
      return v+c;
    }
    if(childspeak.length == 4){
      var c1 = childspeak.substr(0,1);
      var v1 = childspeak.substr(1,1);
      var c2 = childspeak.substr(2,1);
      var v2 = childspeak.substr(3,1);
      if(c1 == c2){
        return c1+v1+v2;
      }
      if(v1 == v2){
        if(v1 == "a"){ return c1+"ä"+c2; }
        if(v1 == "e"){ return c1+"ë"+c2; }
        if(v1 == "i"){ return c1+"ï"+c2; }
        if(v1 == "o"){ return c1+"ö"+c2; }
        if(v1 == "u"){ return c1+"ü"+c2; }
        if(v1 == "y"){ return c1+"ÿ"+c2; }
      }
    }
    if(childspeak.length == 6){
      return this.adultspeak(childspeak.substr(0,2))+this.adultspeak(childspeak.substr(2,4));
    }
    if(childspeak.length == 8){
      return this.adultspeak(childspeak.substr(0,4))+this.adultspeak(childspeak.substr(4,4));
    }
    return childspeak
  }

  this.convert = function(childspeak)
  {
    childspeak = childspeak.toLowerCase();
    console.log(childspeak)

    if(childspeak.length == 2){ 
      return this.aebeth[childspeak] ? this.aebeth[childspeak].en : "("+childspeak+")";
    }
    if(childspeak.length == 4){ 
      if(!this.aebeth[childspeak.substr(0,2)] || !this.aebeth[childspeak.substr(0,2)].children[childspeak.substr(2,2)]){
        return "(!MISSING:"+childspeak+")"
      }
      return this.aebeth[childspeak.substr(0,2)].children[childspeak.substr(2,2)].en;
    }
    if(childspeak.length == 6){ 
      return this.aebeth[childspeak.substr(0,2)].children[childspeak.substr(2,2)].children[childspeak.substr(4,2)].en;
    }
    return childspeak
  }

  this.deconstruct = function(childspeak)
  {
    childspeak = childspeak.toLowerCase();

    if(childspeak.length == 2){ 
      var p1 = childspeak.substr(0,2);
      return `${this.adultspeak(childspeak)} <comment>&lt;${this.convert(p1)}&gt;</comment> {*${this.convert(childspeak)}*}`;
    }
    if(childspeak.length == 4){ 
      var p1 = childspeak.substr(0,2);
      var p2 = childspeak.substr(2,2);
      return `${this.adultspeak(childspeak)} <comment>&lt;${this.convert(p1)}(${this.convert(p2)})&gt;</comment> {*${this.convert(childspeak)}*}`;
    }
    if(childspeak.length == 6){ 
      var p1 = childspeak.substr(0,2);
      var p2 = childspeak.substr(2,2);
      var p3 = childspeak.substr(4,2);
      return `${this.adultspeak(childspeak)} <comment>&lt;${this.convert(p1+p2)}(${this.convert(p3)})&gt;</comment> {*${this.convert(childspeak)}*}`;
    }
    return "??"
  }
}

var lietal_dict = new Lietal_Dict();

var payload = new Runic(`
* PHONOLOGY
? VIRO KÄR'OF LIETÄL'TAKÏT.
& Lietal is written from left to right with implicit neutrality, singularity and under the present tense. For the most part, its 6 vowels and 9 consonants are voiced similarly to their english equivalents.
# A E I O U Y K T D R S L J V F <comment>The Lietal Alphabet</comment>
& The vowels are sounded as hex{*a*}gram, n{*e*}ver, l{*ea*}ves, {*au*}tomobile, n{*ew*}, journ{*ey*} — And consonants as {*k*}iss, ti{*t*}le, {*d*}evice, retu{*r*}n, {*s*}ymphony, {*l*}igature, {*ge*}nesis, {*v*}ideo, & {*f*}estival.

* MORPHOLOGY

& Building words from Lietal's phonemes is called childspeak. It makes for rythmical and syllabic words, but take quite a long time to actually speak it. This documentation uses the phonetically denser {_Adultspeak_}.
& Single syllable words are reversed, so {#vo#} becomes {#${lietal_dict.adultspeak("vo")}#}. Vowel sequences, like {#lara#}, are condensed into {#${lietal_dict.adultspeak("lara")}#}. Consonant sequences, like {#lyfasa#}, are condensed into {#${lietal_dict.adultspeak("lyfasa")}#}. Here are a few examples:

~ Yes 
- vi — ${lietal_dict.adultspeak("vi")}
~ Who 
- jada — ${lietal_dict.adultspeak("jada")}
~ Outside 
- kika — ${lietal_dict.adultspeak("kika")}
~ To Read
- fatati — ${lietal_dict.adultspeak("fatati")}
~ Whenever  
- salidi — ${lietal_dict.adultspeak("salidi")}

* ALPHABET

& The Alphabet is a collection of 9 elementary particles, each is made of a key(consonant) and one of the 6 values(vowels). Knowing this table should allow you guess the meaning of {*any word construction*}.

+ Table

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

+ Construction

& Words are not created, but found among the permutations of the 9 elementary particles. Here are a few examples of the resulting translations of {*fo*} declensions:

# ${lietal_dict.deconstruct("fo")}
# ${lietal_dict.deconstruct("fori")}
# ${lietal_dict.deconstruct("foriko")}

* VOCABULARY

+ Pronouns

& A sentence is expected to be at the first person if a pronoun has not already been declared, pronouns are often ommited when possible. 
# ${lietal_dict.deconstruct("lari")}
# ${lietal_dict.deconstruct("lara")}
# ${lietal_dict.deconstruct("laro")}
# ${lietal_dict.deconstruct("liri")}
# ${lietal_dict.deconstruct("lira")}
# ${lietal_dict.deconstruct("liro")}
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
