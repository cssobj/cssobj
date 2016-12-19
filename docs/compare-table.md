# Compared With Similar Libs

*all the below libs will create CSS Rules from JS object*

| Lib                         | [cssobj][] | [glamor][] | [fela][]        | [styletron][] | [cxs][]    | [aphrodite][] |
|-----------------------------|------------|------------|-----------------|---------------|------------|---------------|
| Version                     | 1.0.1      | 2.20.12    | 4.1.0           | 2.2.0         | 3.0.0      | 1.1.0         |
| Size(min.gz)                | 4K         | 8K         | N/A             | N/A           | 6K         | 6K            |
| **Change rules at Runtime** | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | *NO*          |
| [Unicode Safe][uni]         | **YES**    | *NO*       | **YES**         | *NO*          | **YES**    | *NO*          |
| Nested Selector             | **YES**    | **YES**    | NotSupport      | NotSupport    | NotSupport | NotSupport    |
| [Comma Safe][comma]         | **YES**    | *NO*       | NotSupport      | NotSupport    | NotSupport | NotSupport    |
| [Ampersand Safe][amp]       | **YES**    | *NO*       | NotSupport      | NotSupport    | NotSupport | NotSupport    |
| [Keep Class Names][k]       | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | **YES**       |
| Nested @media               | **YES**    | **YES**    | **YES**         | **YES**       | **YES**    | **YES**       |
| [@media work in **IE8**][ie]| **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | *NO*          |
| Other @-rules               | **YES**    | **YES**    | **YES**         | **YES**       | **YES**    | **YES**       |
| CSS Virtual Node            | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | *NO*          |
| Auto Prefixer[In-Core]      | **YES**    | **YES**    | *NO*            | *NO*          | *NO*       | **YES**       |
| Function as CSS Value       | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | *NO*          |
| Conditional Apply           | **YES**    | *NO*       | **YES**[Plugin] | *NO*          | *NO*       | **YES**       |
| Inject To DOM               | **Auto**   | **Auto**   | *Manually*      | *Manually*    | *Manually* | **Auto**      |
| Server Rendering            | **YES**    | **YES**    | **YES**         | **YES**       | **YES**    | **YES**       |

[cssobj]: https://github.com/cssobj/cssobj
[glamor]: https://github.com/threepointone/glamor
[fela]: https://github.com/rofrischmann/fela/
[styletron]: https://github.com/rtsao/styletron
[cxs]: https://github.com/jxnblk/cxs
[aphrodite]: https://github.com/Khan/aphrodite

[uni]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-avoid-using-unicode-unsafe-regexp
[comma]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-split--comma-right
[amp]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-replace--char-right
[k]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-keep-original-class-names
[ie]: https://github.com/cssobj/cssobj/wiki/How-@media-work-in-IE8
