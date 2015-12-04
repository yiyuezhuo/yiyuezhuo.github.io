# -*- coding: utf-8 -*-
"""
Created on Fri Dec 04 15:58:53 2015

@author: yiyuezhuo
"""
import json

#实体们应该用类实现，然后各对象1输出字典格式，最后统一转成json由javascript读取

class Hex(object):
    def __init__(self):
        self.m=0
        self.n=0
        self.VP=0
        self.terrain='open'
        self.label=''
        self.capture=0#capture是谁占领着这个地区，一般只有VP点这个参数才有用。
    def to_dict(self):
        dic={'m':self.m,'n':self.n,'VP':self.VP,'terrain':self.terrain,
             'label':self.label,'capture':self.capture}
        return dic
        
        
class Unit(object):
    def __init__(self):
        self.id=0
        self.side=0
        self.m=0
        self.n=0
        self.combat=0
        self.movement=0
        self.VP=0
        self.label=''
        self.pad='infantry'
        self.img=''#这个应该是个静态地址，暂时不启用
        self.color={'font':(0,0,0),'box_border':(0,0,0),'box_back':(0,0,0),
                    'pad_back':(0,0,0),'pad_line':(0,0,0)}
    def to_dict(self):
        dic={'id':self.id,'side':self.side,'m':self.m,'n':self.n,'combat':self.combat,
        'movement':self.movement,'VP':self.VP,'label':self.label,'img':self.img,'color':self.color,
        'pad':self.pad}
        return dic
        
class Scenario(object):
    def __init__(self):
        self.unit_list=[]
        self.hex_list=[]
        self.size=(0,0)
    def to_json(self,sort=True):
        if sort:
            self.sort_id()
        unit_dic_list=[unit.to_dict() for unit in self.unit_list]
        hex_dic_list=[hexij.to_dict() for hexij in self.hex_list]
        big_dic={'unit_dic_list':unit_dic_list,'hex_dic_list':hex_dic_list,'size':self.size}
        return json.dumps(big_dic)
    def to_javascript(self,out_name='output.js',obj_name='scenario_dic'):
        s=self.to_json()
        ss='var '+obj_name+'='+s+';'
        f=open(out_name,'w')
        f.write(ss)
        f.close()
    def create_hexs(self,m,n):
        for i in range(m):
            for j in range(n):
                hexij=Hex()
                hexij.m=i
                hexij.n=j
                self.hex_list.append(hexij)
    def sort_id(self):
        #有这个方法就可以不用手工声明id了
        for i in  range(len(self.unit_list)):
            unit=self.unit_list[i]
            unit.id=i
    def add_unit(self,obj):
        self.unit_list.append(obj)
                
class Kingdom(Unit):
    def __init__(self):
        Unit.__init__(self)
        self.side=0
        self.combat=4
        self.movement=5
        self.VP=1
        self.label='Kindom soilder'
        self.color['font']=(255,255,255)
        self.color['box_border']=(0,0,0)
        self.color['box_back']=(110,110,220)
        self.color['pad_line']=(30,30,100)
        self.color['pad_back']=(150,150,150)
        
class Empire(Unit):
    def __init__(self):
        Unit.__init__(self)
        self.side=1
        self.combat=5
        self.movement=4
        self.VP=2
        self.label='Empire soilder'
        self.color['font']=(255,255,255)
        self.color['box_border']=(10,10,10)
        self.color['box_back']=(0,0,0)
        self.color['pad_line']=(0,0,0)
        self.color['pad_back']=(255,255,255)

                
size_m=20
size_n=20
scenario=Scenario()
scenario.create_hexs(size_m,size_n)
for i in range(10):
    unit=Kingdom()
    unit.m=i
    scenario.add_unit(unit)
for i in range(12):
    unit=Empire()
    unit.m=i
    unit.n=5
    scenario.add_unit(unit)
princess=Kingdom()
princess.combat=8
princess.movement=6
princess.VP=10
princess.n=1
princess.label='princess'
scenario.add_unit(princess)

scenario.size=(size_m,size_n)

scenario.to_javascript()
