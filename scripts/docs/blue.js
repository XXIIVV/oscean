function Blue_Dictionary()
{
  this.collection = {};
  this.collection.shortwords = {}
  this.collection.examples = {}
  this.collection.vocabulary = {}

  this.collection.shortwords.motules = {};

  this.collection.shortwords.motules.interjection = {};
  this.collection.shortwords.motules.interjection['a'] = {en:"lack or discouragement"};
  this.collection.shortwords.motules.interjection['e'] = {en:"exhuberance or encouragement"};
  this.collection.shortwords.motules.interjection['i'] = {en:"paroxysm or joy"};
  this.collection.shortwords.motules.interjection['o'] = {en:"doubt or warning"};
  this.collection.shortwords.motules.interjection['u'] = {en:"equanimity or consent"};
  this.collection.shortwords.motules.interjection['aa'] = {en:"resignation, disgust"};
  this.collection.shortwords.motules.interjection['ee'] = {en:"condemnation"};
  this.collection.shortwords.motules.interjection['ii'] = {en:"pain, suffering"};
  this.collection.shortwords.motules.interjection['oo'] = {en:"appeal, request, threat"};
  this.collection.shortwords.motules.interjection['uu'] = {en:"repulsion, annoyance, fear"};

  this.collection.shortwords.designatives = {};

  this.collection.shortwords.designatives.relative = {};
  this.collection.shortwords.designatives.relative['ra']  = {en:"who, whom, which"};
  this.collection.shortwords.designatives.relative['re']  = {en:"who, whom, which",plural:true};
  this.collection.shortwords.designatives.relative['er']  = {en:"of it"};
  this.collection.shortwords.designatives.relative['ar']  = {en:"on or upon it"};
  this.collection.shortwords.designatives.relative['era'] = {en:"whose, of which"};
  this.collection.shortwords.designatives.relative['ara'] = {en:"to whom, to which"};
  this.collection.shortwords.designatives.relative['ere'] = {en:"whose, of which",plural:true};
  this.collection.shortwords.designatives.relative['are'] = {en:"to whom, to which",plural:true};

  this.collection.shortwords.designatives.interrogative = {};
  this.collection.shortwords.designatives.interrogative['ka']  = {en:"who, which"};
  this.collection.shortwords.designatives.interrogative['ke']  = {en:"who, which",plural:true};
  this.collection.shortwords.designatives.interrogative['eka'] = {en:"of whom?"};
  this.collection.shortwords.designatives.interrogative['aka'] = {en:"of whom?"};
  this.collection.shortwords.designatives.interrogative['eke'] = {en:"of whom?",plural:true};
  this.collection.shortwords.designatives.interrogative['ake'] = {en:"of whom?",plural:true};
  this.collection.shortwords.designatives.exclamative = {};
  this.collection.shortwords.designatives.exclamative['ak']    = {en:"response to: who, which"};
  this.collection.shortwords.designatives.exclamative['ek']    = {en:"response to: who, which",plural:true};

  this.collection.shortwords.designatives.indefinite = {};
  this.collection.shortwords.designatives.indefinite['kla'] = {en:"somebody"};
  this.collection.shortwords.designatives.indefinite['spa'] = {en:"everybody"};
  this.collection.shortwords.designatives.indefinite['kle'] = {en:"some or a few people"};
  this.collection.shortwords.designatives.indefinite['spe'] = {en:"several people",plural:true};
  this.collection.shortwords.designatives.indefinite['fna'] = {en:"the one or the other"};
  this.collection.shortwords.designatives.indefinite['fne'] = {en:"the ones or the others",plural:true};
  this.collection.shortwords.designatives.indefinite['ab'] = {en:"such"};
  this.collection.shortwords.designatives.indefinite['am'] = {en:"the same"};
  this.collection.shortwords.designatives.indefinite['ap'] = {en:"watever"};
  this.collection.shortwords.designatives.indefinite['as'] = {en:"certain"};
  this.collection.shortwords.designatives.indefinite['at'] = {en:"every"};
  this.collection.shortwords.designatives.indefinite['av'] = {en:"other, the other"};
  this.collection.shortwords.designatives.indefinite['abe'] = {en:"such",plural:true};
  this.collection.shortwords.designatives.indefinite['ame'] = {en:"the same",plural:true};
  this.collection.shortwords.designatives.indefinite['ape'] = {en:"watever",plural:true};
  this.collection.shortwords.designatives.indefinite['ase'] = {en:"certain",plural:true};
  this.collection.shortwords.designatives.indefinite['ate'] = {en:"every",plural:true};
  this.collection.shortwords.designatives.indefinite['ave'] = {en:"other, the other",plural:true};
  this.collection.shortwords.designatives.indefinite['fra'] = {en:"none of both"}
  this.collection.shortwords.designatives.indefinite['fte'] = {en:"all things"}
  this.collection.shortwords.designatives.indefinite['kna'] = {en:"nobody"}
  this.collection.shortwords.designatives.indefinite['kra'] = {en:"something"}
  this.collection.shortwords.designatives.indefinite['ksa'] = {en:"whoever, whichever"}
  this.collection.shortwords.designatives.indefinite['kva'] = {en:"whatever"}
  this.collection.shortwords.designatives.indefinite['pna'] = {en:"nothing"}
  this.collection.shortwords.designatives.indefinite['sta'] = {en:"one"}
  this.collection.shortwords.designatives.indefinite['tle'] = {en:"everybody"}
  this.collection.shortwords.designatives.indefinite['tna'] = {en:"nether the one or the other"}
  this.collection.shortwords.designatives.indefinite['tva'] = {en:"one of both"}
  this.collection.shortwords.designatives.indefinite['tve'] = {en:"both"}

  this.collection.shortwords.designatives.demonstrative = {};
  this.collection.shortwords.designatives.demonstrative['an'] = {en:"a, an"}
  this.collection.shortwords.designatives.demonstrative['ac'] = {en:"this, that"}
  this.collection.shortwords.designatives.demonstrative['ag'] = {en:"this, it, that(near)"}
  this.collection.shortwords.designatives.demonstrative['af'] = {en:"that, it(far)"}
  this.collection.shortwords.designatives.demonstrative['ane'] = {en:"some, any",plural:true}
  this.collection.shortwords.designatives.demonstrative['ace'] = {en:"these, those",plural:true}
  this.collection.shortwords.designatives.demonstrative['age'] = {en:"these, those",plural:true}
  this.collection.shortwords.designatives.demonstrative['afe'] = {en:"those",plural:true}

  this.collection.shortwords.personals = {}

  this.collection.shortwords.personals.nominative = {};
  this.collection.shortwords.personals.nominative['me'] = {en:"I"}
  this.collection.shortwords.personals.nominative['ve'] = {en:"You"}
  this.collection.shortwords.personals.nominative['le'] = {en:"He/She"}
  this.collection.shortwords.personals.nominative['ce'] = {en:"It",neuter:true}
  this.collection.shortwords.personals.nominative['fe'] = {en:"They"}
  this.collection.shortwords.personals.nominative['ne'] = {en:"We"}
  this.collection.shortwords.personals.nominative['de'] = {en:"They",neuter:true}

  this.collection.shortwords.personals.accusative = {};
  this.collection.shortwords.personals.accusative['ma'] = {en:"Me"}
  this.collection.shortwords.personals.accusative['va'] = {en:"You"}
  this.collection.shortwords.personals.accusative['la'] = {en:"Him/Her"}
  this.collection.shortwords.personals.accusative['ca'] = {en:"It",neuter:true}
  this.collection.shortwords.personals.accusative['fa'] = {en:"Them"}
  this.collection.shortwords.personals.accusative['na'] = {en:"Us"}
  this.collection.shortwords.personals.accusative['da'] = {en:"Them",neuter:true}

  this.collection.shortwords.personals.dative = {};
  this.collection.shortwords.personals.dative['ama'] = {en:"To me"}
  this.collection.shortwords.personals.dative['ava'] = {en:"To you"}
  this.collection.shortwords.personals.dative['ala'] = {en:"Him/Her"}
  this.collection.shortwords.personals.dative['aca'] = {en:"To it",neuter:true}
  this.collection.shortwords.personals.dative['afa'] = {en:"To them"}
  this.collection.shortwords.personals.dative['ana'] = {en:"To us"}
  this.collection.shortwords.personals.dative['ada'] = {en:"To them",neuter:true}

  this.collection.shortwords.personals.emphatic = {};
  this.collection.shortwords.personals.emphatic['eme'] = {en:"Myself"}
  this.collection.shortwords.personals.emphatic['eve'] = {en:"Yourself"}
  this.collection.shortwords.personals.emphatic['ele'] = {en:"Himself/Herself"}
  this.collection.shortwords.personals.emphatic['ece'] = {en:"Itself",neuter:true}
  this.collection.shortwords.personals.emphatic['efe'] = {en:"Themselves"}
  this.collection.shortwords.personals.emphatic['ene'] = {en:"Ourselves"}
  this.collection.shortwords.personals.emphatic['ede'] = {en:"Themselves",neuter:true}

  this.collection.shortwords.personals.possessive = {};
  this.collection.shortwords.personals.possessive['mea'] = {en:"Mine"}
  this.collection.shortwords.personals.possessive['vea'] = {en:"Yours"}
  this.collection.shortwords.personals.possessive['lea'] = {en:"His/Hers"}
  this.collection.shortwords.personals.possessive['cea'] = {en:"It's",neuter:true}
  this.collection.shortwords.personals.possessive['fea'] = {en:"Theirs"}
  this.collection.shortwords.personals.possessive['nea'] = {en:"Ours"}
  this.collection.shortwords.personals.possessive['dea'] = {en:"Theirs",neuter:true}
  this.collection.shortwords.personals.possessive['mae'] = {en:"Mine",plural:true}
  this.collection.shortwords.personals.possessive['vae'] = {en:"Yours",plural:true}
  this.collection.shortwords.personals.possessive['lae'] = {en:"His/Hers",plural:true}
  this.collection.shortwords.personals.possessive['cae'] = {en:"It's",neuter:true,plural:true}
  this.collection.shortwords.personals.possessive['fae'] = {en:"Theirs",plural:true}
  this.collection.shortwords.personals.possessive['nae'] = {en:"Ours",plural:true}
  this.collection.shortwords.personals.possessive['dae'] = {en:"Theirs",neuter:true,plural:true}

  this.collection.shortwords.staffwords = {}

  this.collection.shortwords.staffwords.connectives = {}
  this.collection.shortwords.staffwords.connectives['bi'] = {en:"during"};
  this.collection.shortwords.staffwords.connectives['bo'] = {en:"but"};
  this.collection.shortwords.staffwords.connectives['ci'] = {en:"because"};
  this.collection.shortwords.staffwords.connectives['co'] = {en:"here is, here are"}; 
  this.collection.shortwords.staffwords.connectives['di'] = {en:"of"};
  this.collection.shortwords.staffwords.connectives['do'] = {en:"since"};
  this.collection.shortwords.staffwords.connectives['fi'] = {en:"thought"};
  this.collection.shortwords.staffwords.connectives['fo'] = {en:"when"};
  this.collection.shortwords.staffwords.connectives['fro'] = {en:"whereas"};
  this.collection.shortwords.staffwords.connectives['gi'] = {en:"there is, there are"}; 
  this.collection.shortwords.staffwords.connectives['go'] = {en:"then"};
  this.collection.shortwords.staffwords.connectives['ib'] = {en:"upon"};
  this.collection.shortwords.staffwords.connectives['id'] = {en:"to(direction)"};
  this.collection.shortwords.staffwords.connectives['if'] = {en:"if wether"};
  this.collection.shortwords.staffwords.connectives['ig'] = {en:"in spite of"}; 
  this.collection.shortwords.staffwords.connectives['ik'] = {en:"before"};
  this.collection.shortwords.staffwords.connectives['in'] = {en:"in"};
  this.collection.shortwords.staffwords.connectives['im'] = {en:"within"};
  this.collection.shortwords.staffwords.connectives['ir'] = {en:"as to"};
  this.collection.shortwords.staffwords.connectives['it'] = {en:"and"};
  this.collection.shortwords.staffwords.connectives['ki'] = {en:"with"};
  this.collection.shortwords.staffwords.connectives['klo'] = {en:"that is to say"}; 
  this.collection.shortwords.staffwords.connectives['ko'] = {en:"that"};
  this.collection.shortwords.staffwords.connectives['kvo'] = {en:"for the sake of.."}; 
  this.collection.shortwords.staffwords.connectives['li'] = {en:"until"};
  this.collection.shortwords.staffwords.connectives['lo'] = {en:"towards"};
  this.collection.shortwords.staffwords.connectives['mi'] = {en:"at one's house"}; 
  this.collection.shortwords.staffwords.connectives['mo'] = {en:"between"};
  this.collection.shortwords.staffwords.connectives['ni'] = {en:"neither, nor"};
  this.collection.shortwords.staffwords.connectives['oc'] = {en:"below, under"};
  this.collection.shortwords.staffwords.connectives['of'] = {en:"of(possesion)"};
  this.collection.shortwords.staffwords.connectives['ob'] = {en:"for(because)"};
  this.collection.shortwords.staffwords.connectives['og'] = {en:"behind"};
  this.collection.shortwords.staffwords.connectives['ok'] = {en:"nevertheless"};
  this.collection.shortwords.staffwords.connectives['om'] = {en:"from"};
  this.collection.shortwords.staffwords.connectives['on'] = {en:"from, since"};
  this.collection.shortwords.staffwords.connectives['or'] = {en:"or"};
  this.collection.shortwords.staffwords.connectives['os'] = {en:"after"};
  this.collection.shortwords.staffwords.connectives['ot'] = {en:"out"};
  this.collection.shortwords.staffwords.connectives['ov'] = {en:"wether.. or.."};
  this.collection.shortwords.staffwords.connectives['pi'] = {en:"by through"};
  this.collection.shortwords.staffwords.connectives['plo'] = {en:"to, in order to."};
  this.collection.shortwords.staffwords.connectives['po'] = {en:"since, as"};
  this.collection.shortwords.staffwords.connectives['pro'] = {en:"for"};
  this.collection.shortwords.staffwords.connectives['ri'] = {en:"according to"};
  this.collection.shortwords.staffwords.connectives['ro'] = {en:"instead of"};
  this.collection.shortwords.staffwords.connectives['slo'] = {en:"thus, so."};
  this.collection.shortwords.staffwords.connectives['so'] = {en:"aslike"};
  this.collection.shortwords.staffwords.connectives['spi'] = {en:"onthe side of"}; 
  this.collection.shortwords.staffwords.connectives['sri'] = {en:"onaccount of"}; 
  this.collection.shortwords.staffwords.connectives['sti'] = {en:"atthe time of"}; 
  this.collection.shortwords.staffwords.connectives['sto'] = {en:"then, after"};
  this.collection.shortwords.staffwords.connectives['ti'] = {en:"further, besides."};
  this.collection.shortwords.staffwords.connectives['to'] = {en:"to, towards"};
  this.collection.shortwords.staffwords.connectives['tso'] = {en:"from."};
  this.collection.shortwords.staffwords.connectives['vi'] = {en:"save, expecting."};
  this.collection.shortwords.staffwords.connectives['vo'] = {en:"without."};

  this.collection.shortwords.designators = {}
  this.collection.shortwords.designators.relatives = {}
  this.collection.shortwords.designators.relatives['vo'] = {en:"without."};
  this.collection.shortwords.designators.relatives['ra'] = {en:"who, whom, which"};
  this.collection.shortwords.designators.relatives['re'] = {en:"who, whom, which(plural)"};
  this.collection.shortwords.designators.relatives['er'] = {en:"of it"};
  this.collection.shortwords.designators.relatives['ar'] = {en:"on, or upon it"};
  this.collection.shortwords.designators.relatives['era'] = {en:"whose, of which"};
  this.collection.shortwords.designators.relatives['ara'] = {en:"to whom, to which"};
  this.collection.shortwords.designators.relatives['ere'] = {en:"whose, of which(plural)"};
  this.collection.shortwords.designators.relatives['are'] = {en:"to whom, to which(plural)"};
  
  this.collection.examples['Et givo sna pan'] = {en:"Do not give any bread at all"}
  this.collection.examples['Et givo fla pan'] = {en:"Give little bread"}
  this.collection.examples['Et givo tsa pan'] = {en:"Give a little bread"}
  this.collection.examples['Et givo ple pan'] = {en:"Give a little more bread"}
  this.collection.examples['Et givo pre pan'] = {en:"Give some more bread"}
  this.collection.examples['Et givo tre pan'] = {en:"Give much bread"}
  this.collection.examples['Et givo sre pan'] = {en:"Give bread(in profusion)"}

  this.collection.examples['Et givo al pobr'] = {en:"Give to the poor man"}
  this.collection.examples['Et givo ale pobru'] = {en:"Give to the poor", plural:true}
  this.collection.examples['Et givo pan srisu'] = {en:"Give some bread and some cherries"}

  this.collection.vocabulary['bolm'] = "the tree";

  this.table = function(type,cat,sub)
  {
    var html = "";

    for(id in this.collection[type][cat][sub]){
      var word = this.collection[type][cat][sub][id];
      html += "<ln><b>"+id+"</b> — "+word.en+"</ln>";
    }
    return "<list class='tidy'>"+html+"</list>";
  }
}

var blue_dict = new Blue_Dictionary();

var payload = new Runic(`
& This guide is an adaptation of Ed. Robertson's 1998 guide to Léon Bollack's {{Bolak Language|https://en.wikipedia.org/wiki/Bolak_language}}, based on the standard work {*La Langue Bleue*}, Paris 1899 — Bolak means both 'blue language' and 'ingenious creation' in the language itself.

? Ac ra poni an fren al tsorm ade vevu, se savi soc stopi plotu ade <span title='celui qui met un frein à la fureur des flots sait aussi des méchants arrêter les complots' href='https://fr.wikipedia.org/wiki/Athalie_(Racine)'>vikoru</a>.

* Alphabet

& Each of these letters represents {*only one sound*}. Each sound is represented by {*only one letter*}.
& Bolak uses only {*19 letters*}. The 5 vowels are used as prefixes on nouns, verbs, adjectives, and adverbs, to modify their meaning by adding the emotion involved in the corresponding interjection. C is sounded as Ch.

# A, B, C, D, E, F, G, I, K, L, M, N, O, P, R, S, T, U, V.

* Rule of the Margaret

&  If we take the Bolak root {#lov#}(to love), the affixes can be used to form other words as follows: 

~ {#alov#}
- indifference — {*lack of love*}
~ {#elov#}
- passion — {*exhuberant love*}
~ {#ilov#}
- worship/idolatry — {*paroxysmal love*}
~ {#olov#}
- inclination — {*doubting love*}

& The 'Rule of the Margaret' is so called because of the custom in French of pulling the leaves off a daisy to determine the degree to which one is loved by one's partner,  similar to the {_loves me/loves me not_} custom in English.

* Motules

& The small words, or {_motules_}, of Bolak are composed of a {*maximum of 3 letters*}. If composed of 3 letters, they must not end in a consonant. They perform 4 functions in the language: {*Interjections*}, {*Staffwords*}, {*Connectors*} and {*Designators*}. 

+ Interjections

& Interjections are composed of one vowel, or the same vowel doubled, the doubled forms express the opposite of their single equivalents:

> `+blue_dict.table("shortwords","motules","interjection")+`

+ Staffwords

& The Staffwords are so called because they wrap around the word which follows. They are either built from {*two different vowels*}, or {*one or two consonants followed by a -u*}.
& {*Form I*}: There are 45 permitted combinations of the other form of staffwords words (cu or ccu). Of these the most useful are:

~ nu
- negative — {*me nu lovi*} I do not love
~ du
- interrogative — {*me du lovi?*} Do I love?
~ tnu
- int. neg. — {*me tnu lovi?*} Do I not love?
~ ku
- subordinate {*X ku me lovi*} X that I love          
~ knu
- sub. neg. {*X knu me lovi*} X that I do not love
~ su
- reflexive {*me su lovi*} I love myself        
~ snu
- refl. neg. {*me snu lovi*} I do not love myself

& The others are indispensible words which can be used free-standing or as prefixes in word-formation.

~ ru
- again, re-
~ pu
- arch-, chief-
~ cu
- vice-, sub-
~ fku
- anti-, contra-
~ pru
- ante-, pre-, ex-
~ plu
- poly-
~ smu
- semi-, hemi-
~ sku
- ish
~ kvu
- eu-
~ mu
- mal-, caco-

& {*Form II*}: Let us take the sentence 'give me bread', and its Bolak translation {#et givo pan#}, in the context of a speaker of French conversing with a speaker of English, using Bolak. Suppose the French speaker forgets that the Bolak for bread is pan. In this unlikely example, he or she could say:

~ Et givo au 'bread'       
- used to mark a proper name 'Pain'
~ Et givo eu 'bread'  
- used to mark a technical term
~ Et givo iu 'bread'
- give me what you call 'bread'
~ Et givo ou 'pain'
- give me what I call 'pain'

& This leaves 12 other possible combinations of two different vowels. Four are used as general purpose substitution words, a bit like 'je' in Esperanto.

~ io          
- can be used to substitute for any preposition
~ oi          
- can be used to substitute for any conjunction.
~ ea     
- can be used to replace any article, adjective or pronoun in the singular
~ ae          
- Like {#ae#} but in the plural.

& {*Form III*}: The other 8 are used as optional markers of verbal aspect or mood.

~ oa          
- to start to, to be about to
~ eo          
- to finish, to have just
~ ia          
- to intend to
~ oe          
- to have to, to be obliged to
~ ai          
- to wish to, to be inclined to
~ ei          
- to be able to, to be possible to
~ ie          
- to do frequently or regularly
~ ao          
- to do rarely or intermittently

+ Modality

~ Me ia venka
- I will come
~ me oe venka
- I ought to me
~ me oi venka
- I wish to come
~ me ei venka
- I may come

? Me du snu oa ru lovo?

& At this point Bolak gives the example: {_Do I not begin to love myself again?_} as an illustration of how to combine these motules.

+ Connectives

& The connectors includes things such as {*prepositions and conjunctions*}. The form of this group of words comprises two or three letters including one consonant and one or both of the vowels I and O. 

> `+blue_dict.table("shortwords","staffwords","connectives")+`

& The basic prepositions can be modified to express motion towards or from by the addition of -i or -o respectively: 

~ ogo
- From behind
~ ini
- Into
~ spi
- Toward

+ Designators

> `+blue_dict.table("shortwords","designators","relatives")+`

& Designators are motules of two or three letters which have a form like that of the 'connectors', but are composed of a consonant and one or both of A or E, instead of I or O. 
& There are six kinds of designators: relative, interrogative/exclamatory, personal, possessive and personal. In some of  these groups the final vowel, if any, indicates whether the word is singular or plural.

? singular/plural
~ ra/re
- who (relative)
~ ka/ke
- who? (interrogative)
~ ak/ek
- who! (exclamatory)
~ ag/age
- this, these
~ af/afe
- that, those
~ an/ane
- one, several
~ at/ate
- each, every, all
~ ad/ade
- of the
~ al/ale
- to the

& The personal designators, however, do not change according to whether singular or plural, and there are different consonants at the beginning for all of the personal pronouns:

~ me I, te you (familiar singular), 
- ve (respectful sing.), se he, le she, ce it
~ ne we, pe you (fam. plural), 
- ge you (resp. plur.), be they (masc.), fe they (fem.), de they (neuter).

& Personal designators have a number of cases in Bolak:

~ Nominative
- me — I
~ Accusative
- ma — me
~ Dative
- ama — to me
~ Ablative
- ema — from me
~ Vocative
- em — me!
~ Emphatic
- eme — myself

& Some of these cases are also used with relative and interrogative designators.

& The possessive designators are derived from the personal pronouns, with the ending   -ea neing used for the singular and -ae for the plural, e.g. mea/mae my (sing./plur.)

& The indefinite designators are about 50 in number. Some are formed from A followed by a consonant with the plural formed by adding -E, as in the demonstratives above:

~ ab/abe
- such a/such
~ am/ame
- the same
~ ap/ape
- any
~ as/ase
- a certain/certain
~ av/ave
- the other(s)

& The majority are formed from two consonants ending in -A in the singular and -E in the plural. Some of these a singular and no plural, and others a plural and no singular:

~ spa
- each               
~ fke
- several
~ tsa
- a little of          
~ fle
- few
~ mra
- not a                
~ tle
- every/everybody

& The last of these appears in the Bolak slogan: Dovem pro tle (Second (language) for everybody).

& Some others are:

~ kla/kle
- somebody/some people
~ ksa/kse
- whichever
~ sfa/sfe
- someone else/other people
~ psa/pse
- one another
~ fna/fne
- one or the other(s)
~ tna/tne
- neither one nor the other(s)
~ kva/kve
- whatever/whatever things

? Et nu maki sfa, ska te nu vili ku sta maki ad ete.
& One example of the use of the indefinites that is given is: {_Do not do to another what you would not want someone to do to you_}.

* Numbers


& Numbers are a special kind of noun. The numbers 1 to 10 are:
# Ven, dov, ter, far, kel, gab, cep, lok, nif, dis.

& 11 to 19 are: diven, didov, diter, difar etc.

# 20: dovis               50: kelis                1000: mel
# 21: dovis ven               100: son               2015: dovmel dikel
# 30: teris               101: son ven               10000: dismel
# 31: teris ven               125: son dovis kel          100000: sonmel
# 40: faris               200: dovson               1000000: mlon

& Numerals are placed before the noun they relate to. Endings can then be added on to each of these cardinal numbers: 

~ -am (collective)
- venam — unity
- dovam — duality, duo
- teram — trinity, trio

~ -em (ordinal)
- venem — first
- dovem — second
- terem — third

~ -ip (multiplication)
- venip — single
- dovip — double
- terip — triple

~ -om (division)
- venom — whole
- dovom — half
- terom — third

~ -erl (no. of kinds)
- venerl — one kind of
- doverl — two kinds of
- tererl — three kinds of

~ -olt (no. of times)
- venolt — once
- dovolt — twice
- terolt — thrice

* Granmots

& The large words of Bolak convey the bulk of the semantic content. The form of these words is 3 letters or greater. If composed of only 3 letters, the last of these must be a consonant, each class of words having its own look in Bolak. Noun roots must end in some consonant other than c and d.
& There are 4 types of granmots: a) nouns (including numbers), b) verbs, c) attributives (adjectives) and d) modifiers (adverbs). Normally, for all of these, the root word is the noun, except for certain basic adverbs ending in c. Noun roots can be transformed into other parts of speech by the addition of various endings.

* Nouns

& Nouns in Bolak must in their root forms begin and end with one or two consonants and end with one or two consonants. They cannot end in c or d. Normally these roots are one syllable in length. There are also a number of nouns which have more than one syllable, but these must not contain any affixes which are used in word formation. Bollack regarded the number of affixes used in agglutinative conlangs as confusing. For this reason the two syllable word sigar (cigar) is allowed because there is no suffix -ar in Bolak.

& However a two syllable root ending in a suffix that was used, e.g. -or or -ort would not be permitted. The ending -or is used to indicate the agent associated with the root, e.g.:

~ spil
- game
~ spilor
- player

& The ending -ort is used to indicate the place associated with the root:

~ pan
- bread
~ panort
- bakery

& The suffix -u is used to form the plural of nouns while the prefix u- is used to form the feminine. Nouns in Bolak are not assumed to be masculine, and there also a masculine prefix stu-. Thus:

~ kval
- horse
~ ukval
- mare
~ stukval
- stallion

& Nouns referring to familial or social relationships have separate words for the male and female equivalents:

~ per
- father          
~ mer
- mother
~ lonk
- uncle
~ tant
- aunt
~ fem
- woman
~ man
- man

& In the event of the learner not remembering the Bolak word for the the feminine of the pair, the possibility of using the feminine prefix together with the male word is explicitly permitted. What the learner is supposed to do in the event of forgetting the male word is not stated.

& The suffix -in can be used to refer to a female who acquires a title by virtue of marriage, e.g.:

~ reks
- king
~ reksin
- queen (consort)

& As opposed to:

~ kvin
- queen (in her own right)

& There is no masculine equivalent for this.

& Nouns can be combined with various framework words mentioned earlier, e.g.:

~ bisp               
- bishop
~ bu bisp          
- archbishop
~ gon               
- angle
~ plu gon          
- polygon
~ lov               
- love
~ fku lov               
- hate

& The operation of the Daisy Rule prefixing nouns with a-, e-, i-, or o- has already been mentioned.

& The augmentative and diminutive suffixes are -as and -et respectively.

& The affix -an can be used to indicate the inhabitant of a place.

& Compound nouns can be formed by joining two noun roots with a -u- between them. The headword comes last as in English, Chinese, Hungarian, German etc., e.g.:

~ kafumilv
- coffee mill               (kaf: coffee, milv: mill)
~ dormukar
- sleeping car               (dorm: sleep, kar: car)
~ noksuknis
- night shirt               (noks: night, knis: shirt)
~ sopuspon
- soup spoon               (sop: soup, spon: spoon)

& Proper nouns can be used to qualify a headword as a separate word and not joined by a preposition:

~ Bolak ditort
- Bolak publishing house

& The subject noun always goes before the verb. A vocative noun always goes at the beginning of a sentence, as a separate clause, then followed by a vocative pronoun. 
& Object nouns follow the verb. Any indirect object complement follows the direct object, and if there is more than one indirect object, these follow in decreasing order of interest.

* Verbs

& Verbs are formed from the noun in Bolak by adding the appropriate tense affixes. There are four simple tenses:

~ Eternal
- lovi — to love
~ Present
- lovo — to be loving
~ Past
- love — to have loved
~ Future
- lova — to be going to love

& Verbs can of course be formed from roots where the Daisy Rule has operated, e.g. ilovi, to worship.

& Verbs are preceded by their subject noun or pronoun and are invariable for person and number.

& The simple tenses can be modified by prefixing u- before the verb to provide their perfect or anterior equivalents:

~ me lova
- I shall love
~ me ulova
- I shall have loved

& The grammar does not state whether this u- is to be added before or after the operation of the Daisy Rule.

& The passive voice is created by inserting a -u- between the root and the tense ending:

~ me lovua
- I shall be loved
~ me ulovua
- I shall have been loved

& What Bollack calls the reflexive voice is formed by inserting the reflexive particle:

~ me su lovi
- I love myself

& What is called the subordinate mood is simply formed by using ku or knu for positive and negative subordination respectively, e.g.:

~ Re nanko knu me spiko
- it is necessary that I should not speak

& The imperative is formed by putting the pronoun into the vocative:

~ te komo
- you come
~ et komo
- come!
~ em komo
- let me come! etc.

& Because verbs can be freely formed from nouns the question may sometimes arise of what the meaning is of the verb thus formed. The following three possibilities of meaning can be tried in the following order of precedence:

# In the state of, or having the root noun.
# Accomplishing the root noun.
# To make use of the root noun.

& Examples of each of these are:

# 1.     bel          beauty               beli          to be beautiful
# 2.     bark          embarkation          barki          to embark
# 3.      bint          string               binti          to tie up

* Attributives and modifiers

& Attributives are formed from noun roots by adding a vowel and -d. This vowel varies according to ideas of tense, so the word may also be regarded as the verb plus a participial ending, e.g.:

~ lovid
- loving (in general)
~ lovod
- loving (at the moment)
~ loved
- having loved
~ lovad
- going to love

& Attributes used predicatively can be translated by verbal expressions:

~ me lalgo
- I am ill

& There is no need to say {#me sero lalgod#}.

& Attributives follow the noun they qualify. Degrees of comparison are provided by the Daisy Rule:

~ ipraved (of)
- the bravest (of)
~ epraved (ku)
- braver (than)
~ upraved (ku)
- as brave (as)
~ opraved (ku)
- less brave (than)
~ apraved (of)
- the least brave (of)

& The words plic (more) and lec (less) can also be used.

& Modifiers always end in -R, and are the adverbial equivalent of the attributives:

~ lovic
- lovingly (in general) etc.

& There are also a number of basic modifiers, e.g. moc (very), pac (not very) and many more.

& If modifiers are used with a verb, they are placed after the verb, but if they are modifying an attributive or another modifier, they are placed before the word they modify.

~ Examples
- Se venko om sit (il arrive de la ville).
- Spa lanta oe sarfi sea lant (tout citoyen doit servir son pays).
- Me upreko mea leg (je me suis cassé la jambe).
- Ay per lovo moc sea fant lalged (ce père aime beaucoup son enfant malade).
- Me givo ac vads asa (je lui donne cette montre).
- Ak vop sfermed pro spes maned, if om pobl to pobl, ne ei mnoka pfo an am lane. (What an immense advantage for mankind, if from people to people we could communicate through the same language.)

~ The Lord's Prayer
- Nea per ev seri in sil!(Our Father who art in heaven)
- Vea nom ec santigui! Vea regu ec komi!(Hallowed be thy name. Thy kingdom come.)
- Vea vil ec makui in sil, so ib gev!(Thy will be done, on earth as it is in heaven.)
- Ev givi nea pan taged ana!(Give us this day our daily bread)
- Ev solvi nae fansu so ne solvo ace re ufanso na!
- Ec seri sic!

~ Te oe spiko
- Thou must speak
~ Te du vorko
- Does thou work?
~ venko ki me
- Come with me
~ Et reno og me
- Run after me
~ Et reno og
- Run after
~ stiro in dom
- to be in the house
~ stiro in
- to be inside, within
~ me vilo er
- I wish some of it
~ me konto ar
- I count upon it

~ si
- yes
~ no
- no



& {_The fondest wish of the author is that his method may be chosen in order to realize the dream of humanity anxious for concord; and therefore has given to this work the name of the very colour of the firmament._} — Leon Bollack


`); invoke.vessel.seal("docs","blue",payload);
