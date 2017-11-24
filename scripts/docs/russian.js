var payload = new Runic(`
* CASES
* Nominative
& The nominative is the basic(dictionary) form of the noun when removed from context.
# {*Студентка*} задала вопрос <comment>The student asked a question.</comment>
* Accusative
& The accusative is the goal of the action, or the target of the verb.
# Учитель открыл {*окно*} <comment>The teacher opened the window.</comment>
* Genitive
& The genitive is used to express a relationship between two nouns.
# Это портофель {*профессора*} <comment>This is the professor's briefcase.</comment>
Prepositional
& The prepositional is used when the noun is affected by a preposition.
* Dative
& The dative is used when the noun is the recipient of an action.
# Маша даёт билет {*борису*} <comment>Masha is giving the ticket to Boris.</comment>
* Instrumental
& The instrumental is used when the noun is the instrument or mean by which an action is performed.
# Ученик пишет {*карандашом*} <comment>The student writes with a pencil.</comment>

GENDER
* On Pronouns
& The gender of the noun determines the gender of the pronoun.
> <table>
| Где мой стол  | Where is my table
| Где моё окно  | Where is my window
| Где моя лампа | Where is my lamp
> </table>
* On Adjectives
& The gender of the noun determines the gender of the adjective.
> <table>
| Это новый стол  | This is a new table
| Это новое окно  | This is a new window
| Это новая лампа | This is a new lamp
> </table>
* On Verbs
& The gender of the noun determines the predicate verb.
> <table>
| Стол был там       | The table was there
| Окно было там   | The window was there
| Лампа была там | The lamp was there
> </table>

* EXPRESSIONS
* Basics
& It's amazing how many sentences can be made with knowing these simple 3 words: нет, был & будет.
# Студент дома. <comment>The student is at home.</comment>
# Студента {*нет*} дома. <comment>The student is not at home.</comment>
# Студент {*был*} дома. <comment>The student was home.</comment>
# Студент {*будет*} дома. <comment>The student will be home.</comment>
* Present Tense
> <table>
| холодно | It is cold | не холодно | It is not cold
| мне холодно    | I am cold      | нам холодно | We are cold
| тебе холодно   | You are cold   | вам холодно | Yous are cold
| ему/ей холодно | He/She is cold | им холодно  | They are cold
> </table>
* Past Tense
> <table>
| было холодно | It was cold | не было холодно | It was not cold
| мне было холодно    | I was cold      | нам было холодно | We were cold
| тебе было холодно   | You were cold   | вам было холодно | Yous were cold
| ему/ей было холодно | He/She was cold | им было холодно  | They were cold
> </table>
* Future Tense
> <table>
| будет холодно | It will be cold | не быдет холодно | It will not be cold
| мне будет холодно    | I shall be cold      | нам быдет холодно | We shall be cold
| тебе будет холодно   | You shall be cold   | вам быдет холодно | Yous shall be cold
| ему/ей будет холодно | He/She shall be cold | им быдет холодно  | They shall be cold
> </table>

* VERBS
* Table
& This is the basic conjugation table for a few simple Russian verbs. I always kept this nearby, for reference.
> <table>
|         | читать<br/>to read | писать<br/>to write | иметь<br/>to have | говорить<br/>to speak | видеть<br/>to see
| я       | {_чита_}ю          | {_пиш_}у            | {_име_}ю          | {_говор_}ю            | {_ви_}жу
| ты      | {_чита_}ешь        | {_пиш_}ешь          | {_име_}ешь        | {_говор_}ишь          | {_вид_}ишь  
| он/она  | {_чита_}ет         | {_пиш_}ет           | {_име_}ет         | {_говор_}ит           | {_вид_}ит 
| мы      | {_чита_}ем         | {_пиш_}ем           | {_име_}ем         | {_говор_}им           | {_вид_}им 
| вы      | {_чита_}ете        | {_пиш_}ете          | {_име_}ете        | {_говор_}ите          | {_вид_}ите  
| они     | {_чита_}ют         | {_пиш_}ут           | {_име_}ут         | {_говор_}ят           | {_вид_}ят 
> </table>
* Motion Verb
& A few motion verbs like ходить(to go, to come) and идти can be prefixed to create new motion verbs.
# Я {*в*}хожу в школу. <comment>I go into the school.</comment>
# Я {*при*}хожу в школу. <comment>I arrive at school.</comment>
> <table>
| ходить | to go, to walk
| при<i>ходить</i> | to come, to arrive
| про<i>ходить</i> | to pass by
| у<i>ходить</i> | to go away, to leave
| пере<i>ходить</i> | to cross
| в<i>ходить</i> | to go into, to enter
| вы<i>ходить</i> | to go out, to exit
| под<i>ходить</i> | to go up to, to approach
| от<i>ходить</i> | to leave(said of a train)
> </table>
* Aspects
& Aspects are indicators of completion of an action on some verbs allowing to create further indication of the progress of an action.
> <table>
| Imperfective | | Perfective | 
| привыкать    | to try to get used to | привыкнуть | to be accustomed
| решать       | to work on, to try to solve | решить | to solve
| сдавать      | to take(an exam) | сдать | to pass
| уговаривать  | to try to persuade | уговорить | to convince, to talk into
| учить        | to study | выучить | to memorize
> </table>
`); invoke.vessel.seal("docs","russian",payload);
