var payload = new Runic(`
* Cases
* Nominative
& The nominative is the basic(dictionary) form of the noun when removed from context.
# {*Студентка*} задала вопрос <comment>The student asked a question.</comment>
* Accusative
& The accusative is the goal of the action, or the target of the verb.
# Учитель открыл {*окно*} <comment>The teacher opened the window.</comment>
* Genitive
& The genitive is used to express a relationship between two nouns.
# Это портофель {*профессора*} <comment>This is the professor's briefcase.</comment>
* Prepositional
& The prepositional is used when the noun is affected by a preposition.
* Dative
& The dative is used when the noun is the recipient of an action.
# Маша даёт билет {*борису*} <comment>Masha is giving the ticket to Boris.</comment>
* Instrumental
& The instrumental is used when the noun is the instrument or mean by which an action is performed.
# Ученик пишет {*карандашом*} <comment>The student writes with a pencil.</comment>
* Gender
* On Pronouns
& The gender of the noun determines the gender of the pronoun.
~ Where is my table
- Где мой стол
~ Where is my window
- Где моё окно
~ Where is my lamp
- Где моя лампа
* On Adjectives
& The gender of the noun determines the gender of the adjective.
~ This is a new table
- Это новый стол  
~ This is a new window
- Это новое окно  
~ This is a new lamp
- Это новая лампа 
* On Verbs
& The gender of the noun determines the predicate verb.
~ The table was there
- Стол был там       
~ The window was there
- Окно было там   
~ The lamp was there
- Лампа была там 
* Expressions
* Basics
& It's amazing how many sentences can be made with knowing these simple 3 words: нет, был & будет.
# Студент дома. <comment>The student is at home.</comment>
# Студента {*нет*} дома. <comment>The student is not at home.</comment>
# Студент {*был*} дома. <comment>The student was home.</comment>
# Студент {*будет*} дома. <comment>The student will be home.</comment>
* Present Tense
~ It is cold 
- холодно 
~ It is not cold
- не холодно 
~ I am cold      
- мне холодно    
~ We are cold
- нам холодно 
~ You are cold   
- тебе холодно   
~ Yous are cold
- вам холодно 
~ He/She is cold 
- ему/ей холодно 
~ They are cold
- им холодно  
* Past Tense
~ It was cold 
- было холодно 
~ It was not cold
- не было холодно 
~ I was cold      
- мне было холодно    
~ We were cold
- нам было холодно 
~ You were cold   
- тебе было холодно   
~ Yous were cold
- вам было холодно 
~ He/She was cold 
- ему/ей было холодно 
~ They were cold
- им было холодно  
* Future Tense
~ It will be cold 
- будет холодно 
~ It will not be cold
- не быдет холодно 
~ I shall be cold      
- мне будет холодно    
~ We shall be cold
- нам быдет холодно 
~ You shall be cold   
- тебе будет холодно   
~ Yous shall be cold
- вам быдет холодно 
~ He/She shall be cold 
- ему/ей будет холодно 
~ They shall be cold
- им быдет холодно  
* Verbs
* Table
& This is the basic conjugation table for a few simple Russian verbs. I always kept this nearby, for reference.
~ {*читать*} <br /> to read
- я {_чита_}ю       
- ты {_чита_}ешь    
- он/она {_чита_}ет 
- мы {_чита_}ем     
- вы {_чита_}ете    
- они {_чита_}ют    
~ {*писать*} <br /> to write
- я {_пиш_}у
- ты {_пиш_}ешь
- он/она {_пиш_}ет
- мы {_пиш_}ем
- вы {_пиш_}ете
- они {_пиш_}ут
~ {*иметь*} <br /> to have
- я {_име_}ю
- ты {_име_}ешь
- он/она {_име_}ет
- мы {_име_}ем
- вы {_име_}ете
- они {_име_}ут
~ {*говорить*} <br /> to speak
- я {_говор_}ю
- ты {_говор_}ишь
- он/она {_говор_}ит
- мы {_говор_}им
- вы {_говор_}ите
- они {_говор_}ят
~ {*видеть*}<br />to see
- я {_ви_}жу
- ты {_вид_}ишь
- он/она {_вид_}ит
- мы {_вид_}им
- вы {_вид_}ите
- они {_вид_}ят
* Motion Verb
& A few motion verbs like ходить(to go, to come) and идти can be prefixed to create new motion verbs.
# Я {*в*}хожу в школу. <comment>I go into the school.</comment>
# Я {*при*}хожу в школу. <comment>I arrive at school.</comment>
+ Table
~ to go, to walk
- ходить 
~ to come, to arrive
- при<i>ходить</i> 
~ to pass by
- про<i>ходить</i> 
~ to go away, to leave
- у<i>ходить</i> 
~ to cross
- пере<i>ходить</i> 
~ to go into, to enter
- в<i>ходить</i> 
~ to go out, to exit
- вы<i>ходить</i> 
~ to go up to, to approach
- под<i>ходить</i> 
~ to leave(of a train)
- от<i>ходить</i> 
* Aspects
& Aspects are indicators of completion of an action on some verbs allowing to create further indication of the progress of an action.
~ Imperfective
- {*привыкать*} to try to get used to 
- {*решать*} to work on, to try to solve 
- {*сдавать*} to take(an exam) 
- {*уговаривать*} to try to persuade 
- {*учить*} to study 
~ Perfective
- {*привыкнуть*} to be accustomed
- {*решить*} to solve
- {*сдать*} to pass
- {*уговорить*} to convince, to talk into
- {*выучить*} to memorize
`); invoke.vessel.seal("docs","russian",payload);
