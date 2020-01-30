// Grid nodes that represent nodes in the grid provided.
class gridNode {
  constructor(row, col, letter) {
    this.visited = false;
    this.indices = [row, col];
    this.letter = letter;
    this.adjacencyList = [];
  }
  addAdjacentIndex(row, col) {
    this.adjacencyList.push([row, col]);
  }
}

// Returns a list that contains the grid nodes and their adjacency lists.
function generateAdjacencyLists(width, height, grid) {
  var adjacencyLists = [];
  for (var row = 0; row < width; row++) {
    for (var col = 0; col < height; col++) {
      var newNode = new gridNode(row, col, grid[row][col]);

      if (row > 0) {
        newNode.addAdjacentIndex(row - 1, col);
      }
      if (row < width - 1) {
        newNode.addAdjacentIndex(row + 1, col);
      }
      if (col > 0) {
        newNode.addAdjacentIndex(row, col - 1);
      }
      if (col < height - 1) {
        newNode.addAdjacentIndex(row, col + 1);
      }
      if (row > 0 && col > 0) {
        newNode.addAdjacentIndex(row - 1, col - 1);
      }
      if (row > 0 && col < height - 1) {
        newNode.addAdjacentIndex(row - 1, col + 1);
      }
      if (row < width - 1 && col > 0) {
        newNode.addAdjacentIndex(row + 1, col - 1);
      }
      if (row < width - 1 && col < height - 1) {
        newNode.addAdjacentIndex(row + 1, col + 1);
      }

      adjacencyLists.push(newNode);
    }
  }
  return adjacencyLists;
}

// Verifies whether the word provided can be found in the grid.
function verifyWord(adjacencyList, word, wordIndex, gridNodes) {
  if (wordIndex >= word.length) {
    return true;
  }

  // Checks whether all nodes have been visited or not.
  var listExhausted = true;
  for (let nodeIndex = 0; nodeIndex < gridNodes.length; nodeIndex++) {
    if (gridNodes[nodeIndex].visited === false) {
      listExhausted = false;
      break;
    }
  }
  if (listExhausted) {
    return false;
  }

  // This part of the code checks whether the current character of the word matches any of the nodes in the nodelist that is adjacent to the current node. Then, repeats recursively.
  var wordFound = false;
  for (
    var adjacentNodeIndex = 0;
    adjacentNodeIndex < adjacencyList.length;
    adjacentNodeIndex++
  ) {
    for (
      var gridNodeIndex = 0;
      gridNodeIndex < gridNodes.length;
      gridNodeIndex++
    ) {
      // The following if statement is to check whether the current grid node is indeed the adjacent node that is currently being processed.
      // This is done by checking the indices of both nodes (at both row index and column index).
      if (
        adjacencyList[adjacentNodeIndex][0] ===
          gridNodes[gridNodeIndex].indices[0] &&
        adjacencyList[adjacentNodeIndex][1] ===
          gridNodes[gridNodeIndex].indices[1]
      ) {
        var indexToAdd = 0;
        var isEqual = true;
        for (
          var nodeLetterIndex = 0;
          nodeLetterIndex < gridNodes[gridNodeIndex].letter.length;
          nodeLetterIndex++
        ) {
          if (
            word.charAt(wordIndex + indexToAdd).toUpperCase() !==
            gridNodes[gridNodeIndex].letter
              .charAt(nodeLetterIndex)
              .toUpperCase()
          ) {
            isEqual = false;
          }
          indexToAdd += 1;
        }

        if (gridNodes[gridNodeIndex].visited === false && isEqual) {
          gridNodes[gridNodeIndex].visited = true;
          wordFound =
            wordFound ||
            verifyWord(
              gridNodes[gridNodeIndex].adjacencyList,
              word,
              wordIndex + indexToAdd,
              gridNodes
            );
          gridNodes[gridNodeIndex].visited = false;
        }
      }
    }
  }
  return wordFound;
}

// This function finds all dictionary words that exist in the grid.
export const findAllSolutions = (grid, dictionary) => {
  var foundWords = [];
  // Check for invalid inputs.
  if (!grid || !dictionary) {
    return foundWords;
  }

  if (grid.length === 0 || grid[0].length === 0) {
    return foundWords;
  }

  // Check for inconsistent column numbers within grid.
  var colNum = grid[0].length;
  for (var row = 1; row < grid.length; row++) {
    if (grid[row].length !== colNum) {
      return foundWords;
    }
  }

  // Generate adjacency lists for all grid nodes.
  var gridNodes = generateAdjacencyLists(grid.length, grid[0].length, grid);

  for (var wordIndex = 0; wordIndex < dictionary.length; wordIndex++) {
    // Only check for word if length is >= 3.
    if (dictionary[wordIndex].length < 3) {
      continue;
    }

    // Check for the first word character match before moving onto the recursive function to check the word match.
    for (
      var gridNodeIndex = 0;
      gridNodeIndex < gridNodes.length;
      gridNodeIndex++
    ) {
      var indexToAdd = 0;
      var isEqual = true;
      for (
        var nodeLetterIndex = 0;
        nodeLetterIndex < gridNodes[gridNodeIndex].letter.length;
        nodeLetterIndex++
      ) {
        if (
          dictionary[wordIndex].charAt(0 + indexToAdd).toUpperCase() !==
          gridNodes[gridNodeIndex].letter.charAt(nodeLetterIndex).toUpperCase()
        ) {
          isEqual = false;
        }
        indexToAdd += 1;
      }
      if (isEqual) {
        gridNodes[gridNodeIndex].visited = true;
        if (
          verifyWord(
            gridNodes[gridNodeIndex].adjacencyList,
            dictionary[wordIndex],
            0 + indexToAdd,
            gridNodes
          )
        ) {
          foundWords.push(dictionary[wordIndex]);
        }
        gridNodes[gridNodeIndex].visited = false;
      }
    }
  }
  return foundWords;
};
