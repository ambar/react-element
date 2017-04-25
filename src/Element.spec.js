/* eslint react/prop-types: 0 */
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import StatelessElement from './Element'

const {
  renderIntoDocument,
  Simulate: {click},
} = TestUtils

const classify = Stateless => class extends Component {
  render() {
    return Stateless(this.props) // eslint-disable-line new-cap
  }
}

const Element = classify(StatelessElement)

const mount = (instance) => {
  const component = renderIntoDocument(instance)
  const element = findDOMNode(component)
  return {
    component,
    element,
  }
}

describe('<Element />', () => {
  it('should render html tag', () => {
    const {element} = mount(
      <Element component='span' id='id'>
        text
      </Element>
    )

    expect(element.nodeName).toBe('SPAN')
    expect(element.id).toBe('id')
    expect(element.textContent).toBe('text')
  })

  it('should render constructor', () => {
    const Link = ({children, ...props}) => (
      <a {...props} id='id' data-bar='bar'>{children}</a>
    )

    const {element} = mount(
      <Element component={Link} data-foo='foo'>
        text
      </Element>
    )

    expect(element.id).toBe('id')
    expect(element.textContent).toBe('text')
    expect(element.getAttribute('data-foo')).toBe('foo')
  })

  it('should render instance', () => {
    const Link = ({children, ...props}) => (
      <a id='id' data-bar='bar' {...props}>{children}</a>
    )

    const {element} = mount(
      <Element component={<Link data-url='1' />} id='overwritten' data-foo='foo' data-url='overwritten'>
        text
      </Element>
    )

    expect(element.id).toBe('overwritten')
    expect(element.textContent).toBe('text')
    expect(element.getAttribute('data-foo')).toBe('foo')
    expect(element.getAttribute('data-bar')).toBe('bar')
  })

  it('should render nested', () => {
    const {element} = mount(
      <Element component={<Element component='span' />}>
        text
      </Element>
    )

    expect(element.textContent).toBe('text')
  })

  it('should return null', () => {
    const {element} = mount(
      <Element />
    )

    expect(element).toBe(null)
  })

  it('should render children when `component` is null or false', () => {
    const shouldAddWrapper = false
    const {element} = mount(
      <Element component={shouldAddWrapper && 'div'}>
        <Element component={null}>
          <span>span</span>
        </Element>
      </Element>
    )

    expect(element.tagName).toBe('SPAN')
  })

  it('should keep classes', () => {
    const {element} = mount(
      <Element component={<span className='a' />} className='b' />
    )

    expect(element.classList.contains('a', 'b')).toBe(true)
  })

  it('should call inner event handler', () => {
    const innerFn = jest.fn()
    const {element} = mount(
      <Element component={<span onClick={innerFn} />} />
    )

    click(element)
    expect(innerFn).toBeCalled()
  })

  it('should call outer event handler', () => {
    const outerFn = jest.fn()
    const {element} = mount(
      <Element component={<span />} onClick={outerFn} />
    )

    click(element)
    expect(outerFn).toBeCalled()
  })

  it('should call both event handlers', () => {
    let seq = 0
    const innerFn = jest.fn(() => seq = 1)
    const outerFn = jest.fn(() => seq = 2)
    const {element} = mount(
      <Element component={<span onClick={innerFn} />} onClick={outerFn} />
    )

    click(element)
    expect(innerFn).toBeCalled()
    expect(outerFn).toBeCalled()
    expect(seq).toBe(2)
  })

  it('should use component children', () => {
    const {element} = mount(
      <Element component={<span>foo</span>} />
    )

    expect(element.textContent).toBe('foo')
  })

  it('should overwrite children', () => {
    const {element} = mount(
      <Element component={<span>foo</span>}>
        bar
      </Element>
    )

    expect(element.textContent).toBe('bar')
  })

  it('should join children', () => {
    const toggleButton = <span>toggle</span>
    const popup = <span>popup</span>
    const {element} = mount(
      <Element component={toggleButton}>
        {toggleButton.props.children}:{popup}
      </Element>
    )

    expect(element.textContent).toBe('toggle:popup')
  })

  it('should handle onRef when `component` is tag', () => {
    let span = null
    mount(
      <Element
        component={'span'}
        onRef={el => span = el}
      />
    )

    expect(span instanceof HTMLElement).toBe(true)
  })

  it('should handle onRef when `component` is constructor', () => {
    const Span = ({onRef}) => (
      <span ref={onRef} />
    )

    let span = null
    mount(
      <Element
        component={Span}
        onRef={el => span = el}
      />
    )

    expect(span instanceof HTMLElement).toBe(true)
  })

  it('should handle onRef when `component` is instance', () => {
    const Span = ({onRef}) => (
      <span ref={onRef} />
    )

    let span = null
    const handleRef = jest.fn(el => span = el)

    mount(
      <Element
        component={<Span onRef={handleRef} />}
        onRef={handleRef}
      />
    )

    expect(handleRef).toHaveBeenCalledTimes(2)
    expect(span instanceof HTMLElement).toBe(true)
  })
})
