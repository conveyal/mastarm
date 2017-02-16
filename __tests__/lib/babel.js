/* globals describe, expect, it */

const INTENDED_LENGTH = 2

describe('babel', () => {
  /** As of 2016-12-15 this test fails in babel loose mode. https://github.com/babel/babel/issues/4916 */
  it('should iterate correctly over a set after using the spread operator', () => {
    const originalArr = [0, 1, 1]
    const set = new Set(originalArr)
    const arr = [...set]
    expect(arr.length).toBe(INTENDED_LENGTH)
  })
})
