# 元素替换

合并 createElement 与 cloneElement 的使用 😉

[![build status](https://badgen.net/travis/ambar/react-element)](https://travis-ci.org/ambar/react-element)
[![npm version](https://badgen.net/npm/v/react-element)](https://www.npmjs.com/package/react-element)
[![minzipped size](https://badgen.net/bundlephobia/minzip/react-element)](https://bundlephobia.com/result?p=react-element)


## 基本用法

```js
import Element from 'react-element'

// 标签替换
<Element component='span'>text</Element>
// 构造函数替换
<Element component={Header}>text</Element>
// 实例替换
<Element component={<Link to='/' />}>text</Element>
```

## 其他用例

### 一、防止意外属性传递到 DOM 元素

如防止 `to` 在条件不成立时到传递到 `div` 标签上：

```js
<Element
  className={styles.content}
  component={purchased ? <Link to={`/${live.id}`} /> : 'div'}
>
  Live
</Element>
```

### 二、多个组件共用相同 DOM 元素

如一个组件有 Item > ItemInner 两层结构，Item + Item 有并列样式，ItemInner 有 `padding`，需要替换外层的元素为链接时。

```js
// 一种组件两种特性
<ListItem component={Link} /> // => <a class={ListItem}><div class={ListItemContent}>...</
// 夸张的
<ListItem component={<Card component={Link} />} />
// 好玩的
<Element component={<Element component={<Element component={<Element component='span' />} />} />}>
```

### 三、生成容器而不生成 DOM 元素

如实现一个能触发弹层的组件，使它能包装在一个按钮上使用：

```js
// 定义 Tooltip
const Tooltip = ({children: child}) => (
  <Element component={child}>
    {child.props.children}
    <Popup />
  </Element>
)

// 使用 Tooltip
<Tooltip>
  <Button />
</Tooltip>
```

### 四、自动传播事件

后定义属性覆盖先定义的（class 会始终连接起来），先定义的处理函数先执行：

```js
// 实现方：定义一个切换组件（比「三」更通用的实现）：
const <Toggle> = ({popup, children: child}) => (
  ...
  <Element
    component={child}
    onClick={handleClick} // 自动传播的 onClick
  >
    {child.props.children}
    <Element
      component={popup}
      isOpen={isOpen} // 覆盖的属性，控制了 popup 显示
      onOpen={handleOpen} // 自动传播的 onOpen
    />
  </Element>
)

// 调用方：无论内外（调用方或实现方），属性都会传递，事件都会触发
<Toggle popup={<Tooltip placement='top' onOpen={} />}>
  <Button ghost onClick={} /> // 先执行的 onClick
</Toggle>
```

## FAQ

**`ref` 处理**

```js
// 原生标签使用 `onRef` 获取元素引用
<Element component='span' onRef={el => ...} />
// 构造函数和实例也能自动传递 `onRef` —— Element 会传递任意的 `on***` handler
<Element component={MyComponent} onRef={handleRef} />
```

**`component={null}` 的含义是什么？**

返回 children，不生成容器元素：

```js
<Element component={null}>
  <span>span</span>
</Element>
```
