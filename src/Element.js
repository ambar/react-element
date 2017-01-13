/* eslint prefer-rest-params: 0 */
import cx from 'classnames'
import {cloneElement, createElement} from 'react'

const reEvent = /^on\w+$/
const isFunction = f => typeof f === 'function'

// 属性后定义后覆盖(除了 class 始终拼接起来），处理函数先定义先执行
const mergeProps = (destProps, srcProps) => {
  const className = cx(srcProps.className, destProps.className)
  const resultProps = {...destProps, ...srcProps, ...(className && {className})}
  // keep event handlers
  Object.keys(destProps).forEach(key => {
    const destHandler = destProps[key]
    const srcHandler = srcProps[key]
    if (isFunction(destHandler) && isFunction(srcHandler) && reEvent.test(key)) {
      resultProps[key] = function() {
        destHandler.apply(this, arguments)
        srcHandler.apply(this, arguments)
      }
    }
  })

  return resultProps
}

/**
 * 元素替换
 *
 *   // 标签替换
 *   <Element component='span'>text</Element>
 *   // 构造函数替换
 *   <Element component={Header}>text</Element>
 *   // 实例替换
 *   <Element component={<Link to='/' />}>text</Element>
 */
const Element = (props) => {
  const {component, children, ...ownProps} = props
  const type = typeof component
  if (['string', 'function'].includes(type)) {
    return createElement(component, ownProps, children)
  } else if (type === 'object') {
    const childProps = mergeProps(component.props, ownProps)
    if (children) {
      return cloneElement(component, childProps, children)
    }
    return cloneElement(component, childProps)
  }

  return null
}

export default Element