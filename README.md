# Mtictactoesweeper

## Gameplay
- Each player starts with half as many flags as there are mines.
- On each turn, a player can either reveal or flag/unflag a covered tile.
- Like in regular minesweeper, a tile cannot be uncovered if it is flagged.
- A flag can only be removed by the player who placed it.
- Flags can only be placed on covered tiles that touch either (a) an uncovered tile or
  (b) a flag of the same color, i.e. placed by the same player.

## Game-over conditions
Unlike in regular minesweeper, the game does not end when all non-mine tiles are uncovered.  
Instead, the game can be...
  - **won** by placing three or more flags of the same color in a straight line (tic-tac-toe victory).
  - **won** by having flagged the most mines correctly once all mines are flagged (minesweeper victory).
  - **lost** by uncovering a mine (minesweeper defeat).

## Emergent strategies
- Uncovering tiles rashly to stop an opponent from advancing toward tic-tac-toe victory.
- Flagging non-mines on purpose (particularly when sandwiched in between two other mines) to preempt the above.
- On running out of flags, having to choose tactically which previously-placed flags to take back (which can open
  up room for tic-tac-toe defeat).
Overall, and particularly with low mine-counts, the game plays more like "tactical tic-tac-toe" than like minesweeper.
That could be mitigated by bumping up the number of mines... but that also makes it even-more boring, so.