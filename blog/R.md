# R语言工作流

## 工作目录模型

命令行最简化。你应该可以在命令行输入R进入R解释器，就像Python一样。如果不行，就将R的安装路径/bin加入环境变量。
那里应该有R.exe之类的可执行文件。

有别于Python解释器，R交行式命令行的（用户定义的）全局变量空间或称为工作空间一般是要维持的，
这当然只不过是一种习惯，你也可以不维持它。你会在哪怕在命令行中用q()退出R交互式命令行时看到他问你是否要维持
当前的状态。如果维持的话，会更新/创建一些.文件（类似.gitignore）文件/文件夹提供自足的序列化。下次你在这个目
录打开R的时候，就像在有.git文件夹的目录打开git一样，就会发生一些不一样的事。当然这些设定使得R更像一个软件而不是编程语言。

由于可以通过这种方式恢复状态，所以管理状态，删除一些没用的变量也就成了有价值的事情，甚至退出之前手动删掉某些变
量还利用这个自带的强大的序列化/恢复工具。实现这一功能的就是rm，无比熟悉的名字，在git中我们也见过他，意义显而易见。

`help ?`（前置） 查阅相关内容`help`，使用字符串还能查看语句的文档
`help.search` 基本功能是搜索与字符串相关的文档，还能进一步定制
`example` 看相关命令的例子
`source` 执行（导入）特定R文件
`sink` 改变输出流，用此方法可以不使用文件模型来简便处理文件
`objects` 当前R环境/工作空间中的对象（名字）
`rm` 移除特定对象
`q` 正规退出，其实主要是利用它那个自带序列化的，不然直接关掉命令行就是

对于自带的简陋IDE来说，基本上只是把一些像这样的命令的使用GUI化了（如用路径选择器定位文件路径取代直接输入路径等）。

## 数据结构

点(.)在R语言中是可以用于变量名的，就像允许-当变量名的某些语言一样，这立即导致了滥用，我们经常看到用来分隔单词的
方法于R语言就是.，于netlogo是-，于Java是大小写，于Python是_(大小写分隔也是常见的)。当然这种命名上的任性除了导
致熟练其他语言阅读者的不适以外，它还削弱了它挪用的符号一般用来表示的结构。如使用-当变量名的的语言可能必须让-进
行空格分隔来标示它（虽然一般在其他语言也推荐这样做），把.牺牲掉则把整个对象模型的写法全部抛弃了，有趣的是，R语
言一个过人之处似乎就是它号称自己是完全对象化的。

### 向量

`assign <- -> =` 赋值函数/赋值运算符
`c` 构造一个向量（但当参数并不完全类型一致返回列表而非向量）
`sep` : 序列生成函数/操作符。sep同时可以表达numpy.arange与numpy.linspace的意义，前者可以通过指定by不指定length实现。后者可以通过指定length不指定by实现。但":"运算符"只能接受两个参数不能接受三个。python的range(len(l))写法（seq(length(l))）在R这里指定length在l是空向量时是有问题的，应该使用along关键字。seq(along=l)来表达完全对应的意思。
`rep` 重复一个向量生成一个新向量


`log exp sin cos tan min max sum` 意义显而易见
`prod` 返回向量乘积（然而取对数再加一般更佳）
`length` 返回向量元素个数（有别于len）
`mean` 返回向量均值(有别于average)
`var` 返回向量样本均值（减了1的那个）。返回协方差矩阵
`pmax pmin max`会自动合并自己接受的多个向量,pmax/pmin则逐个计算

`is.na` 对向量所有值判定其是否为na返回逻辑向量，不能使用na==因为na并不是一个常量

`paste` 类似python字符串的join方法

向量允许部分对应赋值（逻辑过滤表达式很好用1），但是长度不能因此改变

#### 命名向量 names vector

一个向量可以通过

    names(vector) <- string_vector

赋值来给其附加/创建命名（c的命名参数赋值可以达到相同效果）。当这么做时对应pandas的series结构
。也类似于字典，只不过其仍然保有顺序且是可选的（其实更像“命名元组”，不过从其使用的罕见也可以
看出来在数据处理之外这个结构并没有什么卵用）

#### 选择器 index

pandas和R里最实用的莫过于灵活的选择器/筛选器，特别是能使用逻辑向量来匹配和用部分赋值的方法。
选择部分里的部分要用到选择器，不同于python的是R里的-索引不表示倒数几个数而是表示从全集中去掉这数。
貌似公式里也是这样的，

### 数组和矩阵 array and matrix

数组与矩阵是向量（此时可以把向量仅仅当成一种在内存上一字排开的东西）加上Dim属性后生成的东西（array
就是接受一个向量与一个维度指示向量）。类型当然也会变，从而支持不同的运算。如矩阵乘(%*%,对比相应乘*)

`outer` %o% 数组外积 使用outer时可以指派"*"以外的运算符和函数。这可以实现类似meshgrid的效果，也就是一个数组（空间）里的所有点与另一个空间里的所有点经过那个运算符运算得到。

`solve` 这个函数在只接受一个方阵是求其逆，在接受一个矩阵和一个向量的情况下返回所对应的线性方程组的解。
R里似乎充满了这种尽量“重载”的写法，有的甚至不是“过程一致”（对2+成立的行为到了1就变成完全不同的另一种行为）的，有点令人不安。

`cbind rbind` 将两个矩阵从列或行拼接在一起

有内建函数进行矩阵的对角化（特征值与特征向量）分解，奇异值（svd）分解与qr分解。还能进行底层最小二乘拟合，不过这些都很少用到。


### 列表 list

R的列表倒有点像Python的字典或者JavaScript的对象（而不是Python，JavaScript中同名的那个东西）。
它的索引像那两个一样可以字符串索引和数字索引，但就JavaScript来说，还能提供自动的数字索引。
也像JavaScript，它的字典字段可以不用方括号（当然在这个列表变成了两重方括号）而用$取代点表达式访问，
这当然是奇丑无比的，可能是为与更丑的`[["key"]]`取值法想害相权取其轻吧。

### 数据框 data.frame

这个教程好像没怎么说这个最重要的东西

`data.frame` 构造函数使用的是类似pandas.DataFrame的基于列变量合并的方法。似乎没有看到基于行个体
（属性字典）那种方法。当然那种记录方法虽然具有某种方便性，却不是向量化友好的。

`attach` 相当于导入命名空间，不过它除了把一个路径里的东西导入当空间（从而不用用$去跨越路径索引它）。
还能作用到DataFrame对象上，把对象的属性拉出来。detach可以解绑。这倒是个非常交互式命令行友好的方法，然而对于开发并没有什么卵用。

### 因子 factor

因子看上去像字符串向量（事实上也可以直接传给factor构造一个因子），只不过他多了一个levels（水平）
属性作为字符向量的集合。在向量内部完成这种计算的是unique，在python中是set。

本质上来说，因子是从功能上搞出的数据类型，就像python的itertools里一堆其实没什么信息量的循环控制函数一样，
虽然没什么信息量（所以很容易用内建的循环实现/模拟），却明确指示了做什么，所以还是有用的。因子的功能就是
分类。当我们给定一个个体于数据框中的地区作为虚拟变量之类的东西的时候，这个地区就是一个因子，只不过在统计
软件之外一般并不赋予这个实质上的字符串向量/数组/列表什么特殊地位。

`tapply` 接受一个数据向量和一个因子和一个函数，将数据向量根据因子分类成不规则向量后对每个这样的向量作用函数。
比如从一个随机调查的`data.frame`中拿出收入列（作为数据向量）与地区列（作为因子），作用`mean`，得到不同地区的平
均收入。是很强的探索式工具，我在python用到pandas类似功能之前自己实现过起码三次以上。

把`factor`单独拿出来看时，最有用的结构是列联表/交叉表/频数表。可以通过table函数返回一个这样的表，如果是两个就是交叉表
，一个是单因子的频数表。

`cut` 可以将数值型变量进行区间分隔映到分类变量上。它接受数据向量与一个分位数向量。


## 数据类型

非常可怕的一点是，R里使用“未命名”的变量不会报错或返回undefined或null或none，而是会返回与变量名相同的字符串！
虽然这在科学计算（公式编写）时也许会带来某种方便，却是工程（调试）的噩梦。比如像这种xx+1（xx没定义）会返回'xx'。真是无语。

`as.XYZ` 强制转型为XYZ类型
`mode typeof` 返回类型(typeof比mode信息更细)
`length` 返回元素个数
`attributes` 返回对象非内在（mode,length之外）属性
`attr` 选择对象特定的属性

### 匿名函数

R的匿名函数看上去很想JavaScript的（匿名）函数。它的一个例子是

    function(x) sqrt(var(x)/length(x))

只是少了{}和return。但又比->函数写法丑。


## 文件载入

read.table 可以载入csv文档作为一个DataFrame

R语言对输入有严格的要求，一般它自己来处理这些输入进行数据整理是困难的，要么你自己用软件整理，要么用其他脚
本语言如Python整理。However，真那样我直接用Python不好吗。。。不过直接的csv文件也挺多的，也可以用载入excel的包处理。

不像pandas，貌似R里data.frame的行索引只能是一种比较弱的形式，之所以要求csv第一格必须是空的，可能是因为索引本身
就不纳入data.frame中的一列，它是“匿名”的。正因为它本来就较弱，所以也一般就直接用默认的行索引了。


## 概率分布

### 分布属性

python的 scipy.stats使用纯面向对象的方式管理分布。你可以从分布类冻结一个分布对象出来，你可以直接从分布类和类方法或
冻结对象其下辖的方法获取分位数，密度函数值等属性。然而在R里，却要用一种蹩脚的d,p,q,r（density,概率密度函数,prob 累
计分布函数,quad 分位函数，random 分布随机数生成器）前缀命名法来找到相应的函数，比如`pnorm(0,0,1)`返回标准正态分布于0
处的累计概率，即0.5。这就极大的污染的顶层命名空间，不知道R语言设计者怎么想的（比如，dt是t分布的密度分布函数，这与
这个词通常的意思是不是相差甚远恩？）。这种设计还对自动选择分布的底层操作带来了困难，可能凭空增加了一堆毫无意义的分支运算。

### 探索式分析（分布）

`summary` 返回一个向量的最小值，第一四分位数，中位数，均值，第三四分位数，最大值。
`stem` 返回茎叶“图”
`hist` 显示一张很丑的直方图。可以加参数进行密度估计
`qqplot` qq图
`boxplot` 箱图

`summary`返回的是一个加了名称索引的列表。这个倒不错，其显示形式美观，也可以直接用`[[]]`语法取值。同时做到了统计软件的
显示功能与进一步编程的取值功能。

### 假设检验

`shapiro.test Shapiro-Wilk`检验，检验正态性
`ks.test Kolmogorov-Smirnov`检验，检验与特定分布偏离性
`t.test` 检验两个样本均值是否具有显著差异（假设正态性，可进一步假设方差齐次）
`var.test` 方差齐次性检验
`wilcox.test Wilcoxon` 检验，检验样本均值是否具有显著差异（假设样本来自正常的连续分布）

## 条件控制与块结构

类似scheme,R语言所有操作都会返回值（这个特性称为表达式语言 expression language），所以出现了未定义变量名返回它自
己的字符串形式的杯具。

所以，控制语句与`scheme`一样，某种意义上都是"函数"，为了支持块，使用`{}`表示类似`begin`的意思。这产生了貌似类似通常
的分支与循环但事实上性能很低（比如它总会产生一个没用的值）的情况。

通常的控制语句与一般语言差不多，除了有一个`repeat`语句与用`next`代替`continue`外。

`ifelse` 向量化构造语句，根据真值选择两个向量中对应格中的值构成一个新向量。

## 自定义函数

### 导入结构

`source` 函数就是执行一遍所给定的脚本，与一般的脚本语言一样，所谓导入函数定义就是在全局命名空间运行给定脚本中将全
局变量名赋值了函数所绑定的。没什么特别之处。

`library` 是真正的导入方法，可以使用`::`,`:::`语法访问。

### 自定义函数

函数的定义方式类似JavaScript

    f <- function(){
        #something...
    }

`{}`是“成组”（什么鬼。。是group吗。。）或者就是begin。既然是begin那么就没有return，而是以最后一个语句的
值作为返回值。群组以换行或;作为分隔符。如果贯彻换行的行可以写成python风格的代码。

当然没有return未免太糟了，所以R又加入了return函数（有别于其他语言中作为没有括号包裹的“命令”）来返回值。

#### 自定义二元运算符

类似Haskell，R可以自定义二元运算符，以一种丑陋的形式。

    "%!%" <-function(x,y){blabla...} #注意引号

#### 命名参数

类似Python,形参里可以写命名参数，而且这么写时可以赋默认值。

#### 修改外部环境 <--

<- =是局部赋值的，<-- ，称为超越赋值(superassignmen)可以修改函数外部环境变量的值（修改全局变量或闭包的值，R是词法作用域的，支持闭包，但不要告诉我要用这种恶心的方法来实现面向对象），当然这显然并没有什么卵用。

### 环境配置

之前提到了R的环境持久化策略。这里看看R具体是怎么办的

首先R找到全局环境初始化文件Rprofile.site，这个文件一般是R自带的，不用配置，配置可以在原处修改或者重新指定系统变量位置。

然后R在当前目录试图寻找.Rprofile配置文件，这个文件一般是没有的也不会自动创建。

然后试图执行.RData，这是存放之前环境中全局变量的值之类的东西的地方。一般是有的。

然后执行.First函数，如果其在之前或者说在.RData里有定义的话。

类似的还有.Last函数。如果这个函数定义了那么在用q()退出时，在问你是否保存当前环境之后它会执行，打出一些"goodbye"之类的东西。

## 泛型函数与S3面向对象

由于历史原因，R语言内部存在S3,S4,RC三种面向对象的方法。其中S3是最早也是内建库使用的模式，S3是基于泛型函数的。
大概就是泛型函数作用于对象时，会根据对象自己的class属性展现不同的行为。

### attr与$的区别

以下指定一个变量的class属性方法是错误的

    x$class <- 'myclass'

事实上应该这样

    attr(x,'class')<-'myclass'

后者是真正的对象属性，前者实际上是把x看成列表，然后对它的class key赋予绑定'myclass'。这与JavaScript不同
而与Python类似（但Python中不能随便把变量就直接当成了字典，而必须先`={}`或`=dict()`一下才行。而且$虽然一般看成类似.
记法的替代物，但在这里却不然。`$`记法事实上是`__getitem__`的替代物。当然在JavaScript里这两个是一样的）。

`UseMethod` 定义一个泛型函数，UseMethod实际上利用字符串拼接自己的方法名与对象的类名去寻找泛型函数的一个具体的实现
，找到了就直接调用，没找到将把类名当做default再找一次，如果还没找到会报错。

比如，

    teacher <- function(x,...) UseMethod("ttt")

则teacher(x)会试图执行
`"teacher."+"class(x)"`函数，若class(x)值为"lecture"，则会试图执行
teacher.lecture方法，同时将x作为参数传入该方法的形参。
若没有teacher.lecture方法，则会试图执行teacher.default方法，若还是没有，则会报错。

这种写法显然是不符合面向对象封装原则的，而某种意义上符合多态。为了使用类似这样的泛型函数多态，
我们可能要模拟一个class定义,student与dog都有talk方法

    #开始定义student
    
    student <- function(x){obj=list(name=x);class(obj)<-'student';obj}
    talk.student <-function(x){cat("I am student",x$name)}#是的，与类似的JavaScript定义法顺序相反，先方法名再类名，真是反人类
    
    #开始定义dog
    
    dog <-function(x){obj=list(name=x);class(obj)<-'dog';obj}
    talk.dog <- function(x){cat("I am dog",x$name)}
    
    #然而，为了使用泛型函数还要定义泛型函数本身
    
    talk <- function(x) UseMethod("talk")

这样看来，最糟糕的一点可能是定义泛型函数本身这个过程，oop怎么着也不会需要这个过程。

## 统计模型

除了与statsmodels最简单一部分相同的内容完全没看懂。。果然还是要多学习一个。。

## 图形化工具

这个可以到时候查，基本上与matlab那种差不多。不过plot之类的函数有很多意思完全不一样的重载
。一个比较方便的是多重比较工具，可以打印诸变量所有二元组合的散点图。或者控制若干区间/因子后两个变量的散点图。

## 包

source只是运行那个脚本于顶层命名空间中。真正的包导入方式是library，之后包的函数可以利用::操作符来访问
（这尼玛一下`$`,一下`attr`一下`[]`一下`[[]]`一下`::`一下`:::`的就不能直接用.吗真扯淡）。

顶层命名空间有一些诸如dt之列的很扯淡的名字。如果无意中覆盖了他们，类似python的`__builtin__.xyz`
，R里可以使用`base::xyz`来始终保持对其的访问。

## 黑魔法

R语言直接输入函数名就可以看到其定义，结果我们会无意间发现一些看上去非常奇怪的内建函数（按通用编程语言的逻辑）
是如何实现的。这条回朔链会断在`.Primitive`上，显然该函数是在调用解释器内部的代码做些什么事情。到达此路的方案
是`c`,`UseMethod`等。

### 置换函数

#### ()调用重载

置换函数提供了一定的元编程/运算符重载能力，比如`names(x)<-c("a","b")`式赋值，左边不是并不是一个标识符，那在`<-`什么呢？
R语言也没有指针，不能做`*pt=10`之类的事。这实际上是发生了一个置换，这里是一个一般的置换模型，`f(x)<-y`会被置换为`x<-"f<-"(y)`。

#### []调用重载

另一个在传统编程语言里也经常见到的模式是`a[n]=3`.有趣的是在R语言这个也可以重载，它会被转换为函数`"[<-"`。
事实上`[]`取值运算符也会被重载。`"["(x,3)`等价于`x[3]`


### ...

函数在匹配时如果匹配到`...`，那么后面的参数是命名参数而且你指派了对应的名字，否则你的值进入`...`，
即使你使用的是关键字参数也一样进入`...`(如果与后面的不匹配)。这与Python区分`*argv`与`**kwarg`不一样。
另外`...`并不代表一个参数列表对象还是什么，它表示的是“未匹配的实参”，相当于Python*解包以后撑在函数调用格里的东西
，看成宏更好。

所以其造成的一个后果就是，以下语句并不是合法的：

    f=function(...)...

因为...并不是一个对象，但这样就是合法的。

    f=function(...)c(...)

这样f相当于就是c

可以想象一个一堆参数经过一个函数链，每个部分扣下一些参数留作己用或修改后换个或保留原名放上去的景象。
