import React from 'react';
import ReactDOM from 'react-dom';
import RandomGrid from './create_random_grid.js';
import { findAllSolutions } from './boggle_solver';
import { Button, Card, ButtonToolbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import all_words from './full-wordlist';

class PrintGrid extends React.Component {
  render() {
    const grid_data = this.props.grid;
    return (
      <Card className="text-center">
        <Card.Body>
          <Card.Title> Make words from the grid below </Card.Title>
          <Card.Text>
          <div class="btn-group">
                <ButtonToolbar>
                  <Button variant="outline-secondary">{grid_data[0][0]}</Button>
                  <Button variant="outline-secondary">{grid_data[0][1]}</Button>
                  <Button variant="outline-secondary">{grid_data[0][2]}</Button>
                  <Button variant="outline-secondary">{grid_data[0][3]}</Button>
                  <Button variant="outline-secondary">{grid_data[0][4]}</Button>
                </ButtonToolbar>
            </div>
            <br />
            <div class="btn-group">
              <ButtonToolbar>
                <Button variant="outline-secondary">{grid_data[1][0]}</Button>
                <Button variant="outline-secondary">{grid_data[1][1]}</Button>
                <Button variant="outline-secondary">{grid_data[1][2]}</Button>
                <Button variant="outline-secondary">{grid_data[1][3]}</Button>
                <Button variant="outline-secondary">{grid_data[1][4]}</Button>
              </ButtonToolbar>
            </div>
            <br />
            <div class="btn-group">
              <ButtonToolbar>
                <Button variant="outline-secondary">{grid_data[2][0]}</Button>
                <Button variant="outline-secondary">{grid_data[2][1]}</Button>
                <Button variant="outline-secondary">{grid_data[2][2]}</Button>
                <Button variant="outline-secondary">{grid_data[2][3]}</Button>
                <Button variant="outline-secondary">{grid_data[2][4]}</Button>
              </ButtonToolbar>
            </div>
            <br />
            <div class="btn-group">
              <ButtonToolbar>
                <Button variant="outline-secondary">{grid_data[3][0]}</Button>
                <Button variant="outline-secondary">{grid_data[3][1]}</Button>
                <Button variant="outline-secondary">{grid_data[3][2]}</Button>
                <Button variant="outline-secondary">{grid_data[3][3]}</Button>
                <Button variant="outline-secondary">{grid_data[3][4]}</Button>
              </ButtonToolbar>
            </div>
            <br />
            <div class="btn-group">
              <ButtonToolbar>
                <Button variant="outline-secondary">{grid_data[4][0]}</Button>
                <Button variant="outline-secondary">{grid_data[4][1]}</Button>
                <Button variant="outline-secondary">{grid_data[4][2]}</Button>
                <Button variant="outline-secondary">{grid_data[4][3]}</Button>
                <Button variant="outline-secondary">{grid_data[4][4]}</Button>
              </ButtonToolbar>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

class PrintList extends React.Component {
  render() {
    const print_words = this.props.print_words;
    const print_items_list = print_words.map(print_item => (
      <li>{print_item}</li>
    ));
    return (
      <div>
        <p> {this.props.valid_invalid} words list: </p>
        <ul> {print_items_list} </ul>
      </div>
    );
  }
}

class GamePlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: this.props.random_grid,
      grid_solutions: this.props.random_grid_solutions,
      input_word: '',
      valid_words: [],
      invalid_words: [],
      ongoing: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  handleChange(event) {
    this.setState({ input_word: event.target.value });
  }

  handleStop(event) {
    event.preventDefault();
    this.setState({ ongoing: false });
  }

  handleSubmit(event) {
    event.preventDefault();

    let input_word = this.state.input_word.toLowerCase();
    if (this.state.grid_solutions.has(input_word)) {
      if (this.state.valid_words.includes(this.state.input_word)) {
        alert('The word has already been found.');
      } else {
        var new_valid_words = this.state.valid_words;
        new_valid_words.push(this.state.input_word);
        this.setState({ valid_words: new_valid_words });
        var remaining_words = this.state.grid_solutions;
        remaining_words.delete(this.state.input_word);
        this.setState({ grid_solutions: remaining_words });
      }
    } else {
      alert('The word is not valid.');
      var new_invalid_words = this.state.invalid_words;
      new_invalid_words.push(this.state.input_word);
      this.setState({ validated_word: new_invalid_words });
    }
  }

  render() {
    // Maybe add some check to see if grid is alreay there to prevent
    // getting new grid everytime
    console.log(this.state.grid);
    console.log(this.state.input_word);
    console.log(this.state.valid_words);
    if (this.state.ongoing) {
      return (
        <Card>
          <PrintGrid grid={this.state.grid} />
          <br />
          <div class="container">
            <div class="row">
              <div class="col-md">
                <form onSubmit={this.handleSubmit}>
                  <label>
                    Enter a word:
                    <input
                      type="text"
                      value={this.state.input_word}
                      onChange={this.handleChange}
                    />
                  </label>
                  <input class="btn btn-primary" type="submit" value="Submit" />
                </form>
              </div>
              <div class="col-md">
                <Button
                  onClick={this.handleStop}
                  type="button"
                  class="btn btn-primary btn-lg"
                >
                  Stop
                </Button>
              </div>
            </div>
          </div>
          <PrintList
            print_words={this.state.valid_words}
            valid_invalid={'Valid'}
          />
        </Card>
      );
    } else {
      return (
        <div>
          <PrintGrid grid={this.state.grid} />
          <PrintList
            print_words={this.state.valid_words}
            valid_invalid={'Valid'}
          />
          <PrintList
            print_words={this.state.invalid_words}
            valid_invalid={'Invalid'}
          />
          <PrintList
            print_words={Array.from(this.state.grid_solutions)}
            valid_invalid={'Remaining correct'}
          />
        </div>
      );
    }
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show_grid: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    this.setState({ show_grid: true });
    event.preventDefault();
  }

  render() {
    console.log(this.state.show_grid);
    if (this.state.show_grid) {
      const random_grid = RandomGrid();
      var random_grid_solutions = findAllSolutions(
        random_grid,
        all_words.words
      );
      var random_grid_solutions_set = new Set(random_grid_solutions);
      console.log('Random grid solutions: ', random_grid_solutions_set);
      console.log(random_grid);
      return (
        <div>
          <Card className="text-center">
            <Card.Header>Boggle</Card.Header>
            <Card.Body>
              <GamePlay
                random_grid={random_grid}
                random_grid_solutions={random_grid_solutions_set}
              />
            </Card.Body>
          </Card>
        </div>
      );
    } else {
      return (
        <div>
          <Card className="text-center">
            <Card.Header>Boggle</Card.Header>
            <Card.Body>
              <Card.Title> Click below to start playing boggle </Card.Title>
              <Button onClick={this.handleSubmit} variant="primary">
                Start
              </Button>
            </Card.Body>
          </Card>
        </div>
      );
    }
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));
