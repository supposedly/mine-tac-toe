# [Mtictactoesweeper](https://supposedly.github.io/mine-tac-toe)
Niche indie game you just totally haven't heard of, duuuude.

## Usage
Clone, then start up a webserver in the repo's root. `python3 -m http.server` (aka `python2 -m SimpleHTTPServer`)
suffices, for example.

## Gameplay
- Each player starts with a bit more than half as many flags as there are mines. (5/8 rounded down, to be exact)
- On each turn, a player can either reveal or flag/unflag a covered tile.
- Like in regular minesweeper, a tile cannot be uncovered if it is flagged.
- A flag can only be removed by the player who placed it.
- Flags can only be placed on covered tiles that touch either (a) an uncovered tile or
  (b) a flag of the same color, i.e. placed by the same player.

## Game-over conditions
Unlike in regular minesweeper, the game does not end when all non-mine tiles are uncovered.  
Instead, the game can be...
  - **won** by placing three or more flags of the same color in a straight line (tic-tac-toe victory)
  - **won** by having flagged the most mines correctly once all mines are flagged (minesweeper victory)
  - **lost** by uncovering a mine (minesweeper defeat)

## Emergent strategies
- Uncovering tiles rashly to stop an opponent from advancing toward tic-tac-toe victory.
- Flagging non-mines on purpose (particularly when sandwiched in between two other mines) to preempt the above.
- On running out of flags, having to choose tactically which previously-placed flags to take back (which can open
  up room for tic-tac-toe defeat).
Overall, and particularly with low mine-counts, the game plays more like "tactical tic-tac-toe" than like minesweeper.
That could be mitigated by bumping up the number of mines... but that also makes it even-more boring, so.

## Credits
- [Phaser 3](https://phaser.io/phaser3). Rather enjoyable to work with, even if there aren't yet too many
  non-Phaser-2 resources out there. Would recommend.
- [Discord](https://discordapp.com) for introducing
  [spoiler tags](https://support.discordapp.com/hc/en-us/articles/360022320632-Spoiler-Tags-),
  which prompted people to make [minesweeper games](https://redd.it/am0c3i) and ultimately got
  this idea into my head
