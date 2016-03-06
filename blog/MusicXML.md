MusicXML标记语言是一种利用XML语法标记乐谱的语言。这种语言可以成为各个打谱软件文档转换的中间语言（当然这么转换时会丢失打谱软件特有的元信息），也有利用操作和抽象保存音乐信息。显然，有了这个东西，不需要二进制音乐编码具体格式的知识也可以自动化作曲。只要支持XML的生成与操作即可。

MusicXML格式一般可以被打谱软件直接读取并且自动补全，从而也可以在打谱软件中直接播放或专成它们自己的格式或Midi。

XML语法类似HTML，不同的是XML更严格而且标记本质上是不受限的。

类型声明部分
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">

第一个标记是xml格式应该有的标记，第二个则标记了MusicXML的类型信息。

score-partwise  根节点
part-list  part（分谱/一个独立乐器对应一个分谱）的list
score-part  声明part，指派Id
part-name  指派part的name

part  分谱情况，指派id来与之前的声明相关联
measure  小节（四个四份音符/一个全音符一小节那个） number指派小节序数
attributes  小节属性
divisions  用256表示一个四分音符的长度
key  调（尼玛key是调？）
fifths C大调
time  4/4那个，beates拍 beat-type 拍类型
clef 谱号
sign 谱号符号
line 谱号位置（本来这个应该是用key推导出来的，不应该两个可以独立设定，不过看起来这个标记语言都是这么个搞法，比如音符时值可以独立于之前的配置设定）

note 音符
pitch 音高
step 乐音体系（比如钢琴上键从左往右可以根据左边的ABC..符号分成几个部分）中的区域
octave 八度，比如pitch音高里放step C octave 4就表示一个中央C的音高
duration 时值
type 显示出来的符号。居然与duration是独立的。。whole,half,quarter,eighth,16th,32nd,64th...这些
其实独立是因为这样可以表示浮点。。允许不同的浮点加法的话一个duration有不同的
音符类型+浮点对可以匹配，这时通过将type与duration分开来描述就可以顺便描述附点了
似乎又并非如此。。实际上最后的一系列<dot/>才是那个。。
