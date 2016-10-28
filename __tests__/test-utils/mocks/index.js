import {Component} from 'react'

export default class MockComponent extends Component {
  static defaultProps = {
    test: 'hi'
  }

  render () {
    <div />
  }
}
