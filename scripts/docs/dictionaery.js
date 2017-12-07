~ NAME : Dictionaery
~ NOTE : *
~ AUTH : Devine Lu Linvega

~ Expressions

HELLO
  TYPE : Expression
  MAIN : positive(inward)

WELCOME
  TYPE : Expression
  MAIN : positive(inward)

BYE
  TYPE : Expression
  MAIN : positive(outward)

YES
  TYPE : Expression
  MAIN : positive()

NO
  TYPE : Expression
  MAIN : negative()

PLEASE
  TYPE : Expression
  MAIN : possible(positive)

~ Question Words

WHEN
  TYPE : Question Word
  MAIN : possible(complex)

WHO
  TYPE : Question Word
  MAIN : possible(organic)

WHAT
  TYPE : Question Word
  MAIN : possible(synthetic)

HOW
  TYPE : Question Word
  MAIN : possible(interaction)

WHICH
  TYPE : Question Word
  MAIN : possible(counter)
  
WHERE
  TYPE : Question Word
  MAIN : possible(hierarchy)

~ Pronouns

I
  TYPE : Pronoun
  MAIN : single(inward)

HE_SHE
  TYPE : Pronoun
  MAIN : single(position)

YOU
  TYPE : Pronoun
  MAIN : single(outward)

WE
  TYPE : Pronoun
  MAIN : multiple(inward)

THEY
  TYPE : Pronoun
  MAIN : multiple(position)

YOUS
  TYPE : Pronoun
  MAIN : multiple(outward)

MY
  TYPE : Pronoun
  MAIN : children(single,inward)

HIS_HER
  TYPE : Pronoun
  MAIN : children(single,position)

YOUR
  TYPE : Pronoun
  MAIN : children(single,outward)

OUR
  TYPE : Pronoun
  MAIN : children(multiple,inward)

THEIR
  TYPE : Pronoun
  MAIN : children(multiple,position)

YOUSR
  TYPE : Pronoun
  MAIN : children(multiple,outward)
  
~ Tenses

PAST
  TYPE : Time Marker
  MAIN : complex(inward)

PRESENT
  TYPE : Time Marker
  MAIN : complex(position)

FUTURE
  TYPE : Time Marker
  MAIN : complex(outward)

NEGATIVE
  TYPE : Time Marker
  MAIN : complex(impossible)

POTENTIAL
  TYPE : Time Marker
  MAIN : complex(possible)

IMPERATIVE
  TYPE : Time Marker
  MAIN : complex(certain)

NEGATIVE_PAST
  TYPE : Time Marker
  MAIN : complex(impossible,inward)

NEGATIVE_PRESENT
  TYPE : Time Marker
  MAIN : complex(impossible,position)

NEGATIVE_FUTURE
  TYPE : Time Marker
  MAIN : complex(impossible,outward)

POTENTIAL_PAST
  TYPE : Time Marker
  MAIN : complex(possible,inward)

POTENTIAL_FUTURE
  TYPE : Time Marker
  MAIN : complex(possible,outward)

POTENTIAL_PRESENT
  TYPE : Time Marker
  MAIN : complex(possible,position)

IMPERATIVE_PAST
  TYPE : Time Marker
  MAIN : complex(certain,inward)

IMPERATIVE_PRESENT
  TYPE : Time Marker
  MAIN : complex(certain,position)

IMPERATIVE_FUTURE
  TYPE : Time Marker
  MAIN : complex(certain,outward)

IMPERATIVE_NEGATIVE
  TYPE : Time Marker
  MAIN : complex(certain,impossible)

~ Vocabulary

ALPHABET 
  MAIN : order(synthetic,physic)

VOCABULARY
  MAIN : order(synthetic,phisionomic)

GRAMMAR
  MAIN : order(synthetic,psychologic)

KISS
  MAIN : organic(positive,phisionomic)

BASKET
  MAIN : synthetic(united,children)

MORNING
  MAIN : outward(complex)

MOMENT
  MAIN : synthetic(complex)

NIGHT
  MAIN : inward(complex)

PATH
  MAIN : united(location)

CLOAK
  MAIN : synthetic(parent,phisionomic)

WOODS
  MAIN : location(organic,synthetic)

IDEA
  MAIN : children(psychologic)

TIME
  MAIN : outward(complex)

LIFE
  MAIN : outward(organic)

AUTOMATION
  MAIN : outward(synthetic)

HAND
  MAIN : organic(to_make)

EYE
  MAIN : organic(to_see)

HEART
  MAIN : organic(to_be)

EVENT
  MAIN : children(complex)

ORGAN
  MAIN : children(organic)

PART
  MAIN : children(synthetic)

NAME
  MAIN : phisionomic(structure)

TOMORROW
  MAIN : complex(single,multiple)

TODAY
  MAIN : complex(single)

YESTERDAY
  MAIN : complex(single,none)

HOUSE
  MAIN : physic(location,to_be)

BOOK
  MAIN : physic(synthetic,psychologic)

LIBRARY
  MAIN : location(synthetic,psychologic)

DOCUMENTATION
  MAIN : phisionomic(parent,psychologic)

PARENT
  MAIN : organic(parent)

MOTHER
  MAIN : organic(inward,parent)

FATHER
  MAIN : organic(outward,parent)

GRANDPARENT
  MAIN : organic(parent,parent)

GRANDMOTHER
  MAIN : organic(inward,parent,parent)

GRANDFATHER
  MAIN : organic(outward,parent,parent)

WOMAN
  MAIN : organic(inward)

MAN
  MAIN : organic(outward)

SPEED
  MAIN : counter(position)

STRANGER
  MAIN : organic(unrelated)

CITY
  MAIN : synthetic(position,organic,multiple)

PERSON
  MAIN : organic(single)

BEINGS
  MAIN : organic(multiple)

SCHOOL
  MAIN : position(synthetic,psychologic)

DESK
  MAIN : physic(order,synthetic)

MESSAGE
  MAIN : synthetic(order,state)

SCRIBBLE
  MAIN : synthetic(chaos,state)

LESSON
  MAIN : synthetic(order,psychologic)

PLACE
  MAIN : synthetic(location)

ROOM
  MAIN : synthetic(parent)

WALL
  MAIN : impossible(interaction)

PENCIL
  MAIN : physic(to_make,phisionomic,state)

PAPER
  MAIN : physic(to_see,phisionomic,state)

VISITOR
  MAIN : organic(disconnect)

STYLE
  MAIN : phisionomic(synthetic)

HANDWRITTING
  MAIN : phisionomic(synthetic)

VERSION
  MAIN : single(structure)

~ Verbs

TO_GO
  MAIN : to_be(outward)

TO_STAY
  MAIN : to_be(position)

TO_COME
  MAIN : to_be(inward)

TO_ADD 
  MAIN : to_make(with)

TO_REMOVE
  MAIN : to_make(none)

TO_SUBSTRACT
  MAIN : to_make(without)

TO_COMBINE
  MAIN : to_make(with)

TO_ASSEMBLE
  MAIN : to_make(with)

TO_DIVIDE
  MAIN : to_make(multiple)

TO_TAKE
  MAIN : to_make(inward)

TO_HOLD
  MAIN : to_make(position)

TO_GIVE
  MAIN : to_make(outward)

TO_PROGRAM
  MAIN : to_make(synthetic,phisionomic)

TO_LISTEN
  MAIN : to_see(inward)

TO_SEE
  MAIN : to_see(position)

TO_SHOW
  MAIN : to_see(outward)

TO_BECOME
  MAIN : to_be(outward)

TO_WRITE
  MAIN : to_make(psychologic)

TO_DRAW
  MAIN : to_make(phisionomic)

TO_BUILD
  MAIN : to_make(physic)

TO_UNDERSTAND
  MAIN : to_see(psychologic)

TO_SAY
  MAIN : to_see(outward)

TO_SPEAK
  MAIN : to_see(outward)

TO_WARN
  MAIN : to_see(outward,possible,negative)

TO_DESTROY
  MAIN : to_make(none)

TO_SEE
  MAIN : to_see()

TO_BE
  MAIN : to_be()

TO_READ
  MAIN : to_see(phisionomic,psychologic)

TO_REMEMBER
  MAIN : to_see(complex,inward)

TO_WEAR
  MAIN : to_be(phisionomic,children)

TO_WALK
  MAIN : to_be(outward,none,position)

TO_ASK
  MAIN : to_see(inward,possible)

TO_NAME
  MAIN : to_see(phisionomic,structure)

TO_TALK
  MAIN : to_see(mobile,psychologic)

TO_INSERT
  MAIN : to_make(children)

TO_FIND
  MAIN : to_see(certain)

TO_SEARCH
  MAIN : to_see(possible)

TO_OPEN
  MAIN : to_make(inward)

TO_DO
  MAIN : to_make()

TO_CONTAIN
  MAIN : to_be(parent)

TO_ENTER
  MAIN : to_be(inward,location)

TO_LEAVE
  MAIN : to_be(outward,location)

TO_ATTACK
  MAIN : to_make(negative,phisionomic)

TO_HAVE
  MAIN : to_be(parent)

TO_EDIT
  MAIN : to_make(order)

TO_THANK
  MAIN : to_see(positive,interaction)

~ Prepositions

ON
  TYPE : Preposition
  MAIN : parent()

ONTO
  TYPE : Preposition
  MAIN : parent()

AT
  TYPE : Preposition
  MAIN : location()

IN
  TYPE : Preposition
  MAIN : children()

INSIDE
  TYPE : Preposition
  MAIN : children()

UNDER
  TYPE : Preposition
  MAIN : children(physic)

WILL
  TYPE : Preposition
  MAIN : certain()

CAN
  TYPE : Preposition
  MAIN : possible()

CANNOT
  TYPE : Preposition
  MAIN : impossible()

TOWARD
  TYPE : Preposition
  MAIN : outward()

TO
  TYPE : Preposition
  MAIN : position()

FROM
  TYPE : Preposition
  MAIN : inward()

AGAIN
  TYPE : Preposition
  MAIN : multiple(single)

WITH
  TYPE : Preposition
  MAIN : with()

NEAR
  TYPE : Preposition
  MAIN : with(location)

OUTSIDE
  TYPE : Preposition
  MAIN : parent(location)

MULTIPLE
  TYPE : Preposition
  MAIN : multiple()

NONE
  TYPE : Preposition
  MAIN : none()

MANY
  TYPE : Preposition
  MAIN : multiple()

WHENEVER
  TYPE : Preposition
  MAIN : united(multiple,complex)

WHEREVER
  TYPE : Preposition
  MAIN : united(multiple,position)
  
WHOEVER
  TYPE : Preposition
  MAIN : united(multiple,organic)

EVERYONE
  TYPE : Preposition
  MAIN : united(multiple,organic)

EVERYTHING
  TYPE : Preposition
  MAIN : united(synthetic,single)

AND
  TYPE : Preposition
  MAIN : with()

HERE
  TYPE : Preposition
  MAIN : location(position)

BETWEEN
  TYPE : Preposition
  MAIN : location(united)

~ Color

COLOR
  MAIN : counter(to_see)

VIOLET
  TYPE : Color
  MAIN : counter(to_see,multiple)

BLUE
  TYPE : Color
  MAIN : counter(to_see,none,parent)

GREEN
  TYPE : Color
  MAIN : counter(to_see,single)

YELLOW
  TYPE : Color
  MAIN : counter(to_see,none,children)

RED
  TYPE : Color
  MAIN : counter(to_see,none)

WHITE
  TYPE : Color
  MAIN : counter(to_see,with)

GREY
  TYPE : Color
  MAIN : counter(to_see,united)

BLACK
  TYPE : Color
  MAIN : counter(to_see,without)

~ Numbers

0
  TYPE : Number
  MAIN : none()
  
1
  TYPE : Number
  MAIN : single()
  
2
  TYPE : Number
  MAIN : multiple()
  
3
  TYPE : Number
  MAIN : multiple(none)
  
4
  TYPE : Number
  MAIN : multiple(single)
  
5
  TYPE : Number
  MAIN : multiple(multiple)

6
  TYPE : Number
  MAIN : multiple(without)
  
7
  TYPE : Number
  MAIN : multiple(united)
  
8
  TYPE : Number
  MAIN : multiple(with)

9
  TYPE : Number
  MAIN : multiple(inward)
  
10
  TYPE : Number
  MAIN : multiple(position)
  
11
  TYPE : Number
  MAIN : multiple(outward) 

100
  TYPE : Number
  MAIN : none(push)
  
1000
  TYPE : Number
  MAIN : single(push)
  
10'000
  TYPE : Number
  MAIN : multiple(push)
  
100'000
  TYPE : Number
  MAIN : multiple(push,none)
  
1'000'000
  TYPE : Number
  MAIN : multiple(push,single)
  
10'000'000
  TYPE : Number
  MAIN : multiple(push,multiple)

100'000'000
  TYPE : Number
  MAIN : multiple(push,without)
  
1'000'000'000
  TYPE : Number
  MAIN : multiple(push,united)
  
10^7
  TYPE : Number
  MAIN : multiple(push,with)

10^8
  TYPE : Number
  MAIN : multiple(push,inward)
  
10^9
  TYPE : Number
  MAIN : multiple(push,position)
  
10^10
  TYPE : Number
  MAIN : multiple(push,outward) 

~ Adjectives

LARGE
  MAIN : phisionomic(outward)

NORMAL
  MAIN : phisionomic(position)

SMALL
  MAIN : phisionomic(inward)

LITTLE
  MAIN : phisionomic(inward)

MORE
  MAIN : multiple()

LESS
  MAIN : none()

FEW
  MAIN : phisionomic(none)

GOOD
  MAIN : positive()

PRETTY
  MAIN : positive(phisionomic)

FAST
  MAIN : multiple(position)

SLOW
  MAIN : none(position)

DANGEROUS
  MAIN : negative(to_make,phisionomic)

DIRECTLY
  MAIN : certain(outward)

ASSEMBLED
  MAIN : united(children)

AWARE
  MAIN : possible(to_see)

UNBREAKABLE
  MAIN : impossible(to_make,multiple)

INSIDE_OUT
  MAIN : inward(outward)

CROWDED
  MAIN : chaos(multiple,organic)

FIRST
  MAIN : counter(order)

LAST
  MAIN : counter(chaos)

~ Grammar

TRUE
  MAIN : true()

FALSE
  MAIN : false()

RELATED
  MAIN : related()

CONNECT
  MAIN : connect()

DISCONNECT
  MAIN : disconnect()

COLLECTION_PUSH
  MAIN : push()

COLLECTION_POP
  MAIN : pop()

UNRELATED
  MAIN : unrelated()

COUNTER
  MAIN : counter()
  
RELATION
  MAIN : relation()

CHILDREN
  MAIN : children()

NTH
  MAIN : related()

~ Foreign

CAT
  TYPE : Foreign
  MAIN : location(phisionomic)

TELEPHONE
  TYPE : Foreign
  MAIN : real(push,to_be,to_be)

OWL
  TYPE : Foreign
  MAIN : impossible(none)

FOX
  TYPE : Foreign
  MAIN : to_be(impossible)

BAT
  TYPE : Foreign
  MAIN : neutral(phisionomic)

LIETAL
  TYPE : Foreign
  MAIN : multiple(push,phisionomic,single)