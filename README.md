# 元素替换：合并 createElement 与 cloneElement 使用

😉

## 基本用法

```js
// 标签替换
<Element component='span'>text</Element>
// 构造函数替换
<Element component={Header}>text</Element>
// 实例替换
<Element component={<Link to='/' />}>text</Element>
```

## 其他用法

### 一： 防止意外属性传递到 DOM 元素

如防止 `to` 在条件不成立时到传递到 `div` 标签上：

```js
<Element
  className={styles.content}
  component={purchased ? <Link to={`/${live.id}`} /> : 'div'}
>
  Live
</Element>
```

### 二： 多个组件共用相同 DOM 元素

如一个组件有 Item 和 ItemInner 两层结构，Item + Item 有并列样式，ItemInner 有 `padding`，需要替换外层的元素为链接时。

```js
<ListItem component={Card} />
// 夸张的
<ListItem component={<Card component={Link} />} />
// 好玩的
<Element component={<Element component={<Element component={<Element component='span' />} />} />}>
```

### 三：生成容器而不生成 DOM 元素：

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

// 更通用的一种实现，定义一个切换组件：
const <Toggle> = ({popup, children: child}) => (
  ...
  <Element
    component={child}
    onClick={handleClick}
  >
    {child.props.children}
    <Element
      component={popup}
      isOpen={isOpen}
      onOpen={this.handleOpen}
    />
  </Element>
)

// 然后无论内外，属性都会传递，事件都会触发 —— 事件处理函数先定义先执行，属性后定义的覆盖先定义的（但 class 始终拼接起来）
<Toggle popup={<Popover onOpen={} />}>
  <Button onClick={} />
</Toggle>
```
