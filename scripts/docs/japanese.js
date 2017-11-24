var payload = new Runic(`
* SYNTAX
* Action Verb（上げる）
& In general, standard word order for Japanese when using an action verb is as shown below. Subjects are shown in grey as they are very often deleted. 
& <i>I'm</i> going to give a present to my teacher tomorrow at school.
> <table>
| <i>Subject</i> | Time | Place | Indirect | Object | <b>Action Verb</b>
| <i>私は</i>     | 明日 | 学校で | 先生に | プレゼントを | 上げます
| <i>わたくし は</i>　| あした | がっこう　で　| せんせい　に　| ぷれぜんと　を　| あげます
> </table>
* Existence Verb（いる）
& <i>I'm</i> in the main office right now.
> <table>
| <i>Subject</i> | Time | Location | <b>Existence Verb</b>
| <i>私は</i>     | 今 | 本社に | いる
| <i>わたくし は</i>　| いま | ほんしゃ　に|いる 
> </table>
* Motion Verb（行く）
& <i>I'm</i> going to a party tomorrow.
> <table>
| <i>Subject</i> | Time | Destination | <b>Motion Verb</b>
| <i>私は</i> | 明日 | パーテイーに | 行く
| <i>わたくし は</i>　| あした | ぱーていー　に|いく
> </table>
* PARTICLES
* は
& In general, if a {*new subject is introduced*} where another had been previously understood, signal the change by placing は after the subject. If a subject is understood, but for some reason not deleted use が or nothing. 
* に
& An indicator of a specific points in {*time*} is usually followed by に, a word like "tomorrow" can only be understood by context and does not need the particle added. 
> <table>
| 十月に|じゅう　がつ　に | In October
| 三月三日に|さん　がつ　みっか　に| On March 3rd
> </table>
& <b>Indirect objects</b> are also followed by に, similar to the english expression "to you".
> <table>
| この本をあなたに上げる | この　ほん　を　なたな　に　あげる | I'm going to give this book to you.
> </table>
* で
& The {*place*} you do something or the {*thing*} you use to do something is followed by で. 
> <table>
| 車で行く|くるま　で　いく| Going by car
> </table>
* を
& An {*object*} is followed by を or nothing.
> <table>
| 本を読んでいる | ほん　を　よんで　いる | I'm reading a book.
> </table>
* も
& Use も to <b>add extra info</b> on top of what has already been declared, not unlike the english word "too", as in "me too".
> <table>
| ぼくも行く | ぼく　も　いく | I'm going too.
> </table>
* の
& Indicate {*possession*} by using の following an object, not unlike the english possession particle "'s", as in "Devine's".
> <table>
| これはぼくの本です | これ　は　ぼく　の　ほん　です | This is my book
> </table>
* か
& A verb in a {*question*} sentence is followed by か.
> <table>
| 何時ですか | なんじ　です　か | What time is it?
> </table>
& Between {*choices*}, each choice is also followed by か.
> <table>
| 今日か明日？ | きょう　か　あした | Today or tomorrow?
> </table>
* ね
& A verb in a sentence that shares a sort of {*agreement*} with the listener is followed by ね, not unlike the english expression "isn't?".
> <table>
| 多能しいですね | たのうしい　です　ね | It's fun isn't it?
> </table>
* や
& [TODO]Each object in an {*enumeration*} is followed by や.
* よ
& [TODO]A verb in an {*exclamative*} sentence is followed by よ.

* ADJECTIVES
& Adjectives always end in あい, いい, うい or おい, never in えい that would be a noun. Basically, you replace the ending い to inflect.
> <table>
| 優しい | やさしい | It's nice
| 優しくない | やさしくない | It's not nice
| 優しかった | やさしかった | It was nice
| 優しかったら | やさしかったら | If it's nice
> </table>
& Sometimes when you look in a dictionary or ask for an adjective you, you will find something that doesn't look like an adjective at all. It's a noun! If you come up with a noun for a word when you expected an adjective (like きれい, pretty), just remember that you use adjectival noun + な + noun to make it work. So, きれい（な）お女王さん「きれい（な）おじょおさん」is "pretty girl". 
& Just note that you don't say: あつかせる for "make something hot" you say あつく + する.

* VERBS
* ーる Verbs
& These verbs are those that end in ーる like たべる and いれる. There is always an い or an え before ーる.
& For these verbs, everything is done by dropping or replacing ーる with something else. 
> <table>
| {_食べ_}る | Eating
| {_食べ_}ます | (Polite)
| {_食べ_}て | Gerund
| {_食べ_}た | I ate it.
| {_食べ_}やすい | This is easy to eat.
| {_食べ_}たら | If I/someone eats.
| {_食べ_}たり | I did things like eating
| {_食べ_}れば | If I/someone eats. 
| {_食べ_}よう | Let's eat.
| {_食べ_}ろ | Eat dammit!
| {_食べ_}ない　で　よ | Don't eat that!
| {_食べ_}られる | I can eat
| {_食べ_}られるない | I can't eat this!
| {_食べ_}させる | Make someone do
| {_食べ_}させない　で　よ | Don't make me eat this!
| {_食べ_}させられる | Be made to eat
> </table>
* ーう Verbs
& These verbs end in う, く, ぐ, ぶ, む, ぬ, す, つ, or ある・いる・うる・える・おる. Typically you drop ーう and add something else. The problem is that there might be a phonetic change, such as when は becomes ぱ, or た becomes だ.
> <table>
| talk  |はな   |話す |話して |話しった |話したら  |話せ | 話さない | 話せる 
| walk  |きく   |きく | きいて    | 聞いた    | 聞いたら| 聞け   | 聞かない   | 聞ける    
| swim  |およぐ |泳ぐ | 泳いでる   | 泳いだ   | 泳いだら| 泳げ  | 泳がない  | 泳げる   
| call  |よび   |呼ぶ | 呼んで    | 呼んだ    | 呼んだら| 呼べ   | 呼ばない   | 呼べる    
| drink |ぬも   |飲む | 飲んで    | 飲んだ    | 飲んだら| 飲め   | 飲まない   | 飲める
| die   |しぬ   |死ぬ | 死んで    | 死んだ    | 死んだら| 死ね   | 死なない   | 死ねる    
| make  |つくる |作る | 作って  | つ作った  | 作ったら| 作れ | 作らない | 作れる  
| wait  |まて   |待つ | 待って    | 待った    | 待ったら| | 待たない| 待てる    
| pay   |はらう |払う | 払って  | 払った  | 払ったら| 払え  | 払わない | 払える   
> </table>
& There are some ーう verbs that end in ーる like ある(to be), おる(to break) and うる(to sell) are ーう verbs as they do not have an い or え sound before ーる. 
& If you see one that ends in ーいる or ーえる, and ーう changes to add ーます, or the "t" doubles to get a gerund (入る「はいる」　＞　入って「はいって」), then you're dealing with an ーう verb.
* Irregulars
& Most books say that there are only two irregular verbs in all of Japanese: する and 来る「くる」. Those you have to memorize separately, but they kind of make sense when you look at them. 
> <table>
| 来る | will come                        | する| will do
| 来て | come here                        | して| do this
| 来た | someone came                     | した| someone did
| 来たら | if someone comes                | したら|if someone does
| 来たり | do things like come             | したり| do things like doing
| 来れば | if someone comes                | すれば|if someone does
| 来よう | let's come                      | しよう|let's do
| 来い | come here you!                   | しろ|do this dammit!
| 来ない | won't come, or doesn't come    | しない|won't do, or doesn't do
| 来らせる | can come                      | できる|can do
| 来させる | make someone come             | させる|make someone do
| 来られる | ?                             | される|be done
| 来させられる| be made to come by someone  | させられる | be made to do by someone
> </table>
& A trick to remember する conjugations is that they often match what you would get if you conjugated a lone す.　Like はな<b>した</b>, はな<b>せる</b>, はな<b>させる</b>.
`); invoke.vessel.seal("docs","japanese",payload);
