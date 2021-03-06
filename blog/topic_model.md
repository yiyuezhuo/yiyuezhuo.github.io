Latent 潜在
Semantic 语义

Latent Semantic Analysis 潜在/隐含语义分析

Tf-Idf 

Latent Factor Model(LFM) 潜在变量/因子模型
Latent Dirichlet Allocation(LDA) 一种基于狄利克雷分布的文档生成模型
Random Projection 随机映射/投影
Topic Model(TM) 主题模型

潜在XX模型的一种简单形式是矩阵分解，这个过程一般发生了信息压缩（压缩即提取），那么用来压缩的“原则”就体现了我们想要从这种模型中获知的东西。

例如，对于用户（左或者说行索引）-商品（列索引）信息矩阵，矩阵中的每个项是用户对商品的某种度量，如偏好。这时我们假设（建模）用户们都属于一些类，他们对商品的喜好可以分解成他们属于类的程度与类对商品的喜好程度综合而来。用矩阵来表示，就是R=PQ。其中只要类的个数比商品数少到一定程度就是典型的矩阵分解式的信息压缩了。

然而在上面的讨论中，并没有指出实施这一分解的原则，甚至类数都没有进行约束，不妨假设类数是事先给定的。那么依然存在许多种不同的分解（因为分解一般是允许误差的，而且并不是误差最小者就是好的，也许误差太小就拟合了噪声）

对数似然度的导出

使用对数既然度很大程度上是因为我们通常假设观测的独立性，这样我们可以设生成分布对于一个特定事件的概率函数/概率密度函数（为了统一改叫似然函数likehood）是单次观测的乘积。于是似然函数就是一个连乘式，这在解析和计算上都会出现困难，而对于极大似然估计来说具体的似然值是不重要的，关键是取到最大值的点，所以我们可以取对数化成和式之后进行对数似然函数的最大化来进行极大似然估计。这时的对数似然值就是类似t值的一个计算的中间产物有一些意义，但一般用来进行定性检验是不是发生了异常（太大太小），在正常范围内就没什么意义。

EM算法

EM算法一般是用来估计隐含随机模型的参数的。一个隐含随机模型的“参数”，在EM算法看来，可以分为下面两种：

* 各个观测个体对于隐含类的隶属概率
* 隐含类作为分布的参数（这个分布可能产生的是多维数值向量或者就是个离散分布）

而我们最早获得的数据矩阵，如对于商品推荐问题而言，是用户对于各个商品的购买次数。这时我们的特定（确定参数后）隐含类就是一个分布，这个分布产生的观测就是一个一个表示各个商品购买次数的多维向量。我们想要估计的就是事先给定类的个数，用户属于哪些类以及这些类本身的参数。

EM算法使用迭代进行估计，每次迭代分为两步，E（Expectation ）与M(Maximization)（并不是把期望最大化的意思，这是分开的两步。）。初始化是随便生成一个完整参数向量，每步迭代经过两个步骤得到一个更优的参数向量。

E过程是根据各个隐含类的参数求解个体的对于各个类的隶属度。
M过程是根据各个个体的隶属度求解隐含类的参数。

可以考虑对于最简单的0,1隶属度来模拟运行一下上述估计过程。会发现极其简单。而对于概率隶属，则可以当成整体（参数和个体都是）来进行极大似然估计，没什么区别。

EM算法的数学分析表明，在类比较正常的情况下，EM算法保障收敛和每步的改进性，然而并不能保证全局最优性。

因为EM算法就是估计隐含类用的，所以隐含语义分析的模型估计中经常用/间接用到EM算法就不奇怪了。

在主题模型中使用EM算法对隐含主题进行探索的算法叫pLSA，Probabilistic Latent Semantic Analysis。其运行的基础是词语-文档矩阵，其中每个C_ij是词语在文档中出现的概率（频率）。所估计的从矩阵分解来看是词语-主题矩阵与主题-文档矩阵。单次观测可以看成一个文档，一个文档具有一个词概率向量作为其表特征。可以看做文档首先有一个主题，再根据主题对各词的（最简单的离散）分布生成而成。所以分布的假设就是离散分布，E过程就是固定了主题的离散分布去算各个文档的隶属度，M过程就是固定了文档的隶属度去算主题的离散分布。不知道为什么突然想到了K聚类也有点这个意思。