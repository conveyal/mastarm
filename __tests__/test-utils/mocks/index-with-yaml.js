import React, {Component} from 'react'
import uuid from 'uuid'

const yaml = require('./mock.yml')

/**
 * A Mock Component to test to ensure that building of React jsx components works
 */
export default class MockTestComponentUniqueName extends Component {
  static defaultProps = {
    test: 'hi'
  }

  /**
   * Render the component.
   */
  render () {
    console.log(yaml)
    console.log(uuid.v4())
    return <div />
  }
}
