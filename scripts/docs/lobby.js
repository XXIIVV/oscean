~ NAME : The Queue
~ NOTE : ?
~ AUTH : Devine Lu Linvega

SETUP
  & Nataniev simply requires Ruby, the {{Sinatra Gem|https://www.digitalocean.com/community/tutorials/how-to-install-and-get-started-with-sinatra-on-your-system-or-vps}} and a copy of the {{Nataniev Repository|https://github.com/XXIIVV/Nataniev}}.
  & Through Terminal, navigate inside the repository and type:
  # ruby {*nataniev.server.rb*} lobby
  & It should, in theory, start localhost, and make the following URL accessible through your browser.
  # http://localhost:8668/
  & If everything is in order, you should see a mostly empty screen and a prompt at the bottom.

COMMANDER
  & Every action is done through the commander, or input bar, at the bottom of the screen. To launch an application, type its name into the Commander.
  # {*marabu*}
  & Once the application is active, a series of methods become available. To load a Marabu project file, type the application name, followed by a period and the method name. This process can be accelerated by pressing {#tab#} to auto-complete, or {#ctrl+l#}.
  # {*marabu*}.load 
  & Multiple candidates should be now displayed, to navigate the candidates simply input additional characters into your query.
  # {*marabu*}.load tr 1
  & A single candidate should display, pressing enter should load the track1.mar file. This process is identical to loading a ronin, or ide file.
  # {*ronin*}.load wallpaper1.jpg
  # {*ide*}.load marabu main.js

WINDOWS
  & Windows can be dragged around with the cursor, but can also be controlled entirely with keyboard shortcuts.
  & Each window management shortcut is a combination of the alt/option key and something else.
  > <table>
  | Arrows | Move the window.
  | a | Make window thinner.
  | d | Make window wider.
  | w | Make window shorter.
  | s | Make window taller.
  | Escape | Fill screen.
  | ` | Fullscreen.
  | ] | Stick right.
  | [ | Stick left.
  | Tab | Focus on Commander.
  | 1 | Set theme to Blanc.
  | 2 | Set theme to Noir.
  | 3 | Set theme to Ghost.
  > </table>