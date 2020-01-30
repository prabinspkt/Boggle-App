class TrieNode {
  constructor(parent, letter) {
    this.parent = parent;
    this.letter = letter;
    this.children = new Array(26);
    this.isValidWord = false;
    if (parent !== undefined) {
      parent.children[letter.charCodeAt(0) - 97] = this;
    }
  }
}

class Boggle {
  constructor(grid, dict) {
    this.grid = grid;
    this.dict = dict;
  }

  boggleSolver() {
    var trie = this.makeTrie(this.dict);
    var queue = [];
    var words = new Set();
    //  Parse the grid
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[0].length; j++) {
        var entry = this.grid[i][j];
        if (entry.length === 1) {
          var node = trie.children[entry.charCodeAt(0) - 97];
          if (node !== undefined) {
            queue.push([i, j, entry, node, [[i, j]]]);
          }
        } else if (entry.length > 1) {
          //  Multi letter entry
          var curr = trie.children[entry.charCodeAt(0) - 97];
          if (curr !== undefined) {
            let counter = 1;
            let valid = false;
            while (counter < entry.length) {
              var node = curr.children[entry.charCodeAt(counter) - 97];
              if (node === undefined) {
                valid = false;
                break;
              }
              counter++;
              var prev = curr;
              curr = curr.children[entry.charCodeAt(counter) - 97];
              valid = true;
            }
            if (valid) {
              var lowestNode =
                prev.children[entry.charCodeAt(entry.length - 1) - 97];
              queue.push([i, j, entry, lowestNode, [[i, j]]]);
            }
          }
        }
      }
    }
    while (queue.length !== 0) {
      var [x, y, s, node, h] = queue.pop();
      for (let [dx, dy] of [
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
      ]) {
        var [x2, y2] = [x + dx, y + dy];
        if (
          h.find(function(element) {
            return element[0] === x2 && element[1] === y2;
          }) !== undefined
        ) {
          continue;
        }
        if (
          0 <= x2 &&
          x2 < this.grid[0].length &&
          0 <= y2 &&
          y2 < this.grid.length
        ) {
          var updatedHistory = h.slice();
          updatedHistory.push([x2, y2]);
          var s2 = s + this.grid[x2][y2];
          if (this.grid[x2][y2].length > 1) {
            var characters = Array.from(this.grid[x2][y2]);
            var curr = node;
            var found = false;
            for (let char of characters) {
              if (curr.children[char.charCodeAt(0) - 97] !== undefined) {
                curr = curr.children[char.charCodeAt(0) - 97];
                found = true;
              } else {
                found = false;
              }
            }
            if (found) {
              if (curr.isValidWord) {
                if (s2.length > 2) {
                  words.add(s2);
                }
              }
              queue.push([x2, y2, s2, curr, updatedHistory]);
            }
          } else {
            var node2 = node.children[this.grid[x2][y2].charCodeAt(0) - 97];
            if (node2 !== undefined) {
              if (node2.isValidWord) {
                if (s2.length > 2) {
                  words.add(s2);
                }
              }
              queue.push([x2, y2, s2, node2, updatedHistory]);
            }
          }
        }
      }
    }
    return words.values();
  }
}

Boggle.prototype.makeTrie = function(dict) {
  var root = new TrieNode(undefined, '');
  for (let word of dict.values()) {
    var current = root;
    for (var i = 0; i < word.length; i++) {
      let order = word.charCodeAt(i);
      let char = word[i];
      if (97 <= order < 123) {
        var next = current.children[order - 97];
        if (next === undefined) {
          next = new TrieNode(current, char);
        }
        current = next;
      }
    }
    current.isValidWord = true;
  }
  return root;
};

export const findAllSolutions = (grid, dict) => {
  var boggle = new Boggle(grid, dict);
  return boggle.boggleSolver();
};
